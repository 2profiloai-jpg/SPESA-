import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Smart suggestions endpoint
app.post("/api/suggestions", async (req, res) => {
  try {
    const { itemName, currentListItems = [] } = req.body;
    if (!itemName) {
      return res.status(400).json({ error: "itemName is required" });
    }

    const prompt = `L'utente ha appena aggiunto il seguente prodotto alla lista della spesa: "${itemName}".
Gli articoli già presenti nella lista sono: ${JSON.stringify(currentListItems)}.
Suggerisci 3 o 4 prodotti correlati (abbinamenti culinari tipici italiani, ingredienti complementari o prodotti spesso comprati insieme).
Rispondi RIGOROSAMENTE in formato JSON con uno schema di array di oggetti, dove ogni oggetto ha:
- name: string (nome del prodotto in italiano)
- category: string (una tra: "Frutta e verdura", "Latticini", "Carne e pesce", "Dispensa", "Bevande", "Pulizia casa", "Igiene personale", "Altro")
- reason: string (breve spiegazione amichevole del perché si abbina, es. "Ottimo con la pasta")`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["name", "category", "reason"]
          }
        }
      }
    });

    const suggestions = JSON.parse(response.text || "[]");
    res.json({ suggestions });
  } catch (error: any) {
    console.error("Error generating suggestions:", error);
    res.status(500).json({ error: error.message || "Errore nel generare i suggerimenti" });
  }
});

// Fallback recipes dictionary when AI service is unavailable or offline
const FALLBACK_RECIPES: Record<string, { recipeTitle: string; ingredients: { name: string; quantity: string; category: string }[] }> = {
  "carbonara": {
    recipeTitle: "Spaghetti alla Carbonara",
    ingredients: [
      { name: "Spaghetti", quantity: "400g", category: "Dispensa" },
      { name: "Guanciale", quantity: "150g", category: "Carne e pesce" },
      { name: "Uova fresche", quantity: "4 grandi", category: "Latticini" },
      { name: "Pecorino Romano", quantity: "100g", category: "Latticini" },
      { name: "Pepe nero in grani", quantity: "q.b.", category: "Dispensa" }
    ]
  },
  "lasagne": {
    recipeTitle: "Lasagne alla Bolognese",
    ingredients: [
      { name: "Sfoglie per lasagne", quantity: "1 confezione", category: "Dispensa" },
      { name: "Macinato misto", quantity: "500g", category: "Carne e pesce" },
      { name: "Passata di pomodoro", quantity: "700g", category: "Dispensa" },
      { name: "Besciamella", quantity: "500ml", category: "Latticini" },
      { name: "Mozzarella / Parmigiano", quantity: "200g", category: "Latticini" }
    ]
  },
  "tiramisù": {
    recipeTitle: "Tiramisù Tradizionale",
    ingredients: [
      { name: "Mascarpone", quantity: "500g", category: "Latticini" },
      { name: "Savoiardi", quantity: "1 confezione", category: "Dispensa" },
      { name: "Uova fresche", quantity: "4", category: "Latticini" },
      { name: "Caffè espresso", quantity: "300ml", category: "Dispensa" },
      { name: "Cacao amaro in polvere", quantity: "50g", category: "Dispensa" }
    ]
  },
  "minestrone": {
    recipeTitle: "Minestrone di Verdure",
    ingredients: [
      { name: "Verdure miste per minestrone", quantity: "1 kg", category: "Frutta e verdura" },
      { name: "Patate", quantity: "3 medie", category: "Frutta e verdura" },
      { name: "Legumi secchi o in scatola", quantity: "250g", category: "Dispensa" },
      { name: "Olio extravergine d'oliva", quantity: "1 bottiglia", category: "Dispensa" }
    ]
  },
  "parmigiana": {
    recipeTitle: "Parmigiana di Melanzane",
    ingredients: [
      { name: "Melanzane", quantity: "1 kg", category: "Frutta e verdura" },
      { name: "Passata di pomodoro", quantity: "700g", category: "Dispensa" },
      { name: "Mozzarella", quantity: "300g", category: "Latticini" },
      { name: "Parmigiano Reggiano", quantity: "100g", category: "Latticini" }
    ]
  },
  "pollo": {
    recipeTitle: "Pollo al Forno con Patate",
    ingredients: [
      { name: "Pollo a pezzi", quantity: "1 kg", category: "Carne e pesce" },
      { name: "Patate", quantity: "800g", category: "Frutta e verdura" },
      { name: "Rosmarino e aglio", quantity: "q.b.", category: "Frutta e verdura" },
      { name: "Olio d'oliva", quantity: "1 bottiglia", category: "Dispensa" }
    ]
  }
};

// Recipe ingredients parser
app.post("/api/recipe-ingredients", async (req, res) => {
  try {
    const { recipeName } = req.body;
    if (!recipeName) {
      return res.status(400).json({ error: "recipeName is required" });
    }

    const cleanName = recipeName.toLowerCase().trim();

    try {
      const prompt = `L'utente vuole preparare la ricetta o il piatto: "${recipeName}".
Elenca gli ingredienti principali necessari per preparare questo piatto tipico italiano, stimando quantità adeguate per una famiglia media e associando ciascun ingrediente al reparto del supermercato corretto.
Rispondi RIGOROSAMENTE in formato JSON con un oggetto contenente:
- recipeTitle: string (nome formattato della ricetta)
- ingredients: array di oggetti, ciascuno con:
  - name: string (nome prodotto)
  - quantity: string (es. "500g", "2", "1 bottiglia")
  - category: string (una tra: "Frutta e verdura", "Latticini", "Carne e pesce", "Dispensa", "Bevande", "Pulizia casa", "Igiene personale", "Altro")`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recipeTitle: { type: Type.STRING },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.STRING },
                    category: { type: Type.STRING }
                  },
                  required: ["name", "quantity", "category"]
                }
              }
            },
            required: ["recipeTitle", "ingredients"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      if (data && data.recipeTitle && Array.isArray(data.ingredients)) {
        return res.json(data);
      }
    } catch (aiErr) {
      console.warn("AI generation failed, using fallback recipe lookup:", aiErr);
    }

    // Fallback if AI call failed or returned empty result
    for (const key of Object.keys(FALLBACK_RECIPES)) {
      if (cleanName.includes(key)) {
        return res.json(FALLBACK_RECIPES[key]);
      }
    }

    // Generic fallback for any other dish
    return res.json({
      recipeTitle: recipeName,
      ingredients: [
        { name: `Ingredienti base per ${recipeName}`, quantity: "1 confezione", category: "Dispensa" },
        { name: "Olio d'oliva", quantity: "1 bottiglia", category: "Dispensa" },
        { name: "Sale e spezie", quantity: "q.b.", category: "Dispensa" }
      ]
    });
  } catch (error: any) {
    console.error("Error parsing recipe:", error);
    res.status(500).json({ error: error.message || "Errore nel generare gli ingredienti" });
  }
});

// Voice text parser
app.post("/api/parse-voice", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "text is required" });
    }

    const prompt = `Analizza questa frase detta a voce da un utente che vuole aggiungere qualcosa alla spesa: "${text}"
Estrai:
- name: string (nome pulito del prodotto)
- quantity: string (quantità estratta, es. "2", "1 kg", "una confezione", oppure "1" se non specificato)
- category: string (una tra: "Frutta e verdura", "Latticini", "Carne e pesce", "Dispensa", "Bevande", "Pulizia casa", "Igiene personale", "Altro")
Rispondi RIGOROSAMENTE in JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            quantity: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["name", "quantity", "category"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error parsing voice text:", error);
    res.status(500).json({ error: error.message || "Errore nell'interpretare la voce" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

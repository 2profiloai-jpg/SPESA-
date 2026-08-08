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

// Recipe ingredients parser
app.post("/api/recipe-ingredients", async (req, res) => {
  try {
    const { recipeName } = req.body;
    if (!recipeName) {
      return res.status(400).json({ error: "recipeName is required" });
    }

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
    res.json(data);
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

import React, { useState } from 'react';
import { BookOpen, Sparkles, Plus, Check, Loader2 } from 'lucide-react';
import { SupermarketCategory } from '../types';

interface RecipesViewProps {
  onAddRecipeIngredients: (ingredients: { name: string; quantity: string; category: SupermarketCategory }[]) => void;
  textSizeClass: string;
}

const POPULAR_RECIPES = [
  "Lasagne alla Bolognese",
  "Spaghetti alla Carbonara",
  "Torta di Mele casalinga",
  "Minestrone di Verdure",
  "Parmigiana di Melanzane",
  "Pollo al Forno con Patate"
];

export const RecipesView: React.FC<RecipesViewProps> = ({
  onAddRecipeIngredients,
  textSizeClass,
}) => {
  const [customRecipe, setCustomRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentRecipeData, setCurrentRecipeData] = useState<{
    recipeTitle: string;
    ingredients: { name: string; quantity: string; category: SupermarketCategory }[];
  } | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchRecipeIngredients = async (recipeName: string) => {
    setLoading(true);
    setError('');
    setCurrentRecipeData(null);
    setAddedSuccess(false);

    try {
      const res = await fetch('/api/recipe-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore');
      setCurrentRecipeData(data);
    } catch (err: any) {
      setError(err.message || 'Impossibile trovare gli ingredienti.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAll = () => {
    if (currentRecipeData && currentRecipeData.ingredients.length > 0) {
      onAddRecipeIngredients(currentRecipeData.ingredients);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
            <BookOpen size={36} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Cucina con le Ricette</h2>
            <p className="text-slate-500 text-base">Scegli un piatto e l'intelligenza artificiale aggiungerà tutti gli ingredienti necessari alla tua lista della spesa.</p>
          </div>
        </div>

        {/* Custom recipe input */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Scrivi un piatto (es. Tiramisù, Risotto ai funghi)..."
            value={customRecipe}
            onChange={(e) => setCustomRecipe(e.target.value)}
            className="flex-1 p-4 border-2 border-slate-300 rounded-2xl text-xl focus:border-emerald-600 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
          />
          <button
            onClick={() => {
              if (customRecipe.trim()) fetchRecipeIngredients(customRecipe.trim());
            }}
            disabled={loading || !customRecipe.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-lg flex items-center justify-center gap-2 transition"
          >
            {loading ? <Loader2 className="animate-spin" size={26} /> : <Sparkles size={26} />}
            Cerca Ingredienti
          </button>
        </div>

        {/* Popular Recipes Grid */}
        <div className="mt-6 pt-6 border-t-2 border-slate-100">
          <p className="text-slate-500 font-bold mb-3 text-base">⭐ Piatti popolari suggeriti:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {POPULAR_RECIPES.map((recipe, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCustomRecipe(recipe);
                  fetchRecipeIngredients(recipe);
                }}
                className="bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-900 font-bold p-4 rounded-2xl text-left text-lg transition flex items-center justify-between group shadow-xs"
              >
                <span>{recipe}</span>
                <Sparkles size={20} className="text-emerald-600 group-hover:scale-125 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200 shadow-md">
          <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={56} />
          <h3 className="text-2xl font-bold text-slate-700">Sto calcolando gli ingredienti con l'intelligenza artificiale...</h3>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border-3 border-red-300 p-6 rounded-3xl text-red-800 text-xl font-bold text-center">
          {error}
        </div>
      )}

      {/* Recipe Ingredients Result */}
      {currentRecipeData && !loading && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-3 border-emerald-400 space-y-6 animate-in fade-in zoom-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                Ricetta Selezionata
              </span>
              <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{currentRecipeData.recipeTitle}</h3>
            </div>
            <button
              onClick={handleAddAll}
              disabled={addedSuccess}
              className={`font-bold py-4 px-8 rounded-2xl text-xl shadow-lg flex items-center gap-3 transition ${addedSuccess ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
            >
              {addedSuccess ? <Check size={28} strokeWidth={3} /> : <Plus size={28} strokeWidth={3} />}
              {addedSuccess ? 'Aggiunti alla spesa!' : 'Aggiungi Tutti alla Spesa'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentRecipeData.ingredients.map((ing, idx) => (
              <div key={idx} className="bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-slate-800 block">{ing.name}</span>
                  <span className="text-sm font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-block mt-1">
                    {ing.quantity} • {ing.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

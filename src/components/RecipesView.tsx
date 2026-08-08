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
    <div className="max-w-5xl mx-auto px-3 py-3 space-y-4">
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-amber-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
            <BookOpen size={22} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">Cucina con le Ricette</h2>
            <p className="text-slate-500 text-xs">Scegli un piatto e l'intelligenza artificiale aggiungerà tutti gli ingredienti necessari alla tua lista della spesa.</p>
          </div>
        </div>

        {/* Custom recipe input */}
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Scrivi un piatto (es. Tiramisù, Carbonara)..."
            value={customRecipe}
            onChange={(e) => setCustomRecipe(e.target.value)}
            className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
          />
          <button
            onClick={() => {
              if (customRecipe.trim()) fetchRecipeIngredients(customRecipe.trim());
            }}
            disabled={loading || !customRecipe.trim()}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 transition"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Cerca Ingredienti
          </button>
        </div>

        {/* Popular Recipes Grid */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-slate-500 font-bold mb-2 text-xs">⭐ Piatti popolari suggeriti:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {POPULAR_RECIPES.map((recipe, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCustomRecipe(recipe);
                  fetchRecipeIngredients(recipe);
                }}
                className="bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-900 font-bold p-2.5 rounded-xl text-left text-xs transition flex items-center justify-between group shadow-2xs"
              >
                <span>{recipe}</span>
                <Sparkles size={14} className="text-sky-600 group-hover:scale-110 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-2xs">
          <Loader2 className="animate-spin text-amber-600 mx-auto mb-2" size={32} />
          <h3 className="text-xs sm:text-sm font-bold text-slate-700">Sto calcolando gli ingredienti con l'intelligenza artificiale...</h3>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-300 p-3 rounded-2xl text-red-800 text-xs font-bold text-center">
          {error}
        </div>
      )}

      {/* Recipe Ingredients Result */}
      {currentRecipeData && !loading && (
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-amber-400 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                Ricetta Selezionata
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 mt-1">{currentRecipeData.recipeTitle}</h3>
            </div>
            <button
              onClick={handleAddAll}
              disabled={addedSuccess}
              className={`font-bold py-2 px-4 rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition ${addedSuccess ? 'bg-amber-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
            >
              {addedSuccess ? <Check size={18} strokeWidth={3} /> : <Plus size={18} strokeWidth={3} />}
              {addedSuccess ? 'Aggiunti alla spesa!' : 'Aggiungi Tutti alla Spesa'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentRecipeData.ingredients.map((ing, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block">{ing.name}</span>
                  <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.2 rounded-full inline-block mt-0.5">
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

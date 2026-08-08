import React, { useState } from 'react';
import { Plus, Check, Trash2, Mic, Sparkles, AlertCircle, ShoppingCart } from 'lucide-react';
import { ListItem, SupermarketCategory, SmartSuggestion } from '../types';

interface ShoppingListViewProps {
  items: ListItem[];
  onAddItem: (name: string, quantity: string, category: SupermarketCategory) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onOpenVoice: () => void;
  suggestions: SmartSuggestion[];
  onAddSuggestion: (suggestion: SmartSuggestion) => void;
  textSizeClass: string;
}

const CATEGORIES: SupermarketCategory[] = [
  "Frutta e verdura",
  "Latticini",
  "Carne e pesce",
  "Dispensa",
  "Bevande",
  "Pulizia casa",
  "Igiene personale",
  "Altro"
];

const PRESETS = [
  { name: 'Latte', quantity: '1 litro', category: 'Latticini' as SupermarketCategory },
  { name: 'Pane', quantity: '1 filone', category: 'Dispensa' as SupermarketCategory },
  { name: 'Uova', quantity: '6 pezzi', category: 'Latticini' as SupermarketCategory },
  { name: 'Acqua naturale', quantity: '6 bottiglie', category: 'Bevande' as SupermarketCategory },
  { name: 'Frutta fresca', quantity: '1 kg', category: 'Frutta e verdura' as SupermarketCategory },
  { name: 'Pasta', quantity: '1 kg', category: 'Dispensa' as SupermarketCategory },
  { name: 'Caffè', quantity: '2 pacchetti', category: 'Dispensa' as SupermarketCategory },
  { name: 'Carta igienica', quantity: '1 confezione', category: 'Igiene personale' as SupermarketCategory },
];

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onOpenVoice,
  suggestions,
  onAddSuggestion,
  textSizeClass,
}) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState<SupermarketCategory>('Dispensa');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim()) {
      onAddItem(itemName.trim(), quantity.trim() || '1', category);
      setItemName('');
      setQuantity('1');
    }
  };

  const handlePresetClick = (preset: { name: string; quantity: string; category: SupermarketCategory }) => {
    onAddItem(preset.name, preset.quantity, preset.category);
  };

  // Group items by category
  const activeItems = items.filter(i => !i.checked);
  const completedItems = items.filter(i => i.checked);

  return (
    <div className="max-w-5xl mx-auto px-3 py-3 space-y-4">
      {/* Add Item Card */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-amber-300">
        <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
          <Plus className="bg-amber-100 text-amber-700 p-1 rounded-lg" size={24} />
          Aggiungi un prodotto alla spesa
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <div className="md:col-span-6">
              <label className="block text-slate-700 font-bold mb-1 text-xs sm:text-sm">Cosa ti serve?</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Es. Latte, mele, pasta..."
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
                />
                <button
                  type="button"
                  onClick={onOpenVoice}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 rounded-xl shadow-2xs flex items-center justify-center transition"
                  title="Detta con la voce"
                >
                  <Mic size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-slate-700 font-bold mb-1 text-xs sm:text-sm">Quantità</label>
              <input
                type="text"
                placeholder="Es. 2, 1 kg, confezioni"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-slate-700 font-bold mb-1 text-xs sm:text-sm">Reparto</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SupermarketCategory)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!itemName.trim()}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-extrabold py-2.5 rounded-xl shadow-xs text-xs sm:text-sm flex items-center justify-center gap-2 transition"
          >
            <Plus size={18} strokeWidth={3} />
            Aggiungi alla Lista
          </button>
        </form>

        {/* Quick Presets */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <p className="text-slate-500 font-bold mb-2 text-xs">💡 Aggiunta rapida con un tocco:</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(preset)}
                className="bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 font-semibold py-1 px-2.5 rounded-lg text-xs transition flex items-center gap-1 shadow-2xs"
              >
                <Plus size={14} className="text-sky-600" />
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Suggestions Bar */}
      {suggestions.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-400 text-slate-900 p-1.5 rounded-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-900">Suggerimenti intelligenti per te</h3>
              <p className="text-amber-800 text-[11px]">Prodotti spesso abbinati o necessari in base alla tua spesa:</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => onAddSuggestion(sug)}
                className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold py-1.5 px-3 rounded-xl shadow-2xs text-xs flex items-center gap-1.5 transition group"
              >
                <Plus size={14} className="text-amber-600 group-hover:scale-110 transition-transform" />
                <span>{sug.name}</span>
                <span className="text-[10px] bg-sky-100 text-sky-900 px-1.5 py-0.2 rounded-full font-bold">
                  {sug.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shopping List Items by Department */}
      <div className="space-y-3">
        <h2 className="text-sm sm:text-base font-black text-slate-800 flex items-center justify-between">
          <span>🛒 Reparti del Supermercato</span>
          <span className="text-xs font-bold bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full border border-sky-300">
            {activeItems.length} prodotti da comprare
          </span>
        </h2>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-slate-200 shadow-2xs">
            <ShoppingCart size={40} className="mx-auto text-slate-300 mb-2" />
            <h3 className="text-base sm:text-lg font-bold text-slate-700 mb-1">La tua lista è vuota</h3>
            <p className="text-slate-500 text-xs sm:text-sm">Aggiungi il primo prodotto usando la casella sopra o il microfono!</p>
          </div>
        ) : (
          CATEGORIES.map((category) => {
            const catItems = items.filter(i => i.category === category);
            if (catItems.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    {category}
                  </h3>
                  <span className="bg-white text-slate-700 px-2 py-0.5 rounded-full font-bold text-[11px] border border-slate-200">
                    {catItems.filter(i => i.checked).length} / {catItems.length}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2.5 sm:p-3 flex items-center justify-between gap-3 transition ${item.checked ? 'bg-sky-50/60' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => onToggleItem(item.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition ${item.checked ? 'bg-sky-600 border-sky-600 text-white shadow-2xs' : 'border-slate-300 bg-white hover:border-amber-500'}`}
                          aria-label={item.checked ? "Segna come da comprare" : "Segna come acquistato"}
                        >
                          {item.checked && <Check size={18} strokeWidth={3} />}
                        </button>
                        <div>
                          <span className={`font-bold text-xs sm:text-sm block ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {item.name}
                          </span>
                          <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.2 rounded-full inline-block mt-0.5">
                            Quantità: {item.quantity}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Elimina prodotto"
                        aria-label="Elimina"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

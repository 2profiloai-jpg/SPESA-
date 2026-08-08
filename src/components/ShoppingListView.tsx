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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Info Card / How it works */}
      <div className="bg-sky-50 border-2 border-sky-300 rounded-3xl p-6 shadow-sm text-sky-900 space-y-2">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span>💡 Come funziona Spesa Facile?</span>
        </h3>
        <ul className="space-y-1.5 text-base font-medium">
          <li>• <strong>I prodotti non si cancellano mai da soli:</strong> restano in lista finché non tocchi la spunta (✅) per segnarli come presi o il cestino.</li>
          <li>• <strong>Quando rifai la spesa:</strong> usa i tab <strong>&ldquo;Da Ricomprare&rdquo;</strong> o <strong>&ldquo;Storico&rdquo;</strong> per aggiungere i tuoi prodotti abituali in un solo tap senza riscriverli!</li>
        </ul>
      </div>

      {/* Add Item Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-300">
        <h2 className={`font-bold text-slate-800 mb-4 flex items-center gap-3 ${textSizeClass === 'text-xl' ? 'text-2xl' : textSizeClass === 'text-2xl' ? 'text-3xl' : 'text-xl'}`}>
          <Plus className="bg-amber-100 text-amber-700 p-2 rounded-xl" size={36} />
          Aggiungi un prodotto alla spesa
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-slate-700 font-bold mb-2 text-lg">Cosa ti serve?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Es. Latte, mele, pasta..."
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full p-4 border-2 border-slate-300 rounded-2xl text-xl focus:border-amber-500 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
                />
                <button
                  type="button"
                  onClick={onOpenVoice}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 rounded-2xl shadow-md flex items-center justify-center transition"
                  title="Detta con la voce"
                >
                  <Mic size={28} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-slate-700 font-bold mb-2 text-lg">Quantità</label>
              <input
                type="text"
                placeholder="Es. 2, 1 kg, confezioni"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-4 border-2 border-slate-300 rounded-2xl text-xl focus:border-amber-500 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-slate-700 font-bold mb-2 text-lg">Reparto</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SupermarketCategory)}
                className="w-full p-4 border-2 border-slate-300 rounded-2xl text-lg focus:border-amber-500 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
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
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-extrabold py-5 rounded-2xl shadow-lg text-xl flex items-center justify-center gap-3 transition"
          >
            <Plus size={28} strokeWidth={3} />
            Aggiungi alla Lista
          </button>
        </form>

        {/* Quick Presets */}
        <div className="mt-6 pt-6 border-t-2 border-slate-100">
          <p className="text-slate-500 font-bold mb-3 text-base">💡 Aggiunta rapida con un tocco:</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(preset)}
                className="bg-sky-50 hover:bg-sky-100 text-sky-900 border-2 border-sky-300 font-bold py-2.5 px-4 rounded-xl text-base transition flex items-center gap-2 shadow-xs"
              >
                <Plus size={18} className="text-sky-600" />
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Suggestions Bar (Core Feature) */}
      {suggestions.length > 0 && (
        <div className="bg-amber-50 border-3 border-amber-400 rounded-3xl p-6 shadow-md animate-in fade-in duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-amber-400 text-slate-900 p-2.5 rounded-xl">
              <Sparkles size={26} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900">Suggerimenti intelligenti per te</h3>
              <p className="text-amber-800 text-sm">Prodotti spesso abbinati o necessari in base alla tua spesa:</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => onAddSuggestion(sug)}
                className="bg-white hover:bg-amber-100 text-amber-900 border-2 border-amber-400 font-bold py-3 px-5 rounded-2xl shadow-sm text-base flex items-center gap-2 transition group"
              >
                <Plus size={20} className="text-amber-600 group-hover:scale-125 transition-transform" />
                <span>{sug.name}</span>
                <span className="text-xs bg-sky-100 text-sky-900 px-2 py-0.5 rounded-full font-bold">
                  {sug.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shopping List Items by Department */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-800 flex items-center justify-between">
          <span>🛒 Reparti del Supermercato</span>
          <span className="text-sm font-bold bg-sky-100 text-sky-900 px-3 py-1 rounded-full border border-sky-300">
            {activeItems.length} da comprare {completedItems.length > 0 && `• ${completedItems.length} presi`}
          </span>
        </h2>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200 shadow-sm">
            <ShoppingCart size={64} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">La tua lista è vuota</h3>
            <p className="text-slate-500 text-lg">Aggiungi il primo prodotto usando la casella sopra o il microfono!</p>
          </div>
        ) : (
          CATEGORIES.map((category) => {
            const catItems = items.filter(i => i.category === category);
            if (catItems.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-3xl shadow-md border-2 border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-6 py-4 border-b-2 border-slate-200 flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-800 text-xl flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    {category}
                  </h3>
                  <span className="bg-white text-slate-700 px-3 py-1 rounded-full font-bold text-sm shadow-xs border border-slate-200">
                    {catItems.filter(i => i.checked).length} / {catItems.length}
                  </span>
                </div>

                <div className="divide-y-2 divide-slate-100">
                  {catItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 flex items-center justify-between gap-4 transition ${item.checked ? 'bg-sky-50/60' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => onToggleItem(item.id)}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center border-3 transition ${item.checked ? 'bg-sky-600 border-sky-600 text-white shadow-md' : 'border-slate-300 bg-white hover:border-amber-500'}`}
                          aria-label={item.checked ? "Segna come da comprare" : "Segna come acquistato"}
                        >
                          {item.checked && <Check size={26} strokeWidth={3} />}
                        </button>
                        <div>
                          <span className={`font-bold text-xl block ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {item.name}
                          </span>
                          <span className="text-sm font-semibold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full inline-block mt-1">
                            Quantità: {item.quantity}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition"
                        title="Elimina prodotto"
                        aria-label="Elimina"
                      >
                        <Trash2 size={24} />
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

import React, { useState } from 'react';
import { Package, Plus, Trash2, ShoppingCart, Check } from 'lucide-react';
import { PantryItem, SupermarketCategory } from '../types';

interface PantryViewProps {
  pantryItems: PantryItem[];
  onAddPantryItem: (name: string, quantity: string, category: SupermarketCategory) => void;
  onDeletePantryItem: (id: string) => void;
  onMoveToShoppingList: (item: PantryItem) => void;
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

export const PantryView: React.FC<PantryViewProps> = ({
  pantryItems,
  onAddPantryItem,
  onDeletePantryItem,
  onMoveToShoppingList,
  textSizeClass,
}) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState<SupermarketCategory>('Dispensa');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPantryItem(name.trim(), quantity.trim() || '1', category);
      setName('');
      setQuantity('1');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 py-3 space-y-4">
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-amber-300">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
            <Package size={22} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">Dispensa Virtuale</h2>
            <p className="text-slate-500 text-xs">Segna qui cosa hai già in casa per evitare di comprarlo per errore.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mt-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <div className="md:col-span-6">
              <label className="block text-slate-700 font-bold mb-1 text-xs sm:text-sm">Nome Prodotto</label>
              <input
                type="text"
                placeholder="Es. Olio d'oliva, Sale, Zucchero..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-slate-700 font-bold mb-1 text-xs sm:text-sm">Quantità in casa</label>
              <input
                type="text"
                placeholder="Es. 2 bottiglie"
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
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-extrabold py-2.5 rounded-xl shadow-xs text-xs sm:text-sm flex items-center justify-center gap-2 transition"
          >
            <Plus size={18} strokeWidth={3} />
            Aggiungi alla Dispensa
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-black text-slate-800">📦 Prodotti presenti in dispensa ({pantryItems.length})</h3>

        {pantryItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-slate-200 shadow-2xs">
            <Package size={40} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm sm:text-base font-bold text-slate-700 mb-1">La tua dispensa è vuota</h4>
            <p className="text-slate-500 text-xs sm:text-sm">Aggiungi i prodotti che hai già in casa.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {pantryItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block">{item.name}</span>
                  <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    Quantità: {item.quantity} • {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onMoveToShoppingList(item)}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold p-2 rounded-xl shadow-2xs flex items-center gap-1 text-xs transition"
                    title="Aggiungi alla lista della spesa"
                  >
                    <ShoppingCart size={16} />
                    <span className="hidden sm:inline">Alla spesa</span>
                  </button>
                  <button
                    onClick={() => onDeletePantryItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Rimuovi"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
            <Package size={36} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Dispensa Virtuale</h2>
            <p className="text-slate-500 text-base">Segna qui cosa hai già in casa per evitare di comprarlo per errore.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-slate-700 font-bold mb-2 text-lg">Nome Prodotto</label>
              <input
                type="text"
                placeholder="Es. Olio d'oliva, Sale, Zucchero..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 border-2 border-slate-300 rounded-2xl text-xl focus:border-emerald-600 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-slate-700 font-bold mb-2 text-lg">Quantità in casa</label>
              <input
                type="text"
                placeholder="Es. 2 bottiglie"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-4 border-2 border-slate-300 rounded-2xl text-xl focus:border-emerald-600 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-slate-700 font-bold mb-2 text-lg">Reparto</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SupermarketCategory)}
                className="w-full p-4 border-2 border-slate-300 rounded-2xl text-lg focus:border-emerald-600 focus:outline-hidden bg-slate-50 text-slate-900 font-medium"
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
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold py-5 rounded-2xl shadow-lg text-xl flex items-center justify-center gap-3 transition"
          >
            <Plus size={28} strokeWidth={3} />
            Aggiungi alla Dispensa
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-black text-slate-800">📦 Prodotti presenti in dispensa ({pantryItems.length})</h3>

        {pantryItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200 shadow-sm">
            <Package size={64} className="mx-auto text-slate-300 mb-4" />
            <h4 className="text-2xl font-bold text-slate-700 mb-2">La tua dispensa è vuota</h4>
            <p className="text-slate-500 text-lg">Aggiungi i prodotti che hai già in casa.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pantryItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-md flex items-center justify-between gap-4">
                <div>
                  <span className="text-xl font-bold text-slate-800 block">{item.name}</span>
                  <span className="text-sm font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full inline-block mt-1">
                    Quantità: {item.quantity} • {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onMoveToShoppingList(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-2xl shadow-md flex items-center gap-2 text-base transition"
                    title="Aggiungi alla lista della spesa"
                  >
                    <ShoppingCart size={20} />
                    <span className="hidden sm:inline">Alla spesa</span>
                  </button>
                  <button
                    onClick={() => onDeletePantryItem(item.id)}
                    className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition"
                    title="Rimuovi"
                  >
                    <Trash2 size={24} />
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

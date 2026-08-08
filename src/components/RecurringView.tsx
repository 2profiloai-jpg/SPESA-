import React from 'react';
import { Clock, Plus, ShoppingCart } from 'lucide-react';
import { ListItem, SupermarketCategory } from '../types';

interface RecurringViewProps {
  recurringItems: { name: string; category: SupermarketCategory; quantity: string; daysAgo: number }[];
  onAddRecurringItem: (name: string, quantity: string, category: SupermarketCategory) => void;
  textSizeClass: string;
}

export const RecurringView: React.FC<RecurringViewProps> = ({
  recurringItems,
  onAddRecurringItem,
  textSizeClass,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-100 p-3 rounded-2xl text-amber-700">
            <Clock size={36} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Promemoria Ricorrenze</h2>
            <p className="text-slate-500 text-base">In base ai tuoi acquisti abituali, ecco i prodotti che potresti aver finito e che compri regolarmente.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-black text-slate-800">⏰ Prodotti da ricomprare</h3>

        {recurringItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200 shadow-sm">
            <Clock size={64} className="mx-auto text-slate-300 mb-4" />
            <h4 className="text-2xl font-bold text-slate-700 mb-2">Nessun promemoria attivo</h4>
            <p className="text-slate-500 text-lg">Continua a fare la spesa e l'app imparerà le tue abitudini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recurringItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-md flex items-center justify-between gap-4">
                <div>
                  <span className="text-xl font-bold text-slate-800 block">{item.name}</span>
                  <span className="text-sm font-semibold text-amber-800 bg-amber-100 px-3 py-1 rounded-full inline-block mt-1">
                    Comprato {item.daysAgo} giorni fa • {item.category}
                  </span>
                </div>

                <button
                  onClick={() => onAddRecurringItem(item.name, item.quantity, item.category)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-2xl shadow-md flex items-center gap-2 text-base transition"
                  title="Aggiungi alla lista"
                >
                  <Plus size={22} strokeWidth={3} />
                  <span>Aggiungi</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

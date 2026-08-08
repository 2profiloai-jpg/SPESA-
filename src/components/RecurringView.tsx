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
    <div className="max-w-5xl mx-auto px-3 py-3 space-y-4">
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-amber-300">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
            <Clock size={22} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">Promemoria Ricorrenze</h2>
            <p className="text-slate-500 text-xs">Prodotti che compri regolarmente e potresti aver finito.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-black text-slate-800">⏰ Prodotti da ricomprare</h3>

        {recurringItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-slate-200 shadow-2xs">
            <Clock size={40} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm sm:text-base font-bold text-slate-700 mb-1">Nessun promemoria attivo</h4>
            <p className="text-slate-500 text-xs sm:text-sm">Continua a fare la spesa e l'app imparerà le tue abitudini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {recurringItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-3 border border-amber-300 shadow-2xs flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block">{item.name}</span>
                  <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    Comprato {item.daysAgo} giorni fa • {item.category}
                  </span>
                </div>

                <button
                  onClick={() => onAddRecurringItem(item.name, item.quantity, item.category)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3 rounded-xl shadow-2xs flex items-center gap-1 text-xs transition"
                  title="Aggiungi alla lista"
                >
                  <Plus size={16} strokeWidth={3} />
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

import React from 'react';
import { History, Plus } from 'lucide-react';
import { HistoryItem, SupermarketCategory } from '../types';

interface HistoryViewProps {
  historyItems: HistoryItem[];
  onAddHistoryItem: (name: string, category: SupermarketCategory) => void;
  textSizeClass: string;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  historyItems,
  onAddHistoryItem,
  textSizeClass,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-3 py-3 space-y-4">
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-amber-300">
        <div className="flex items-center gap-2">
          <div className="bg-sky-100 p-2 rounded-xl text-sky-700">
            <History size={22} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">Storico Acquisti</h2>
            <p className="text-slate-500 text-xs">Tutti i prodotti acquistati nel tempo. Clicca su uno per reinserirlo subito.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-black text-slate-800">📜 Prodotti passati ({historyItems.length})</h3>

        {historyItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-slate-200 shadow-2xs">
            <History size={40} className="mx-auto text-slate-300 mb-2" />
            <h4 className="text-sm sm:text-base font-bold text-slate-700 mb-1">Nessun acquisto nello storico</h4>
            <p className="text-slate-500 text-xs sm:text-sm">I prodotti acquistati appariranno qui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {historyItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block">{item.name}</span>
                  <span className="text-[11px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full inline-block mt-1">
                    Acquistato {item.frequency} {item.frequency === 1 ? 'volta' : 'volte'} • {item.category}
                  </span>
                </div>

                <button
                  onClick={() => onAddHistoryItem(item.name, item.category)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3 rounded-xl shadow-2xs flex items-center gap-1 text-xs transition"
                  title="Aggiungi alla spesa"
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>Riprendi</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

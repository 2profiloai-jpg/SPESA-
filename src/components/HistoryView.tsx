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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-sky-100 p-3 rounded-2xl text-sky-700">
            <History size={36} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Storico Acquisti</h2>
            <p className="text-slate-500 text-base">Tutti i prodotti acquistati nel tempo. Clicca su uno per reinserirlo subito nella lista della spesa.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-black text-slate-800">📜 Prodotti passati ({historyItems.length})</h3>

        {historyItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200 shadow-sm">
            <History size={64} className="mx-auto text-slate-300 mb-4" />
            <h4 className="text-2xl font-bold text-slate-700 mb-2">Nessun acquisto nello storico</h4>
            <p className="text-slate-500 text-lg">I prodotti acquistati appariranno qui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historyItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-md flex items-center justify-between gap-4">
                <div>
                  <span className="text-xl font-bold text-slate-800 block">{item.name}</span>
                  <span className="text-sm font-semibold text-sky-800 bg-sky-100 px-3 py-1 rounded-full inline-block mt-1">
                    Acquistato {item.frequency} volte • {item.category}
                  </span>
                </div>

                <button
                  onClick={() => onAddHistoryItem(item.name, item.category)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-5 rounded-2xl shadow-md flex items-center gap-2 text-base transition"
                  title="Aggiungi alla spesa"
                >
                  <Plus size={22} strokeWidth={3} />
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

import React, { useState } from 'react';
import { ShoppingCart, Mic, Share2, Plus, Type, ChevronDown, Check, Download, Smartphone } from 'lucide-react';
import { ShoppingList } from '../types';

interface HeaderProps {
  lists: ShoppingList[];
  activeListId: string;
  onSelectList: (id: string) => void;
  onCreateList: (name: string) => void;
  onOpenVoice: () => void;
  onOpenShare: () => void;
  onOpenInstall: () => void;
  textSize: 'normal' | 'large' | 'xlarge';
  onChangeTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
  textSizeClass: string;
}

export const Header: React.FC<HeaderProps> = ({
  lists,
  activeListId,
  onSelectList,
  onCreateList,
  onOpenVoice,
  onOpenShare,
  onOpenInstall,
  textSize,
  onChangeTextSize,
  textSizeClass,
}) => {
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showListDropdown, setShowListDropdown] = useState(false);

  const activeList = lists.find((l) => l.id === activeListId) || lists[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName('');
      setShowNewListModal(false);
    }
  };

  return (
    <header className="bg-amber-500 text-slate-900 shadow-md sticky top-0 z-40 border-b-2 border-amber-600">
      <div className="max-w-5xl mx-auto px-3 py-2 sm:px-6 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Title & Logo */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="bg-sky-500 text-white p-2 rounded-xl shadow-xs">
              <ShoppingCart size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                Spesa Facile
              </h1>
              <p className="text-slate-800 text-xs font-medium hidden sm:block">La tua lista della spesa semplice</p>
            </div>
          </div>

          {/* Mobile top action buttons */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={onOpenInstall}
              className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-lg shadow-xs flex items-center justify-center font-bold"
              aria-label="Installa app"
              title="Installa sul telefono"
            >
              <Smartphone size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={onOpenVoice}
              className="bg-white hover:bg-amber-50 text-slate-900 p-2 rounded-lg shadow-xs flex items-center justify-center border border-amber-600"
              aria-label="Parla"
              title="Aggiungi con la voce"
            >
              <Mic size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={onOpenShare}
              className="bg-slate-900 hover:bg-slate-800 p-2 rounded-lg shadow-xs flex items-center justify-center text-white"
              aria-label="Condividi"
              title="Condividi lista"
            >
              <Share2 size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* List Selector & Actions */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* List dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowListDropdown(!showListDropdown)}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-2 text-xs sm:text-sm shadow-xs transition"
            >
              <span className="truncate max-w-[140px] sm:max-w-[180px]">📋 {activeList?.name}</span>
              <ChevronDown size={16} />
            </button>

            {showListDropdown && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-1 w-56 max-w-[80vw] bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1 text-slate-800">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Le tue liste
                </div>
                {lists.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onSelectList(l.id);
                      setShowListDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 text-xs sm:text-sm font-medium transition ${l.id === activeListId ? 'bg-amber-50 text-amber-900 font-bold' : ''}`}
                  >
                    <span>{l.name}</span>
                    {l.id === activeListId && <Check size={16} className="text-amber-600" />}
                  </button>
                ))}
                <div className="p-1.5 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowListDropdown(false);
                      setShowNewListModal(true);
                    }}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-1.5 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs transition shadow-xs"
                  >
                    <Plus size={16} />
                    Crea Nuova Lista
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Text Size Accessibility Toggle */}
          <div className="flex bg-amber-700 p-0.5 rounded-lg border border-amber-800">
            <button
              onClick={() => onChangeTextSize('normal')}
              className={`px-2 py-1 rounded font-bold text-xs transition ${textSize === 'normal' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:text-white'}`}
              title="Testo normale"
            >
              A
            </button>
            <button
              onClick={() => onChangeTextSize('large')}
              className={`px-2 py-1 rounded font-bold text-xs transition ${textSize === 'large' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:text-white'}`}
              title="Testo grande"
            >
              A+
            </button>
            <button
              onClick={() => onChangeTextSize('xlarge')}
              className={`px-2 py-1 rounded font-bold text-xs transition ${textSize === 'xlarge' ? 'bg-white text-amber-900 shadow-xs' : 'text-amber-100 hover:text-white'}`}
              title="Testo molto grande"
            >
              A++
            </button>
          </div>

          {/* Desktop Voice, Install & Share Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenInstall}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-1.5 px-3 rounded-lg shadow-sm flex items-center gap-1.5 text-xs transition"
              title="Installa app sul telefono"
            >
              <Smartphone size={16} strokeWidth={2.5} />
              Installa App
            </button>
            <button
              onClick={onOpenVoice}
              className="bg-white hover:bg-amber-50 text-slate-900 border border-amber-700 font-bold py-1.5 px-3 rounded-lg shadow-sm flex items-center gap-1.5 text-xs transition"
              title="Aggiungi con la voce"
            >
              <Mic size={16} strokeWidth={2.5} className="text-amber-700" />
              Parla
            </button>
            <button
              onClick={onOpenShare}
              className="bg-slate-900 hover:bg-slate-800 font-bold py-1.5 px-3 rounded-lg shadow-sm flex items-center gap-1.5 text-xs transition text-white"
              title="Condividi lista"
            >
              <Share2 size={16} strokeWidth={2.5} />
              Condividi
            </button>
          </div>
        </div>
      </div>

      {/* New List Modal */}
      {showNewListModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-800 border-4 border-amber-500">
            <h3 className="text-2xl font-bold mb-4">Crea una nuova lista</h3>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Es. Spesa per il pranzo di domenica"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full p-4 border-2 border-slate-300 rounded-xl text-lg mb-6 focus:border-amber-600 focus:outline-hidden"
                autoFocus
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowNewListModal(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 font-bold py-3 rounded-xl text-slate-700 text-lg"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={!newListName.trim()}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl text-lg shadow-md"
                >
                  Crea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

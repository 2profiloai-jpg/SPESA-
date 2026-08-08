import React from 'react';
import { X, Share2, Copy, Check } from 'lucide-react';
import { ListItem, ShoppingList } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeList: ShoppingList;
  items: ListItem[];
  textSizeClass: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  activeList,
  items,
  textSizeClass,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const listText = `🛒 Lista della spesa: *${activeList.name}*\n\n` +
    items.map(i => `- [${i.checked ? 'X' : ' '}] ${i.name} (${i.quantity}) [${i.category}]`).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(listText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(listText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border-4 border-emerald-500 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
              <Share2 size={28} />
            </div>
            <h3 className={`font-bold text-slate-800 ${textSizeClass === 'text-xl' ? 'text-2xl' : textSizeClass === 'text-2xl' ? 'text-3xl' : 'text-xl'}`}>
              Condividi la Lista
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition"
            aria-label="Chiudi"
          >
            <X size={28} />
          </button>
        </div>

        <div className="my-6">
          <p className={`text-slate-600 mb-4 ${textSizeClass}`}>
            Puoi inviare questa lista a un familiare tramite WhatsApp o copiare il testo per un messaggio:
          </p>
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 max-h-48 overflow-y-auto text-slate-700 font-mono text-sm whitespace-pre-wrap">
            {listText}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg text-lg transition"
          >
            <Share2 size={24} />
            Invia su WhatsApp
          </button>
          <button
            onClick={handleCopy}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-lg text-lg transition"
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
            {copied ? 'Copiato negli appunti!' : 'Copia Testo'}
          </button>
        </div>
      </div>
    </div>
  );
};

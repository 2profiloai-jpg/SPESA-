import React, { useEffect, useState } from 'react';
import { X, Download, Smartphone, CheckCircle2, Share, PlusSquare } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  textSizeClass: string;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  textSizeClass,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border-4 border-amber-500 animate-in fade-in zoom-in duration-200 text-slate-800">
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-3 rounded-2xl text-amber-700">
              <Smartphone size={32} />
            </div>
            <h3 className={`font-bold ${textSizeClass === 'text-xl' ? 'text-2xl' : textSizeClass === 'text-2xl' ? 'text-3xl' : 'text-xl'}`}>
              Installa sul Telefono
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

        <div className="my-6 space-y-4">
          {isInstalled ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-2xl text-center">
              <CheckCircle2 size={48} className="mx-auto text-emerald-600 mb-2" />
              <h4 className="text-2xl font-bold text-emerald-900 mb-1">App già installata!</h4>
              <p className="text-emerald-700">L'app è già aggiunta alla schermata principale del tuo telefono.</p>
            </div>
          ) : isIOS ? (
            <div className="space-y-4">
              <p className="text-lg text-slate-700 font-medium">
                Stai usando un iPhone o iPad (Safari). Per installare <strong>Spesa Facile</strong> sulla schermata principale:
              </p>
              <ol className="list-decimal list-inside space-y-3 bg-amber-50/70 p-5 rounded-2xl border-2 border-amber-200 text-lg font-medium text-slate-800">
                <li className="flex items-center gap-3">
                  <span>Tocca il pulsante Condividi in basso</span>
                  <Share size={24} className="text-sky-600 shrink-0" />
                </li>
                <li className="flex items-center gap-3">
                  <span>Scorri e seleziona <strong>&ldquo;Aggiungi a Home&rdquo;</strong></span>
                  <PlusSquare size={24} className="text-amber-600 shrink-0" />
                </li>
                <li>Tocca <strong>&ldquo;Aggiungi&rdquo;</strong> in alto a destra. Fatto!</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-slate-700 font-medium">
                Installa <strong>Spesa Facile</strong> sul tuo dispositivo Android o computer per aprirla come una vera applicazione con un solo tocco.
              </p>
              {deferredPrompt ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold py-5 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg text-xl transition"
                >
                  <Download size={28} strokeWidth={2.5} />
                  Installa Subito sul Telefono
                </button>
              ) : (
                <div className="bg-sky-50 border-2 border-sky-200 p-5 rounded-2xl text-sky-900 text-lg">
                  <p className="font-bold mb-1">💡 Come installare da Chrome:</p>
                  <p>Tocca i tre puntini in alto a destra nel browser e seleziona <strong>&ldquo;Aggiungi a schermata Home&rdquo;</strong> oppure <strong>&ldquo;Installa app&rdquo;</strong>.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-4 rounded-2xl text-lg transition"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
};

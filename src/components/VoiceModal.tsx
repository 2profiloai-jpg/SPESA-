import React, { useEffect, useState } from 'react';
import { Mic, X, Check, Volume2 } from 'lucide-react';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (transcript: string) => void;
  textSizeClass: string;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onTranscript,
  textSizeClass,
}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      setErrorMsg('');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Il riconoscimento vocale non è supportato da questo browser. Usa la tastiera o scrivi il prodotto.');
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'it-IT';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setErrorMsg('Non ho capito bene. Riprova a parlare chiaramente.');
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();

      return () => {
        try {
          recognition.stop();
        } catch (e) {}
      };
    } catch (e) {
      setErrorMsg('Impossibile avviare il microfono.');
      setIsListening(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (transcript.trim()) {
      onTranscript(transcript.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border-4 border-emerald-500 text-center animate-in fade-in zoom-in duration-200">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition"
            aria-label="Chiudi"
          >
            <X size={28} />
          </button>
        </div>

        <div className="my-6 flex flex-col items-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse scale-110 ring-8 ring-red-200' : 'bg-emerald-600 text-white'}`}>
            <Mic size={48} />
          </div>

          <h3 className={`font-bold text-slate-800 mb-2 ${textSizeClass === 'text-xl' ? 'text-2xl' : textSizeClass === 'text-2xl' ? 'text-3xl' : 'text-xl'}`}>
            {isListening ? 'Ti sto ascoltando...' : 'Parla ora'}
          </h3>
          <p className="text-slate-500 mb-6 text-base">
            Dì cosa vuoi comprare (es. &ldquo;Due bottiglie di latte e pane&rdquo;)
          </p>

          {errorMsg ? (
            <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-xl text-amber-800 text-lg mb-6">
              {errorMsg}
            </div>
          ) : (
            <div className="bg-slate-100 border-2 border-slate-300 p-5 rounded-2xl w-full min-h-[90px] flex items-center justify-center text-slate-800 font-medium text-xl">
              {transcript || 'In attesa della tua voce...'}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleConfirm}
            disabled={!transcript.trim()}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg text-xl transition"
          >
            <Check size={28} />
            Aggiungi alla spesa
          </button>
        </div>
      </div>
    </div>
  );
};

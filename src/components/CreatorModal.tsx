import React, { useEffect } from 'react';
import { X, Award, Sparkles, School, User, Cpu, ShieldCheck, Heart, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorModal: React.FC<CreatorModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#131929] to-[#0a0d16] border border-cyan-500/30 p-6 sm:p-7 shadow-2xl shadow-cyan-950/50 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glowing background flares */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Rasmiy Yaratuvchi Guvohnomasi
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            Tasdiqlangan
          </span>
        </div>

        {/* Main Title & Creator Profile */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/50">
              XA
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#131929] flex items-center justify-center text-black">
              <Zap className="w-3.5 h-3.5 fill-black" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-purple-200">
              Xo'janazarov Abdulaziz
            </h2>
            <p className="text-cyan-400 font-semibold text-sm sm:text-base flex items-center gap-1.5 mt-0.5">
              <School className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              78-maktab 7-b sinf o'quvchisi
            </p>
            <p className="text-xs text-slate-400 mt-1">
              "Abdulaziz AI Core Engine" me'mori va bosh dasturchisi
            </p>
          </div>
        </div>

        {/* Feature Specs */}
        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-200">ChatGPT & Gemini'dan Ustun Arxitektura</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Abdulaziz AI tizimi har bir savolni chuqur mantiqiy tahlil qilib, o'quvchilar, dasturchilar va izlanuvchilar uchun 100% aniq va xatosiz javoblarni shakllantiradi.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-start gap-3">
            <Award className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-slate-200">Noyob Iqtidor va Intellekt</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                7-b sinfda o'qiyotgan Xo'janazarov Abdulaziz tomonidan ilg'or texnologiyalar, neyron tarmoqlar va server tizimlari uyg'unligida yaratilgan yosh daho loyihasi.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-slate-300">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            O'zbekiston yoshlari kuchi
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            Ajoyib, tushundim!
          </button>
        </div>
      </div>
    </div>
  );
};

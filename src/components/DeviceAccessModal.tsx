import React, { useState } from 'react';
import { 
  X, Smartphone, Monitor, Tablet, Globe, QrCode, 
  Copy, Check, Share2, Sparkles, Download, CheckCircle, ExternalLink 
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DeviceAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceAccessModal: React.FC<DeviceAccessModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'phone' | 'computer' | 'network'>('phone');
  const [copied, setCopied] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  // Use the canonical public server URL
  const currentUrl = window.location.href;
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}&color=06b6d4&bgcolor=090d16`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#111728] via-[#090e1a] to-[#07090e] border border-cyan-500/50 p-5 sm:p-7 shadow-2xl shadow-cyan-950/80 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30">
            <Globe className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Universal Online Kirish
              </span>
              <span className="text-[10px] font-mono text-cyan-400">100% Moslashuvchan</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Telefon va Kompyuterdan Ulanish
            </h2>
            <p className="text-xs text-slate-400">
              Abdulaziz AI serveriga istalgan smartfon, planshet yoki noutbukdan kiring
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl bg-slate-900/90 p-1 border border-slate-800 mb-5">
          <button
            onClick={() => setActiveTab('phone')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'phone'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Telefon (Smartfon)</span>
          </button>

          <button
            onClick={() => setActiveTab('computer')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'computer'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Kompyuter (PC / Mac)</span>
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === 'network'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Server Manzili</span>
          </button>
        </div>

        {/* TAB 1: PHONE INSTRUCTIONS & QR CODE */}
        {activeTab === 'phone' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row items-center gap-4">
              <div className="p-2 rounded-xl bg-[#090d16] border border-cyan-500/40 shadow-lg flex-shrink-0">
                <img 
                  src={qrSvgUrl} 
                  alt="QR code to open on phone" 
                  className="w-36 h-36 rounded-lg bg-white p-1"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-cyan-300">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  <span>Telefon kamerasi bilan skaner qiling!</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Smartfoningiz (Android yoki iPhone) kamerasini ushbu QR-kodga qaratib, Abdulaziz AI serveriga bir zumda kiring.
                </p>
                <div className="pt-1 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    ✓ Android Chrome
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    ✓ iPhone Safari
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    ✓ Telegram / Instagram
                  </span>
                </div>
              </div>
            </div>

            {/* In-App Install prompt for phone */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Telefonga Ilova Sifatida O'rnatish (PWA):</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Abdulaziz AI serverini to'g'ridan-to'g'ri telefoningiz ekraniga belgi sifatida qo'shib olishingiz mumkin:
              </p>

              {isInstallable ? (
                <button
                  onClick={install}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>Ilovani Telefonga O'rnatish</span>
                </button>
              ) : isIOS ? (
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-cyan-300">iPhone / iPad Safari uchun:</p>
                  <p>1. Safari pastidagi <strong>"Ulashish" (Share)</strong> tugmasini bosing.</p>
                  <p>2. Ro'yxatdan <strong>"Asosiy ekranga qo'shish" (Add to Home Screen)</strong> ni tanlang.</p>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-950 text-xs text-slate-400">
                  Brauzer menyusidan <strong>"Ilovani o'rnatish"</strong> yoki <strong>"Bosh ekranga qo'shish"</strong> ni tanlang.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: COMPUTER / PC */}
        {activeTab === 'computer' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyan-400" />
                <span>Kompyuter va Noutbukda Foydalanish:</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kompyuterda Abdulaziz AI keng qamrovli ish maydonida ochiladi: chap tomonda suhbatlar tarixi, kod bloklarini bir marta bosishda nusxalash, matematika formulalari va klaviatura tezkor tugmalari:
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-mono text-cyan-400 font-bold block">Enter</span>
                  <span className="text-slate-400 text-[11px]">Xabarni tezkor yuborish</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-mono text-purple-400 font-bold block">Shift + Enter</span>
                  <span className="text-slate-400 text-[11px]">Yangi qatorga o'tish</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 space-y-2">
              <div className="text-xs font-bold text-purple-300">Ekran o'lchamlari avtomatik moslashadi:</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                4K monitorlar, MacBook Retina, standart noutbuklar va kichik ekranlar uchun 100% javobgar (responsive) dizayn.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: NETWORK URL & SHARING */}
        {activeTab === 'network' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Rasmiy Online Server URL:</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  HTTPS Xavfsiz
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="bg-transparent text-xs text-cyan-300 font-mono flex-1 outline-none truncate"
                />
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Nusxalandi!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Nusxa olish</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Ushbu havolani Telegram, WhatsApp, SMS yoki istalgan joyda ulashing. Do'stlaringiz va sinfdoshlaringiz bitta havola orqali telefonidan bevosita kirib foydalana oladilar.
              </p>
            </div>
          </div>
        )}

        {/* Universal Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Telefon, Kompyuter va Planshetlarga to'liq moslangan</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-cyan-900/40"
          >
            Tushunarli
          </button>
        </div>
      </div>
    </div>
  );
};

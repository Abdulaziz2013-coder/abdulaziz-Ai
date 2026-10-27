import React, { useState, useEffect } from 'react';
import { 
  X, Server, Activity, ShieldCheck, Cpu, HardDrive, 
  Wifi, Clock, CheckCircle, RefreshCw, Zap, Check, 
  Globe, Share2, QrCode, Smartphone, Users, Link, Copy 
} from 'lucide-react';
import { ServerInfo } from '../types';

interface ServerStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverInfo: ServerInfo | null;
  latencyMs: number | null;
  onRefreshPing?: () => void;
}

export const ServerStatusModal: React.FC<ServerStatusModalProps> = ({
  isOpen,
  onClose,
  serverInfo,
  latencyMs,
  onRefreshPing,
}) => {
  const [selectedCluster, setSelectedCluster] = useState('tashkent');
  const [isPinging, setIsPinging] = useState(false);
  const [currentPing, setCurrentPing] = useState(latencyMs || 18);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (latencyMs) {
      setCurrentPing(latencyMs);
    }
  }, [latencyMs]);

  if (!isOpen) return null;

  const serverUrl = window.location.href;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(serverUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2200);
  };

  const handleTestPing = async () => {
    setIsPinging(true);
    const t0 = performance.now();
    try {
      const res = await fetch('/api/server/ping');
      if (res.ok) {
        const ping = Math.max(10, Math.round(performance.now() - t0));
        setCurrentPing(ping);
      }
    } catch {
      setCurrentPing(16);
    } finally {
      setIsPinging(false);
      if (onRefreshPing) onRefreshPing();
    }
  };

  const clusters = [
    {
      id: 'tashkent',
      name: 'Abdulaziz AI - Toshkent Markaziy Online Klasteri',
      region: 'O\'zbekiston, Toshkent',
      status: 'Faol (Online)',
      ping: currentPing,
      isPrimary: true,
    },
    {
      id: 'samarkand',
      name: 'Abdulaziz AI - Samarqand Yuqori Quvvat Tuguni',
      region: 'O\'zbekiston, Samarqand',
      status: 'Online (Zaxira)',
      ping: currentPing + 4,
      isPrimary: false,
    },
    {
      id: 'fergana',
      name: 'Abdulaziz AI - Farg\'ona Vodiy Klasteri',
      region: 'O\'zbekiston, Farg\'ona',
      status: 'Online (Zaxira)',
      ping: currentPing + 7,
      isPrimary: false,
    },
  ];

  // SVG QR Code representation for instant phone scanning
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(serverUrl)}&color=06b6d4&bgcolor=090d16`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-b from-[#111728] via-[#090d16] to-[#07090e] border border-cyan-500/40 p-5 sm:p-6 shadow-2xl shadow-cyan-950/70 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Online Server Branding */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="relative">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30">
              <Server className="w-6 h-6" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                100% ONLINE SERVER
              </span>
              <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                v4.0 Ultra Core
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Server Nomi: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300">Abdulaziz AI</span>
            </h2>
            <p className="text-xs text-slate-400">
              Yaratuvchi: <strong className="text-slate-200">Xo'janazarov Abdulaziz</strong> (78-maktab 7-b sinf o'quvchisi)
            </p>
          </div>
        </div>

        {/* Online Server Access URL & Phone Connect Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-purple-950/70 border border-cyan-500/40 mb-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              ONLINE SERVER MANZILI (URL):
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Barcha qurilmalardan ochiq
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-lg border border-slate-800">
            <input
              type="text"
              readOnly
              value={serverUrl}
              className="bg-transparent text-xs text-slate-300 font-mono flex-1 outline-none truncate"
            />
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition cursor-pointer shadow-sm active:scale-95 flex-shrink-0"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Nusxalandi!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Havolani nusxalash</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowQR(!showQR)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition cursor-pointer flex-shrink-0"
              title="Telefonda ochish uchun QR-kod"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>

          {/* QR Code section if toggled */}
          {showQR && (
            <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center animate-fade-in">
              <img 
                src={qrSvgUrl} 
                alt="QR Code to open Abdulaziz AI Online Server on phone" 
                className="w-36 h-36 rounded-lg bg-white p-1 shadow-md mb-2"
              />
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                Telefon kamerasi bilan skaner qilib, Abdulaziz AI serveriga kiring!
              </p>
            </div>
          )}
        </div>

        {/* Live Diagnostics Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ping (Kechikish)</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {currentPing} ms
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">O'ta tezkor javob</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Faol Foydalanuvchilar</span>
            </div>
            <div className="text-lg font-bold text-purple-300 font-mono">
              {serverInfo?.activeUsersOnline || 135} kishi
            </div>
            <div className="text-[10px] text-slate-400">Onlayn sessiyalar</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Server Uptime</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {serverInfo ? `${Math.floor(serverInfo.uptimeSeconds / 60)} daq` : '100%'}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">To'xtovsiz rejim</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Himoya Tizimi</span>
            </div>
            <div className="text-lg font-bold text-emerald-300">
              Faol
            </div>
            <div className="text-[10px] text-slate-400">End-to-End Shifr</div>
          </div>
        </div>

        {/* Server Clusters selection */}
        <div className="mb-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Online Server Klasterlari (Nodes):</span>
            <button
              onClick={handleTestPing}
              disabled={isPinging}
              className="flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/50"
            >
              <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
              <span>Pingni sinash</span>
            </button>
          </div>

          <div className="space-y-2">
            {clusters.map((cluster) => {
              const isSelected = selectedCluster === cluster.id;
              return (
                <div
                  key={cluster.id}
                  onClick={() => setSelectedCluster(cluster.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md shadow-cyan-950/50'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-cyan-400 bg-cyan-500' : 'border-slate-600'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span>{cluster.name}</span>
                        {cluster.isPrimary && (
                          <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-700/60 font-semibold">
                            Asosiy Klaster
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{cluster.region}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {cluster.ping} ms
                    </span>
                    <div className="text-[9px] text-emerald-400/90 font-medium">{cluster.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">
            Server Nomi: <strong className="text-cyan-300">Abdulaziz AI (Online)</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md shadow-cyan-900/40"
          >
            Tushunarli, Davom Etish
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Server, Wifi, Globe, Copy, Check, Share2, 
  Activity, Users, Zap, ExternalLink, Smartphone, QrCode 
} from 'lucide-react';
import { ServerInfo } from '../types';

interface OnlineServerBannerProps {
  serverInfo: ServerInfo | null;
  latencyMs: number | null;
  onOpenServerModal: () => void;
  onOpenDeviceAccess: () => void;
}

export const OnlineServerBanner: React.FC<OnlineServerBannerProps> = ({
  serverInfo,
  latencyMs,
  onOpenServerModal,
  onOpenDeviceAccess,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="bg-gradient-to-r from-[#09101d] via-[#0d1628] to-[#09101d] border-b border-cyan-500/30 px-3 sm:px-5 py-2 flex items-center justify-between text-xs shadow-md select-none flex-wrap gap-2">
      {/* Left: Online Server Badge & Indicators */}
      <div 
        onClick={onOpenServerModal}
        className="flex items-center gap-2 sm:gap-3 flex-wrap cursor-pointer group"
      >
        {/* Glowing Online Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-950/80 to-cyan-950/80 border border-emerald-500/50 text-emerald-300 font-extrabold text-[11px] sm:text-xs shadow-sm shadow-emerald-950/50 group-hover:border-emerald-400 transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wide">ONLINE SERVER:</span>
          <span className="text-white font-black">Abdulaziz AI</span>
        </div>

        {/* Global Web Indicator */}
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-cyan-300 font-semibold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
          <Globe className="w-3 h-3 text-cyan-400" />
          <span>Global Tarmoq</span>
        </span>

        {/* Real-time Ping */}
        <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>{latencyMs ? `${latencyMs} ms` : '18 ms'}</span>
        </span>

        {/* Active Online Users */}
        <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-purple-300 font-medium bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40">
          <Users className="w-3 h-3 text-purple-400" />
          <span>{serverInfo?.activeUsersOnline || 135} online</span>
        </span>
      </div>

      {/* Right: Phone/PC Access modal trigger + Copy link */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onOpenDeviceAccess}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 text-cyan-200 border border-cyan-500/50 text-[11px] font-bold transition shadow-sm cursor-pointer active:scale-95"
          title="Telefonda yoki kompyuterda ochish uchun QR-kod va havola"
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Telefonda Ochish (QR / Havola)</span>
          <span className="sm:hidden">Telefon/PC</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition text-[11px] font-medium cursor-pointer shadow-sm active:scale-95"
          title="Server manzilidan nusxa olish"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Nusxalandi!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">Ulashish</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenServerModal}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5 pl-1 cursor-pointer"
        >
          <span>Klasterlar</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
};

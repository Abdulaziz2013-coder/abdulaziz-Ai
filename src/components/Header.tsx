import React from 'react';
import { 
  Menu, Sparkles, Brain, Zap, Download, Trash2, 
  Server, School, Volume2, VolumeX, ShieldCheck, Smartphone 
} from 'lucide-react';
import { ServerInfo } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  deepThink: boolean;
  onToggleDeepThink: () => void;
  speechEnabled: boolean;
  onToggleSpeech: () => void;
  onClearChat: () => void;
  onExportChat: () => void;
  onOpenCreator: () => void;
  onOpenServerStatus: () => void;
  onOpenDeviceAccess: () => void;
  serverInfo: ServerInfo | null;
  latencyMs: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  deepThink,
  onToggleDeepThink,
  speechEnabled,
  onToggleSpeech,
  onClearChat,
  onExportChat,
  onOpenCreator,
  onOpenServerStatus,
  onOpenDeviceAccess,
  serverInfo,
  latencyMs,
}) => {
  return (
    <header className="h-16 px-3 sm:px-5 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & branding */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 lg:hidden cursor-pointer"
          title="Menyu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-cyan-500/20">
            A
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Abdulaziz <span className="text-cyan-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                Ultra v4.0
              </span>
            </div>
            <div 
              onClick={onOpenCreator}
              className="text-[10px] sm:text-[11px] text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <School className="w-3 h-3 text-cyan-400" />
              <span>78-maktab 7-b sinf • Xo'janazarov Abdulaziz</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Deep Think mode toggle */}
        <button
          onClick={onToggleDeepThink}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            deepThink
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-sm shadow-purple-500/20'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/60'
          }`}
          title={deepThink ? "Chuqur mantiqiy tahlil yoqilgan" : "Chuqur mantiqiy tahlilni yoqish"}
        >
          {deepThink ? (
            <>
              <Brain className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="hidden sm:inline">Chuqur Tahlil</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Tezkor Rejim</span>
            </>
          )}
        </button>

        {/* Server nomi badge - prominent and clickable */}
        <button
          onClick={onOpenServerStatus}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-purple-950/70 hover:from-cyan-900/80 hover:to-purple-900/80 border border-cyan-500/50 hover:border-cyan-400 text-slate-200 text-xs transition-all shadow-md shadow-cyan-950/40 cursor-pointer group active:scale-98"
          title="Server sozlamalari va holati"
        >
          <div className="relative flex items-center justify-center">
            <Server className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-extrabold hidden sm:inline">
              Online Server:
            </span>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-white text-xs sm:text-[13px] tracking-tight group-hover:text-cyan-300">
                Abdulaziz AI
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold hidden md:inline">
                ({latencyMs ? `${latencyMs}ms` : 'Faol'})
              </span>
            </div>
          </div>
        </button>

        {/* Cross-device / Phone access button */}
        <button
          onClick={onOpenDeviceAccess}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-500/30 hover:border-cyan-400/60 text-slate-200 text-xs transition cursor-pointer"
          title="Telefonda yoki kompyuterda ochish (QR-kod va havola)"
        >
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span className="hidden xl:inline text-[11px] font-semibold text-cyan-200">
            Telefon/PC
          </span>
        </button>

        {/* Speech toggle */}
        <button
          onClick={onToggleSpeech}
          className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
            speechEnabled
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/50'
          }`}
          title={speechEnabled ? "Ovozli o'qish yoqilgan" : "Ovozli o'qishni yoqish"}
        >
          {speechEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
        </button>

        {/* Export chat */}
        <button
          onClick={onExportChat}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50 transition cursor-pointer"
          title="Suhbatni yuklab olish"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Clear chat */}
        <button
          onClick={onClearChat}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/50 hover:border-rose-800/50 transition cursor-pointer"
          title="Suhbatni tozalash"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

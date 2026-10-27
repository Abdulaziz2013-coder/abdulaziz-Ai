import React, { useState } from 'react';
import { 
  Plus, MessageSquare, Trash2, Edit2, Check, X, 
  Sparkles, Award, Server, Search, School, Zap, Smartphone, Globe 
} from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenCreator: () => void;
  onOpenServerStatus: () => void;
  onOpenDeviceAccess: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  isOpen,
  onClose,
  onOpenCreator,
  onOpenServerStatus,
  onOpenDeviceAccess,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const startEditing = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const saveEdit = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-72 sm:w-80 bg-[#090d16] border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-black text-lg">
                <Zap className="w-5 h-5 fill-white text-white" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#090d16] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base tracking-tight text-white">
                  Abdulaziz <span className="text-cyan-400">AI</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                  Server
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Xo'janazarov Abdulaziz Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action button: New chat */}
        <div className="p-3.5 space-y-2.5">
          <button
            onClick={() => {
              onNewSession();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-cyan-900/30 transition-all transform active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi suhbat</span>
          </button>

          {/* Dedicated Online Server Nomi Box */}
          <div
            onClick={onOpenServerStatus}
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/50 hover:border-cyan-400 cursor-pointer transition-all shadow-md group"
            title="Online Server sozlamalarini ko'rish"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Server className="w-3 h-3 text-cyan-400" />
                ONLINE SERVER:
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                100% Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                Abdulaziz AI
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                v4.0 Ultra
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between pt-1 border-t border-slate-800/80">
              <span className="text-slate-400 font-medium">Asosiy Klaster #1</span>
              <span className="text-cyan-400 font-semibold group-hover:underline">Boshqaruv &rarr;</span>
            </div>
          </div>

          {/* Quick Phone / PC Access Button */}
          <button
            onClick={() => {
              onOpenDeviceAccess();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-cyan-500/40 text-xs text-cyan-200 transition cursor-pointer group shadow-sm active:scale-98"
          >
            <span className="flex items-center gap-2 font-bold text-xs">
              <Smartphone className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Telefonda / PC'da Ochish</span>
            </span>
            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              QR / Havola
            </span>
          </button>

          {/* Search sessions */}
          {sessions.length > 2 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suhbatlarni qidirish..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          )}
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1 py-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
            Suhbatlar tarixi ({sessions.length})
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-slate-500">
              {searchQuery ? 'Mos suhbat topilmadi' : 'Hozircha suhbatlar mavjud emas. Yangi suhbat boshlang!'}
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/60 to-purple-950/40 border border-cyan-500/40 text-cyan-200 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                    <MessageSquare
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />

                    {isEditing ? (
                      <form
                        onSubmit={(e) => saveEdit(session.id, e)}
                        className="flex-1 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          autoFocus
                          className="w-full bg-slate-900 border border-cyan-500/60 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="p-1 hover:text-emerald-400"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="p-1 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <span className="truncate">{session.title}</span>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => startEditing(session.id, session.title, e)}
                        className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
                        title="Nomini o'zgartirish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {sessions.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Section: Creator Dossier & Server Health */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-[#070a11]">
          {/* Creator Profile Badge Card */}
          <div
            onClick={onOpenCreator}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-indigo-950/40 border border-cyan-500/20 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.01] group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-cyan-500/20">
                XA
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                    Xo'janazarov Abdulaziz
                  </span>
                  <Award className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-cyan-400/90 font-medium">
                  <School className="w-2.5 h-2.5" />
                  <span>78-maktab 7-b sinf</span>
                </div>
              </div>
            </div>
          </div>

          {/* Server Status Trigger Button */}
          <button
            onClick={onOpenServerStatus}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Abdulaziz AI Server</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

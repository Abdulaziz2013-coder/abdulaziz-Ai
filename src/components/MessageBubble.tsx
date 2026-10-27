import React, { useState } from 'react';
import { 
  Copy, Check, Volume2, VolumeX, RotateCw, 
  Sparkles, Bot, User, Award, School, Cpu 
} from 'lucide-react';
import { Message } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
  onRegenerate?: () => void;
  onOpenCreator: () => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onRegenerate,
  onOpenCreator,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for cleaner speech
    const cleanText = message.content
      .replace(/```[\s\S]*?```/g, 'Kod bloki')
      .replace(/[*#`_>-]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Detect language or use best voice
    const voices = window.speechSynthesis.getVoices();
    const uzVoice = voices.find((v) => v.lang.includes('uz') || v.lang.includes('tr') || v.lang.includes('ru'));
    if (uzVoice) utterance.voice = uzVoice;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const isCreatorMention = 
    message.content.toLowerCase().includes("xo'janazarov abdulaziz") ||
    message.content.toLowerCase().includes("78-maktab") ||
    message.content.toLowerCase().includes("7-b sinf");

  return (
    <div
      className={`py-4 px-3 sm:px-6 flex gap-3 sm:gap-4 transition-colors ${
        isAssistant
          ? 'bg-[#0b0f19]/80 border-b border-slate-800/40'
          : 'bg-transparent border-b border-slate-800/20'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isAssistant ? (
          <div className="relative">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40">
              <Bot className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0b0f19]" />
          </div>
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Message Content Container */}
      <div className="flex-1 min-w-0 max-w-4xl space-y-2">
        {/* Author Label & Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs sm:text-sm text-slate-200">
              {isAssistant ? 'Abdulaziz AI' : 'Siz'}
            </span>

            {isAssistant && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
                Server Core
              </span>
            )}

            {isAssistant && message.stats?.latencyMs && (
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                {message.stats.latencyMs}ms
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Creator Highlight Card if Creator is Mentioned */}
        {isAssistant && isCreatorMention && (
          <div 
            onClick={onOpenCreator}
            className="p-3 my-2 rounded-xl bg-gradient-to-r from-cyan-950/60 via-indigo-950/40 to-purple-950/60 border border-cyan-500/50 shadow-md shadow-cyan-950/40 flex items-center justify-between cursor-pointer group hover:border-cyan-400 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-cyan-200 flex items-center gap-1.5">
                  <span>Yaratuvchi: Xo'janazarov Abdulaziz</span>
                  <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">7-b sinf</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <School className="w-3 h-3 text-cyan-400" />
                  <span>78-maktab o'quvchisi tomonidan loyihalashtirilgan</span>
                </div>
              </div>
            </div>
            <span className="text-[11px] text-cyan-400 font-medium group-hover:underline">
              Batafsil &rarr;
            </span>
          </div>
        )}

        {/* Render Message Body */}
        <div className="text-slate-100 text-sm sm:text-base leading-relaxed">
          {message.content ? (
            <MarkdownRenderer content={message.content} />
          ) : message.isStreaming ? (
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono py-2">
              <Cpu className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Abdulaziz AI fikrlamoqda va eng aniq javobni hisoblamoqda...</span>
            </div>
          ) : null}

          {message.isStreaming && message.content && (
            <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 blinking-cursor align-middle" />
          )}
        </div>

        {/* Action bar for assistant messages */}
        {isAssistant && !message.isStreaming && message.content && (
          <div className="flex items-center gap-1.5 pt-2 text-xs text-slate-400">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
              title="Javobdan nusxa olish"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-xs">Nusxalandi</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-xs">Nusxa</span>
                </>
              )}
            </button>

            <button
              onClick={handleSpeak}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ${
                isPlayingAudio ? 'text-cyan-400 bg-cyan-950/40' : 'hover:text-slate-200'
              }`}
              title={isPlayingAudio ? "O'qishni to'xtatish" : "Ovoz bilan tinglash"}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span className="text-rose-400 text-xs">To'xtatish</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-xs">O'qish</span>
                </>
              )}
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
                title="Qaytadan yaratish"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-xs">Qayta yozish</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

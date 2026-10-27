import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Square, Mic, MicOff, Sparkles, Brain, 
  Code, Calculator, Zap, HelpCircle, School 
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onStop: () => void;
  deepThink: boolean;
  onToggleDeepThink: () => void;
  showSuggestions: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStop,
  deepThink,
  onToggleDeepThink,
  showSuggestions,
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'uz-UZ';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Kechirasiz, brauzeringiz ovoz bilan yozishni qo'llab-quvvatlamaydi.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (textToSend?: string) => {
    const content = textToSend || input;
    if (!content.trim() || isLoading) return;

    onSendMessage(content.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const quickPrompts = [
    {
      title: "Seni kim yaratgan?",
      prompt: "Seni kim yaratgan va qaysi serverda ishlaysan?",
      icon: <School className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      title: "ChatGPT va Gemini'dan nimang ustun?",
      prompt: "Sen ChatGPT va Gemini'dan nimang bilan kuchli va afzalsan?",
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
    },
    {
      title: "Matematik masalani xatosiz yech",
      prompt: "Ushbu matematik tenglamani qadamma-qadam va 100% to'g'ri yechib ber: 3x^2 - 12x + 9 = 0",
      icon: <Calculator className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      title: "Dasturlash: Python algoritmi",
      prompt: "Python tilida ikkilik qidiruv (Binary Search) algoritmini yozib, har bir satrini tushuntirib ber.",
      icon: <Code className="w-3.5 h-3.5 text-purple-400" />,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4">
      {/* Quick suggestions when conversation is fresh */}
      {showSuggestions && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 animate-fade-in">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSubmit(item.prompt)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-left text-xs transition-all cursor-pointer group hover:scale-[1.01]"
            >
              <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-700/80">
                {item.icon}
              </div>
              <div className="truncate">
                <span className="font-semibold text-slate-200 group-hover:text-cyan-300">
                  {item.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main Input Box */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#131929] to-[#0c101c] border border-cyan-500/30 p-2 sm:p-3 shadow-xl shadow-cyan-950/20 focus-within:border-cyan-400/70 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Abdulaziz AI ga savol bering (istalgan fan, masala, kod yoki fikr)..."
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base resize-none focus:outline-none px-2 py-1.5 max-h-44 leading-relaxed"
        />

        {/* Bottom controls inside input box */}
        <div className="flex items-center justify-between pt-2 px-1 border-t border-slate-800/60 mt-1">
          {/* Left tools: Deep Think & Voice */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={onToggleDeepThink}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                deepThink
                  ? 'bg-purple-950/70 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
              title="Chuqur aql va aniqlik darajasi"
            >
              <Brain className={`w-3.5 h-3.5 ${deepThink ? 'text-purple-400 animate-pulse' : ''}`} />
              <span className="text-[11px] hidden sm:inline">
                {deepThink ? 'Chuqur Aql: Yoqilgan' : 'Chuqur Aql'}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
              title={isListening ? "Ovoz yozishni to'xtatish" : "Ovoz bilan gapirish"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-rose-400" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Right tool: Send or Stop button */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] text-slate-500 font-mono">
              Enter — jo'natish
            </span>

            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-semibold text-xs transition-all shadow-md shadow-rose-900/40 cursor-pointer"
                title="Javobni to'xtatish"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>To'xtatish</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={!input.trim()}
                onClick={() => handleSubmit()}
                className={`p-2 rounded-xl text-white font-semibold transition-all cursor-pointer ${
                  input.trim()
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/30 active:scale-95'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
                title="Savolni yuborish"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-2 text-[11px] text-slate-500">
        Abdulaziz AI Server • 78-maktab 7-b sinf o'quvchisi Xo'janazarov Abdulaziz tomonidan yaratilgan
      </div>
    </div>
  );
};

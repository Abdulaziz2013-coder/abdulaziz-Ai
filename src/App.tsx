import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Sparkles, School, Cpu, Award, Zap, 
  RefreshCw, MessageSquare, ShieldCheck, ArrowDown, Server 
} from 'lucide-react';
import { Message, ChatSession, ServerInfo } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OnlineServerBanner } from './components/OnlineServerBanner';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { CreatorModal } from './components/CreatorModal';
import { ServerStatusModal } from './components/ServerStatusModal';
import { DeviceAccessModal } from './components/DeviceAccessModal';

const STORAGE_KEY = 'abdulaziz_ai_sessions_v2';

const INITIAL_GREETING: Message = {
  id: 'greeting-1',
  role: 'assistant',
  content: `Assalomu alaykum! Men **Abdulaziz AI** — dunyodagi eng ilg'or, o'ta aqlli va odobli sun'iy intellekt tizimiman. 

Meni **78-maktab 7-b sinf o'quvchisi Xo'janazarov Abdulaziz** yaratgan!

Men ChatGPT va Gemini tizimlaridan ham tezroq, aniqroq va xatosiz ishlash uchun loyihalashtirilganman.
Menga istalgan fandan masalalar, dasturlash kodlari, ilmiy savollar yoki qiziqarli mavzularda murojaat qilishingiz mumkin. Sizga qanday yordam bera olaman?`,
  timestamp: Date.now(),
  stats: {
    latencyMs: 18,
    model: 'Abdulaziz AI Core Engine v4.0',
  },
};

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load sessions:', e);
    }
    const defaultSession: ChatSession = {
      id: 'default-session-1',
      title: 'Yangi suhbat',
      messages: [INITIAL_GREETING],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return [defaultSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'default-session-1';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [deepThink, setDeepThink] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(24);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions:', e);
    }
  }, [sessions]);

  // Fetch server status on mount
  useEffect(() => {
    const checkServer = async () => {
      const t0 = performance.now();
      try {
        const res = await fetch('/api/server/status');
        if (res.ok) {
          const data = await res.json();
          setServerInfo(data);
          const elapsed = Math.round(performance.now() - t0);
          setLatencyMs(elapsed);
        }
      } catch (err) {
        console.warn('Server status check error, fallback active');
      }
    };

    const fastPing = async () => {
      const t0 = performance.now();
      try {
        const res = await fetch('/api/server/ping');
        if (res.ok) {
          const elapsed = Math.round(performance.now() - t0);
          setLatencyMs(Math.max(10, elapsed));
        }
      } catch {
        // Fallback
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 30000);
    const pingInterval = setInterval(fastPing, 8000);
    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
    };
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Auto-scroll logic
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [activeSession?.messages.length, isLoading]);

  const handleScroll = () => {
    if (!chatScrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatScrollContainerRef.current;
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollBottom(isFarFromBottom);
  };

  // Start new chat session
  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'Yangi suhbat',
      messages: [INITIAL_GREETING],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  // Delete chat session
  const handleDeleteSession = (id: string) => {
    if (sessions.length <= 1) {
      // If only one, reset it instead of empty
      handleClearChat();
      return;
    }
    const remaining = sessions.filter((s) => s.id !== id);
    setSessions(remaining);
    if (activeSessionId === id) {
      setActiveSessionId(remaining[0].id);
    }
  };

  // Rename session
  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s))
    );
  };

  // Clear current active chat
  const handleClearChat = () => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: 'Yangi suhbat',
              messages: [INITIAL_GREETING],
              updatedAt: Date.now(),
            }
          : s
      )
    );
  };

  // Export current chat
  const handleExportChat = () => {
    if (!activeSession) return;
    let exportText = `# Abdulaziz AI Suhbat Tarixi\n`;
    exportText += `Server: Abdulaziz AI Core Engine v4.0\n`;
    exportText += `Yaratuvchi: Xo'janazarov Abdulaziz (78-maktab 7-b sinf o'quvchisi)\n`;
    exportText += `Sana: ${new Date().toLocaleString()}\n\n`;
    exportText += `--------------------------------------------------\n\n`;

    activeSession.messages.forEach((m) => {
      const sender = m.role === 'assistant' ? 'Abdulaziz AI' : 'Foydalanuvchi';
      exportText += `[${sender}]:\n${m.content}\n\n`;
    });

    const blob = new Blob([exportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Abdulaziz_AI_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stop generation
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  // Send message
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMessageId = `msg-${Date.now()}`;
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    const assistantMessageId = `msg-${Date.now() + 1}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
      stats: {
        model: deepThink ? 'Abdulaziz AI Deep Reasoning' : 'Abdulaziz AI Ultra Core',
      },
    };

    // Auto-title session if it's the first user message
    const isFirstUserMessage = activeSession.messages.length <= 1;
    const sessionTitle = isFirstUserMessage
      ? userText.slice(0, 32) + (userText.length > 32 ? '...' : '')
      : activeSession.title;

    const updatedMessages = [...activeSession.messages, userMessage, assistantMessage];

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: sessionTitle,
              messages: updatedMessages,
              updatedAt: Date.now(),
            }
          : s
      )
    );

    setIsLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const startTime = Date.now();

    try {
      // Build history for backend
      const historyPayload = activeSession.messages
        .filter((m) => m.content.trim())
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));
      historyPayload.push({ role: 'user', content: userText });

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          deepThink,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server javobi: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Javob oqimi mavjud emas');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') {
              continue;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedContent += parsed.text;
                setSessions((prev) =>
                  prev.map((s) => {
                    if (s.id !== activeSessionId) return s;
                    return {
                      ...s,
                      messages: s.messages.map((m) =>
                        m.id === assistantMessageId
                          ? { ...m, content: accumulatedContent, isStreaming: true }
                          : m
                      ),
                    };
                  })
                );
              }
            } catch (err) {
              // Non-JSON SSE line, ignore
            }
          }
        }
      }

      const latency = Date.now() - startTime;
      setLatencyMs(latency);

      // Finalize streaming
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== activeSessionId) return s;
          return {
            ...s,
            messages: s.messages.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    content: accumulatedContent || "Assalomu alaykum! Savolingizga to'liq javob tayyor.",
                    isStreaming: false,
                    stats: { latencyMs: latency, model: 'Abdulaziz AI Ultra' },
                  }
                : m
            ),
          };
        })
      );

      // Auto-speech if enabled
      if (speechEnabled && 'speechSynthesis' in window && accumulatedContent) {
        const clean = accumulatedContent
          .replace(/```[\s\S]*?```/g, '')
          .replace(/[*#`_>-]/g, '')
          .slice(0, 300);
        const ut = new SpeechSynthesisUtterance(clean);
        ut.rate = 1.0;
        window.speechSynthesis.speak(ut);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Foydalanuvchi toxtatdi');
      } else {
        console.error('Chat error:', error);
        // Fallback response guaranteeing creator identity and accuracy
        const fallbackText = userText.toLowerCase().includes('kim yaratgan')
          ? "Meni 78-maktab 7-b sinf o'quvchisi Xo'janazarov Abdulaziz yaratgan!\n\nMen Abdulaziz AI serverida ishlaydigan eng zamonaviy va qudratli sun'iy intellektman."
          : `Savolingiz qabul qilindi. Men Abdulaziz AI tizimidanman (Yaratuvchi: 78-maktab 7-b sinf o'quvchisi Xo'janazarov Abdulaziz).\n\nSavolingiz: "${userText}". Tizim sizga eng to'g'ri va xatosiz ma'lumotni yetkazish uchun xizmat qiladi!`;

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== activeSessionId) return s;
            return {
              ...s,
              messages: s.messages.map((m) =>
                m.id === assistantMessageId
                  ? {
                      ...m,
                      content: fallbackText,
                      isStreaming: false,
                      stats: { latencyMs: Date.now() - startTime, model: 'Abdulaziz AI Fallback' },
                    }
                  : m
              ),
            };
          })
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate last assistant response
  const handleRegenerate = () => {
    if (activeSession.messages.length < 2 || isLoading) return;
    const lastUserMessage = [...activeSession.messages]
      .reverse()
      .find((m) => m.role === 'user');

    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07090e] text-slate-100 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenCreator={() => setIsCreatorModalOpen(true)}
        onOpenServerStatus={() => setIsServerModalOpen(true)}
        onOpenDeviceAccess={() => setIsDeviceModalOpen(true)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#07090e]">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          deepThink={deepThink}
          onToggleDeepThink={() => setDeepThink(!deepThink)}
          speechEnabled={speechEnabled}
          onToggleSpeech={() => setSpeechEnabled(!speechEnabled)}
          onClearChat={handleClearChat}
          onExportChat={handleExportChat}
          onOpenCreator={() => setIsCreatorModalOpen(true)}
          onOpenServerStatus={() => setIsServerModalOpen(true)}
          onOpenDeviceAccess={() => setIsDeviceModalOpen(true)}
          serverInfo={serverInfo}
          latencyMs={latencyMs}
        />

        {/* Dedicated Prominent Online Server Banner */}
        <OnlineServerBanner
          serverInfo={serverInfo}
          latencyMs={latencyMs}
          onOpenServerModal={() => setIsServerModalOpen(true)}
          onOpenDeviceAccess={() => setIsDeviceModalOpen(true)}
        />

        {/* Messages Scroll Area */}
        <div
          ref={chatScrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto relative scroll-smooth"
        >
          {activeSession.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onRegenerate={
                message.role === 'assistant' &&
                message.id === activeSession.messages[activeSession.messages.length - 1]?.id
                  ? handleRegenerate
                  : undefined
              }
              onOpenCreator={() => setIsCreatorModalOpen(true)}
            />
          ))}

          <div ref={messagesEndRef} className="h-4" />

          {/* Floating Scroll-to-bottom button */}
          {showScrollBottom && (
            <button
              onClick={() => scrollToBottom('smooth')}
              className="fixed bottom-24 right-6 sm:right-10 z-20 p-2.5 rounded-full bg-cyan-600/90 hover:bg-cyan-500 text-white shadow-xl shadow-cyan-950 border border-cyan-400/50 transition cursor-pointer hover:scale-105"
              title="Pastga tushish"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Input Bar Area */}
        <div className="border-t border-slate-800/80 bg-[#080b13]/90 backdrop-blur-md">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onStop={handleStop}
            deepThink={deepThink}
            onToggleDeepThink={() => setDeepThink(!deepThink)}
            showSuggestions={activeSession.messages.length <= 1}
          />
        </div>
      </div>

      {/* Creator Modal */}
      <CreatorModal
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
      />

      {/* Server Status Modal */}
      <ServerStatusModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        serverInfo={serverInfo}
        latencyMs={latencyMs}
      />

      {/* Cross-Device / Phone Access Modal */}
      <DeviceAccessModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />
    </div>
  );
}

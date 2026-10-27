import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Helper to parse blocks: code blocks vs text blocks
  const parseBlocks = (raw: string) => {
    const blocks: { type: 'code' | 'text'; language?: string; content: string }[] = [];
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(raw)) !== null) {
      if (match.index > lastIndex) {
        blocks.push({
          type: 'text',
          content: raw.substring(lastIndex, match.index),
        });
      }
      blocks.push({
        type: 'code',
        language: match[1] || 'kod',
        content: match[2].trimEnd(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < raw.length) {
      blocks.push({
        type: 'text',
        content: raw.substring(lastIndex),
      });
    }

    return blocks;
  };

  // Helper to render formatted inline text
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
      // Check for table row
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        return (
          <div key={lineIdx} className="overflow-x-auto my-1 font-mono text-xs sm:text-sm bg-slate-900/60 p-2 rounded border border-slate-800">
            {line}
          </div>
        );
      }

      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={lineIdx} className="text-base sm:text-lg font-bold text-cyan-300 mt-4 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-cyan-400 rounded-full inline-block"></span>
            {renderInlineSpans(line.replace('### ', ''))}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={lineIdx} className="text-lg sm:text-xl font-bold text-purple-300 mt-5 mb-2.5 flex items-center gap-2 border-b border-purple-500/20 pb-1">
            <span className="w-2 h-5 bg-purple-400 rounded-full inline-block"></span>
            {renderInlineSpans(line.replace('## ', ''))}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={lineIdx} className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 mt-6 mb-3">
            {renderInlineSpans(line.replace('# ', ''))}
          </h1>
        );
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        return (
          <blockquote key={lineIdx} className="border-l-4 border-cyan-500 bg-cyan-950/20 px-3.5 py-1.5 my-2 rounded-r-lg text-slate-300 italic text-sm">
            {renderInlineSpans(line.replace('> ', ''))}
          </blockquote>
        );
      }

      // Unordered lists
      if (line.match(/^[\*\-]\s+/)) {
        return (
          <li key={lineIdx} className="ml-4 list-disc text-slate-200 my-1 marker:text-cyan-400 leading-relaxed text-sm sm:text-base">
            {renderInlineSpans(line.replace(/^[\*\-]\s+/, ''))}
          </li>
        );
      }

      // Numbered lists
      if (line.match(/^\d+\.\s+/)) {
        return (
          <li key={lineIdx} className="ml-5 list-decimal text-slate-200 my-1 marker:text-purple-400 font-medium leading-relaxed text-sm sm:text-base">
            {renderInlineSpans(line.replace(/^\d+\.\s+/, ''))}
          </li>
        );
      }

      // Empty line spacing
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      // Regular paragraph
      return (
        <p key={lineIdx} className="my-1.5 leading-relaxed text-slate-200 text-sm sm:text-base">
          {renderInlineSpans(line)}
        </p>
      );
    });
  };

  // Helper for inline styles: bold, italic, code
  const renderInlineSpans = (raw: string) => {
    // Regex for bold (**text**), inline code (`code`), italic (*text*)
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
    let lastIdx = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(raw)) !== null) {
      if (match.index > lastIdx) {
        parts.push(raw.substring(lastIdx, match.index));
      }

      const matchStr = match[0];
      if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
            {matchStr.slice(2, -2)}
          </strong>
        );
      } else if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
        parts.push(
          <code key={match.index} className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700">
            {matchStr.slice(1, -1)}
          </code>
        );
      } else if (matchStr.startsWith('*') && matchStr.endsWith('*')) {
        parts.push(
          <em key={match.index} className="text-slate-300 italic">
            {matchStr.slice(1, -1)}
          </em>
        );
      }

      lastIdx = match.index + matchStr.length;
    }

    if (lastIdx < raw.length) {
      parts.push(raw.substring(lastIdx));
    }

    return parts;
  };

  const blocks = parseBlocks(content);

  return (
    <div className="space-y-3 break-words">
      {blocks.map((block, idx) => {
        if (block.type === 'code') {
          const isCopied = copiedIndex === idx;
          return (
            <div
              key={idx}
              className="my-3 rounded-xl overflow-hidden border border-slate-700/60 bg-[#0d1117] shadow-lg shadow-black/40"
            >
              <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800/80 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold tracking-wider uppercase">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  {block.language || 'code'}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(block.content, idx)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
                  title="Kodni nusxalash"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Nusxalandi!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Nusxa olish</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed bg-[#0a0d14]">
                <pre>{block.content}</pre>
              </div>
            </div>
          );
        }

        return <div key={idx}>{renderFormattedText(block.content)}</div>;
      })}
    </div>
  );
};

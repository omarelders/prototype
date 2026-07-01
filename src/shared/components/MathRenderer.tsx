import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  text: string;
  className?: string;
}

export default function MathRenderer({ text, className = '' }: MathRendererProps) {
  if (!text) return null;

  // Arrays to hold rendered React nodes for math placeholders
  const blockMathNodes: React.ReactNode[] = [];
  const inlineMathNodes: React.ReactNode[] = [];

  let processedText = text;

  // 1. Extract block math $$...$$
  processedText = processedText.replace(/\$\$(.*?)\$\$/gs, (_, mathContent) => {
    const idx = blockMathNodes.length;
    try {
      const html = katex.renderToString(mathContent.trim(), {
        displayMode: true,
        throwOnError: false,
      });
      blockMathNodes.push(
        <div
          key={`block-math-${idx}`}
          className="my-4 overflow-x-auto max-w-full text-center py-3 px-4 bg-slate-50 rounded-xl border border-slate-200/60 shadow-inner"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch (err) {
      blockMathNodes.push(
        <pre key={`block-math-err-${idx}`} className="text-rose-600 bg-rose-50 p-3 rounded-xl my-2 text-xs overflow-x-auto border border-rose-100">
          {mathContent}
        </pre>
      );
    }
    return ` __BLOCK_MATH_PLACEHOLDER_${idx}__ `;
  });

  // 2. Extract inline math $...$
  processedText = processedText.replace(/\$(.*?)\$/g, (_, mathContent) => {
    const idx = inlineMathNodes.length;
    try {
      const html = katex.renderToString(mathContent, {
        displayMode: false,
        throwOnError: false,
      });
      inlineMathNodes.push(
        <span
          key={`inline-math-${idx}`}
          className="inline-block px-1.5 py-0.5 bg-indigo-50/50 text-indigo-900 border border-indigo-100/40 rounded font-serif mx-0.5 align-middle"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch (err) {
      inlineMathNodes.push(
        <span key={`inline-math-err-${idx}`} className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 text-xs">
          {mathContent}
        </span>
      );
    }
    return ` __INLINE_MATH_PLACEHOLDER_${idx}__ `;
  });

  // Helper function to substitute placeholders in a string and return React elements
  const renderTextWithMath = (str: string, keyPrefix: string): React.ReactNode[] => {
    const parts = str.split(/(__BLOCK_MATH_PLACEHOLDER_\d+__|__INLINE_MATH_PLACEHOLDER_\d+__)/g);
    
    return parts.map((part, idx) => {
      const blockMatch = part.match(/__BLOCK_MATH_PLACEHOLDER_(\d+)__/);
      if (blockMatch) {
        const nodeIdx = parseInt(blockMatch[1], 10);
        return blockMathNodes[nodeIdx];
      }

      const inlineMatch = part.match(/__INLINE_MATH_PLACEHOLDER_(\d+)__/);
      if (inlineMatch) {
        const nodeIdx = parseInt(inlineMatch[1], 10);
        return inlineMathNodes[nodeIdx];
      }

      // Parse bold **text** inside
      const boldParts = part.split(/\*\*(.*?)\*\*/g);
      return (
        <React.Fragment key={`${keyPrefix}-${idx}`}>
          {boldParts.map((bPart, bIdx) => {
            if (bIdx % 2 === 1) {
              return <strong key={`${keyPrefix}-${idx}-bold-${bIdx}`} className="font-extrabold text-slate-900">{bPart}</strong>;
            }
            return bPart;
          })}
        </React.Fragment>
      );
    });
  };

  // 3. Parse Markdown-like lines (headers, paragraphs, lists)
  const lines = processedText.split('\n');
  const renderedElements: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`ul-${listKey++}`} className="list-disc pl-5 my-3 space-y-1.5 text-slate-700">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      flushList();
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      const contentStr = line.slice(4);
      renderedElements.push(
        <h3 key={`h3-${i}`} className="text-sm font-extrabold text-slate-900 mt-5 mb-2 pb-1.5 border-b border-slate-100 flex items-center gap-2">
          {renderTextWithMath(contentStr, `h3-${i}`)}
        </h3>
      );
    }
    else if (line.startsWith('## ')) {
      flushList();
      const contentStr = line.slice(3);
      renderedElements.push(
        <h2 key={`h2-${i}`} className="text-base font-black text-slate-900 mt-6 mb-3 pb-2 border-b border-slate-200">
          {renderTextWithMath(contentStr, `h2-${i}`)}
        </h2>
      );
    }
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      const contentStr = line.slice(2);
      currentList.push(
        <li key={`li-${i}-${currentList.length}`} className="leading-relaxed">
          {renderTextWithMath(contentStr, `li-${i}`)}
        </li>
      );
    }
    else {
      flushList();
      renderedElements.push(
        <p key={`p-${i}`} className="my-3 leading-relaxed text-slate-700 font-medium">
          {renderTextWithMath(line, `p-${i}`)}
        </p>
      );
    }
  }
  
  flushList();

  return <div className={`math-rendered-container ${className}`}>{renderedElements}</div>;
}

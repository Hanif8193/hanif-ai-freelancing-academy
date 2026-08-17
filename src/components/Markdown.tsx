// M5 — Safe lightweight Markdown renderer for Tutor/chat responses.
// Renders a useful subset (headings, lists, bold/italic, inline code, fenced
// code blocks with prism highlighting, links, paragraphs) WITHOUT
// dangerouslySetInnerHTML — LLM output is never injected as raw HTML.

import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { useColorMode } from '@docusaurus/theme-common';

// ============================================================
// Block splitting
// ============================================================

interface Block {
  type: 'code' | 'text';
  lang?: string;
  code?: string;
  text?: string;
}

function splitBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    const fence = lines[i].match(/^```(\w*)\s*$/);
    if (fence) {
      const lang = fence[1] || 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({ type: 'code', lang, code: codeLines.join('\n') });
    } else {
      const textLines: string[] = [];
      while (i < lines.length && !/^```/.test(lines[i])) {
        textLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'text', text: textLines.join('\n') });
    }
  }

  return blocks;
}

// ============================================================
// Inline formatting (no raw HTML)
// ============================================================

function renderInline(text: string, keyBase: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const parts = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  let k = 0;

  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      nodes.push(
        <code key={`${keyBase}-${k++}`} className="markdown-inline-code">
          {part.slice(1, -1)}
        </code>
      );
    } else if (part.startsWith('[') && part.includes('](')) {
      const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        nodes.push(
          <a key={`${keyBase}-${k++}`} href={m[2]} target="_blank" rel="noopener noreferrer">
            {m[1]}
          </a>
        );
      } else {
        nodes.push(part);
      }
    } else if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      nodes.push(<strong key={`${keyBase}-${k++}`}>{part.slice(2, -2)}</strong>);
    } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      nodes.push(<em key={`${keyBase}-${k++}`}>{part.slice(1, -1)}</em>);
    } else {
      nodes.push(part);
    }
  }
  return nodes;
}

function renderTextBlock(text: string, key: string): React.ReactNode {
  const lines = text.split('\n');
  const paragraphs: React.ReactNode[] = [];
  let current: string[] = [];
  let listItems: { ordered: boolean; items: string[] } | null = null;
  let itemKey = 0;

  const flush = (isListEnd = false) => {
    if (listItems && (isListEnd || current.length > 0)) {
      paragraphs.push(
        listItems.ordered ? (
          <ol key={`${key}-list-${itemKey++}`}>
            {listItems.items.map((li, i) => (
              <li key={i}>{renderInline(li, `${key}-li-${i}`)}</li>
            ))}
          </ol>
        ) : (
          <ul key={`${key}-list-${itemKey++}`}>
            {listItems.items.map((li, i) => (
              <li key={i}>{renderInline(li, `${key}-li-${i}`)}</li>
            ))}
          </ul>
        )
      );
      listItems = null;
    }
    if (current.length > 0) {
      paragraphs.push(
        <p key={`${key}-p-${itemKey++}`}>{renderInline(current.join(' '), `${key}-p`)}</p>
      );
      current = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    const unordered = trimmed.match(/^[-*]\s+(.+)$/);
    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);

    if (heading) {
      flush(true);
      const level = heading[1].length;
      const H = (['h1', 'h2', 'h3'] as const)[level - 1];
      paragraphs.push(
        <H key={`${key}-h-${itemKey++}`}>{renderInline(heading[2], `${key}-h`)}</H>
      );
    } else if (unordered || ordered) {
      flush();
      if (!listItems) listItems = { ordered: !!ordered, items: [] };
      listItems.items.push((unordered || ordered)![1]);
    } else if (trimmed === '') {
      flush(true);
    } else {
      flush();
      current.push(line);
    }
  }
  flush(true);

  return <React.Fragment key={key}>{paragraphs}</React.Fragment>;
}

// ============================================================
// Main component
// ============================================================

export default function Markdown({ text }: { text: string }): React.ReactNode {
  const { colorMode } = useColorMode();
  const theme = colorMode === 'dark' ? themes.dracula : themes.github;

  const blocks = splitBlocks(text || '');

  return (
    <div className="markdown-body">
      {blocks.map((block, i) => {
        if (block.type === 'code') {
          return (
            <div key={i} className="markdown-code">
              <Highlight theme={theme} code={block.code || ''} language={(block.lang || 'text') as string}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={className} style={{ ...style, overflowX: 'auto' }}>
                    {tokens.map((line, lineIndex) => (
                      <div key={lineIndex} {...getLineProps({ line })}>
                        {line.map((token, tokenIndex) => (
                          <span key={tokenIndex} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          );
        }
        return renderTextBlock(block.text || '', `block-${i}`);
      })}
    </div>
  );
}

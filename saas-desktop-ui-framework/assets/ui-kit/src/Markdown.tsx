import { memo, useDeferredValue, type MouseEvent } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remend from 'remend';

/**
 * Markdown 正文（react-markdown + remark-gfm；流式时用 remend 补全未闭合的语法）。
 * 安全约束（规范 §2.4、§9.2）：
 * - 不渲染原始 HTML（skipHtml）；
 * - 链接只允许 http / https / mailto，点击后交给调用方（桌面端经 Main 校验后在系统浏览器打开）；
 * - 不加载远程图片（防止追踪与外传），只显示替代文字。
 */
const SAFE_URL = /^(https?:|mailto:)/i;

export function safeMarkdownUrl(url: string): string {
  return SAFE_URL.test(url.trim()) ? url.trim() : '';
}

function MarkdownImpl({
  text,
  streaming = false,
  onOpenLink,
}: {
  text: string;
  /** 进行中的回复：补全未闭合的粗体、代码块、链接等，避免闪烁。 */
  streaming?: boolean;
  onOpenLink?: (url: string) => void;
}) {
  const deferred = useDeferredValue(text);
  const source = streaming ? remend(deferred) : deferred;
  const components: Components = {
    a: ({ href, children }) => {
      const url = href ? safeMarkdownUrl(href) : '';
      if (!url) return <span className="ui-markdown__link-text">{children}</span>;
      return (
        <a
          className="ui-markdown__link"
          href={url}
          onClick={(e: MouseEvent) => {
            e.preventDefault();
            onOpenLink?.(url);
          }}
        >
          {children}
        </a>
      );
    },
    img: ({ alt }) => (alt ? <span className="ui-markdown__image-alt">[{alt}]</span> : null),
  };
  return (
    <div className="ui-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        urlTransform={safeMarkdownUrl}
        components={components}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

export const Markdown = memo(MarkdownImpl);

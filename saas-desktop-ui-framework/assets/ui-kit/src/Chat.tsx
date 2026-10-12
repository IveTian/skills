import type { ReactNode } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { cx } from './cx';
import { IconButton } from './IconButton';
import { ArrowDown } from './icons';

/**
 * 对话消息列表（use-stick-to-bottom）：流式输出时内容长高保持贴底；用户向上滚动后停止跟随，
 * 右下角出现「回到最新」。
 */
export function ChatLog({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <StickToBottom className={cx('ui-chat-log', className)} resize="smooth" initial="instant">
      <StickToBottom.Content
        className="ui-chat-log__content"
        scrollClassName="ui-chat-log__scroll"
        role="log"
        aria-label={label}
      >
        {children}
      </StickToBottom.Content>
      <JumpToLatest />
    </StickToBottom>
  );
}

function JumpToLatest() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  if (isAtBottom) return null;
  return (
    <div className="ui-chat-log__jump">
      <IconButton
        label="回到最新"
        tooltipSide="top"
        icon={<ArrowDown />}
        onClick={() => void scrollToBottom()}
      />
    </div>
  );
}

/** 一条消息：用户消息为右侧气泡；Agent 回复为通栏正文，下方可放状态与操作。 */
export function ChatMessage({
  role,
  children,
  footer,
}: {
  role: 'user' | 'assistant';
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <article
      className={`ui-chat-message ui-chat-message--${role}`}
      aria-label={role === 'user' ? '你' : 'Agent'}
    >
      <div className="ui-chat-message__body">{children}</div>
      {footer && <div className="ui-chat-message__footer">{footer}</div>}
    </article>
  );
}

/**
 * 运行状态行：进行中显示旋转指示与当前步骤，结束后显示结果；操作（停止 / 重新运行）放在右侧。
 */
export function RunLine({
  tone,
  busy,
  children,
  actions,
}: {
  tone: 'neutral' | 'danger' | 'attention';
  busy?: boolean;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className={`ui-run-line ui-run-line--${tone}`} role="status" aria-live="polite">
      {busy && <span className="ui-spinner ui-run-line__spinner" aria-hidden="true" />}
      <span className="ui-run-line__text">{children}</span>
      {actions && <span className="ui-run-line__actions">{actions}</span>}
    </div>
  );
}

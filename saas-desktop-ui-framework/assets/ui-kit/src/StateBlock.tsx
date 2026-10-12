import type { ReactNode } from 'react';
import { Button } from './Button';

/** 状态区块（经批准的轻量封装）：加载 / 空 / 失败。 */
export function LoadingState({ label = '正在加载…' }: { label?: string }) {
  return (
    <div className="ui-state ui-state--loading" role="status" aria-live="polite">
      <div className="ui-skeleton" style={{ width: '60%' }} />
      <div className="ui-skeleton" style={{ width: '85%' }} />
      <div className="ui-skeleton" style={{ width: '40%' }} />
      <span className="ui-sr-only">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="ui-state ui-state--empty">
      <p className="ui-state__title">{title}</p>
      {description && <p className="ui-state__text">{description}</p>}
      {action && <div className="ui-state__action">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = '加载失败',
  message,
  onRetry,
  retrying,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
}) {
  return (
    <div className="ui-state ui-state--error" role="alert">
      <p className="ui-state__title">{title}</p>
      <p className="ui-state__text">{message}</p>
      {onRetry && (
        <div className="ui-state__action">
          <Button size="sm" onClick={onRetry} loading={retrying}>
            {retrying ? '重试中…' : '重试'}
          </Button>
        </div>
      )}
    </div>
  );
}

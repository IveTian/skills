import { Tooltip } from './Tooltip';

const rtf = new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' });
const full = new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long', timeStyle: 'short' });

export function relativeTime(iso: string, now = Date.now()): string {
  const diff = (new Date(iso).getTime() - now) / 1000;
  const abs = Math.abs(diff);
  if (abs < 45) return '刚刚';
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 86400 * 7) return rtf.format(Math.round(diff / 86400), 'day');
  return full.format(new Date(iso));
}

/** 相对时间（经批准的轻量封装）：悬停 / 聚焦时用 Base UI Tooltip 显示完整时间。 */
export function RelativeTime({ iso }: { iso: string }) {
  return (
    <Tooltip content={full.format(new Date(iso))}>
      <time className="ui-time" dateTime={iso} tabIndex={0}>
        {relativeTime(iso)}
      </time>
    </Tooltip>
  );
}

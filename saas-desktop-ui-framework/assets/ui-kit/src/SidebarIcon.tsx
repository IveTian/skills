import { cx } from './cx';

/**
 * 侧栏开关图标：外框 + 内侧竖条。竖条随侧栏开合在「实心块（展开）↔ 与外框同粗的线（收起）」之间过渡，
 * 时长与缓动同侧栏外壳的 Card resize，可中途反向（形状见 styles.css 的 .ui-sidebar-icon）。
 * side="right" 时水平镜像，用于右侧栏（Agent 档案）开关。
 */
export function SidebarIcon({
  collapsed,
  side = 'left',
  className,
}: {
  collapsed: boolean;
  side?: 'left' | 'right';
  className?: string;
}) {
  return (
    <svg
      className={cx('ui-sidebar-icon', className)}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      data-collapsed={collapsed ? '' : undefined}
      data-side={side}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="14" height="12" rx="3" />
      <path className="ui-sidebar-icon__bar" fill="currentColor" />
    </svg>
  );
}

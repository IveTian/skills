import { Collapsible } from '@base-ui/react/collapsible';
import type { MouseEvent, ReactNode } from 'react';
import { Button, type ButtonProps } from './Button';
import { cx } from './cx';
import { CaretDown } from './icons';

/** 侧栏分组：标题可折叠（Base UI Collapsible），右侧可放一个操作按钮。 */
export function SidebarSection({
  title,
  action,
  defaultOpen = true,
  children,
}: {
  title: string;
  action?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <Collapsible.Root defaultOpen={defaultOpen} className="ui-sidebar-section">
      <div className="ui-sidebar-section__head">
        <Collapsible.Trigger className="ui-sidebar-section__toggle">
          {title}
          <CaretDown aria-hidden="true" />
        </Collapsible.Trigger>
        {action}
      </div>
      <Collapsible.Panel className="ui-sidebar-section__body">{children}</Collapsible.Panel>
    </Collapsible.Root>
  );
}

export type SidebarItemProps = Omit<ButtonProps, 'variant' | 'children'> & {
  label: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
  shortcut?: string;
  current?: boolean;
  tone?: 'default' | 'primary' | 'child' | 'muted';
};

/** 侧栏导航行（Base UI Button）：图标 + 文本 + 行尾信息或快捷键。 */
export function SidebarItem({
  label,
  icon,
  trailing,
  shortcut,
  current,
  tone = 'default',
  className,
  ...rest
}: SidebarItemProps) {
  return (
    <Button
      {...rest}
      variant="sidebar"
      className={cx('ui-sidebar-item', tone !== 'default' && `ui-sidebar-item--${tone}`, className)}
      aria-current={current ? 'page' : undefined}
    >
      {icon !== undefined && <span className="ui-sidebar-item__icon">{icon}</span>}
      <span className="ui-sidebar-item__label">{label}</span>
      {trailing !== undefined && <span className="ui-sidebar-item__trailing">{trailing}</span>}
      {shortcut && <span className="ui-kbd">{shortcut}</span>}
    </Button>
  );
}

/**
 * 可展开的侧栏行（如 Agent 及其会话）：左侧展开按钮与右侧选择按钮是两个独立按钮，
 * 子项放在 Base UI Collapsible.Panel 中。
 */
export function SidebarTreeItem({
  label,
  trailing,
  current,
  open,
  onOpenChange,
  onSelect,
  expandLabel,
  muted,
  children,
}: {
  label: string;
  trailing?: ReactNode;
  current?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 点击或中键（onAuxClick）选择；事件交给调用方判断是否在新标签页打开。 */
  onSelect: (e: MouseEvent) => void;
  expandLabel: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <Collapsible.Root open={open} onOpenChange={(o) => onOpenChange(o)}>
      <div className="ui-sidebar-tree__row">
        <Collapsible.Trigger className="ui-sidebar-tree__disclosure" aria-label={expandLabel}>
          <CaretDown aria-hidden="true" />
        </Collapsible.Trigger>
        <SidebarItem
          label={label}
          trailing={trailing}
          current={current}
          onClick={onSelect}
          onAuxClick={onSelect}
          tone={muted ? 'muted' : 'default'}
        />
      </div>
      <Collapsible.Panel className="ui-sidebar-section__body">{children}</Collapsible.Panel>
    </Collapsible.Root>
  );
}

/** 状态圆点（侧栏行首 / 状态栏）。 */
export function StatusDot({
  tone,
  label,
}: {
  tone: 'attention' | 'running' | 'online' | 'offline';
  label?: string;
}) {
  return (
    <span
      className={`ui-dot ui-dot--${tone}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

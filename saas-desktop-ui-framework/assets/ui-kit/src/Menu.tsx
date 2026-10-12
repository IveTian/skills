import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { CaretRight, Check } from './icons';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from './cx';

/** Base UI Menu 的风格化部件（替代任何原生下拉菜单）。 */
export const Menu = BaseMenu.Root;

export function MenuTrigger({
  className,
  variant = 'pill',
  ...rest
}: Omit<ComponentProps<typeof BaseMenu.Trigger>, 'className'> & {
  className?: string;
  /** pill：账户等胶囊按钮；chip：输入框上方的选择器；row：侧栏底部整行；bare：完全自定义样式。 */
  variant?: 'pill' | 'chip' | 'row' | 'bare';
}) {
  const cls =
    variant === 'bare'
      ? className
      : cx('ui-menu-trigger', variant !== 'pill' && `ui-menu-trigger--${variant}`, className);
  return <BaseMenu.Trigger {...rest} className={cls} />;
}

export function MenuContent({
  children,
  align = 'end',
  side = 'bottom',
}: {
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
}) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner align={align} side={side} sideOffset={6}>
        <BaseMenu.Popup className="ui-menu">{children}</BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export function MenuItem({
  className,
  ...rest
}: Omit<ComponentProps<typeof BaseMenu.Item>, 'className'> & { className?: string }) {
  return <BaseMenu.Item {...rest} className={cx('ui-menu__item', className)} />;
}

/** 菜单顶部的说明（例如当前账户），不可选中。 */
export function MenuHeader({ children }: { children: ReactNode }) {
  return (
    <BaseMenu.Group>
      <BaseMenu.GroupLabel className="ui-menu__label">{children}</BaseMenu.GroupLabel>
    </BaseMenu.Group>
  );
}

/** 单选项（如「交给」哪个 Agent）。 */
export function MenuRadioGroup<V extends string>({
  value,
  onValueChange,
  children,
}: {
  value: V;
  onValueChange: (value: V) => void;
  children: ReactNode;
}) {
  return (
    <BaseMenu.RadioGroup value={value} onValueChange={(v) => onValueChange(v as V)}>
      {children}
    </BaseMenu.RadioGroup>
  );
}

export function MenuRadioItem({
  value,
  children,
  meta,
  disabled,
  closeOnClick,
}: {
  value: string;
  children: ReactNode;
  meta?: ReactNode;
  disabled?: boolean;
  /** 选择框式菜单：选中后关闭菜单（默认不关闭）。 */
  closeOnClick?: boolean;
}) {
  return (
    <BaseMenu.RadioItem
      value={value}
      disabled={disabled}
      closeOnClick={closeOnClick}
      className="ui-menu__item ui-menu__item--radio"
    >
      {children}
      {meta && <span className="ui-menu__item-meta">{meta}</span>}
      <span className="ui-menu__check">
        <BaseMenu.RadioItemIndicator>
          <Check aria-hidden="true" />
        </BaseMenu.RadioItemIndicator>
      </span>
    </BaseMenu.RadioItem>
  );
}

/**
 * 子菜单（Base UI Menu.SubmenuRoot，2026-10-12 产品负责人指定：Workspace 菜单的「切换 Workspace ▸」）。
 * 用法：<MenuSubmenu><MenuSubmenuTrigger>…</MenuSubmenuTrigger><MenuContent side="right" align="start">…</MenuContent></MenuSubmenu>
 */
export const MenuSubmenu = BaseMenu.SubmenuRoot;

/** 子菜单入口：外观同菜单项，行尾为右箭头；悬停或按右方向键展开。 */
export function MenuSubmenuTrigger({ children, meta }: { children: ReactNode; meta?: ReactNode }) {
  return (
    <BaseMenu.SubmenuTrigger className="ui-menu__item ui-menu__item--submenu">
      {children}
      {meta && <span className="ui-menu__item-meta">{meta}</span>}
      <CaretRight className="ui-menu__submenu-icon" aria-hidden="true" />
    </BaseMenu.SubmenuTrigger>
  );
}

export function MenuSeparator() {
  return <BaseMenu.Separator className="ui-menu__separator" />;
}

/** Base UI Avatar：无头像图片时显示姓名首字。 */
export function Avatar({ name, src }: { name: string; src?: string }) {
  const initials = name.trim().slice(0, 2).toUpperCase() || '?';
  return (
    <BaseAvatar.Root className="ui-avatar">
      {src && <BaseAvatar.Image src={src} alt="" />}
      <BaseAvatar.Fallback>{initials}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}

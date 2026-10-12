import type { ComponentType } from 'react';
import {
  IconArrowDown,
  IconArrowRotateClockwise,
  IconArrowUp,
  IconCloud,
  IconComputer,
  IconMediaStoppedFilled,
  IconShield,
  IconBoxArchive,
  IconChatBot,
  IconCaretDown,
  IconCaretRight,
  IconGear,
  IconCircleUserFilled,
  IconHouseFill,
  IconShieldFilled,
  IconUsersFilled,
  IconServerFilled,
  IconBoltFilled,
  IconWalletFilled,
  IconPaintbrushFilled,
  IconCheck,
  IconCircleCheckFilled,
  IconCircleXmarkFilled,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCompose,
  IconDots,
  IconArchive as IconInboxTray,
  IconLaptopMobile,
  IconMagnifier,
  IconMsg,
  IconPlus,
  IconXmarkSm,
  type IconProps,
} from 'nucleo-micro-bold';
import { cx } from './cx';

/**
 * 统一的图标出口（Nucleo micro bold，20 网格，渲染为 14px；尺寸与线宽由 styles.css 的 .ui-icon 规则控制）。
 * 对外名称保持语义化，与 Nucleo 的命名解耦；默认 aria-hidden，图标只作装饰。
 * 侧栏开关不在此列，用可随侧栏开合过渡的 SidebarIcon。
 */
function icon(Svg: ComponentType<IconProps>, name: string) {
  const Icon = ({ className, ...props }: IconProps) => (
    <Svg aria-hidden="true" {...props} className={cx('ui-icon', className)} />
  );
  Icon.displayName = name;
  return Icon;
}

export const Archive = icon(IconBoxArchive, 'Archive');
export const ArrowDown = icon(IconArrowDown, 'ArrowDown');
export const ArrowUp = icon(IconArrowUp, 'ArrowUp');
export const Cloud = icon(IconCloud, 'Cloud');
export const Computer = icon(IconComputer, 'Computer');
export const Retry = icon(IconArrowRotateClockwise, 'Retry');
export const Shield = icon(IconShield, 'Shield');
export const Stop = icon(IconMediaStoppedFilled, 'Stop');
export const Bot = icon(IconChatBot, 'Bot');
export const CaretDown = icon(IconCaretDown, 'CaretDown');
export const CaretRight = icon(IconCaretRight, 'CaretRight');
/** 设置导航（实心，2026-10-12 产品负责人指定；Gear 本身即实心）。 */
export const Gear = icon(IconGear, 'Gear');
export const CircleUserFilled = icon(IconCircleUserFilled, 'CircleUserFilled');
export const HouseFilled = icon(IconHouseFill, 'HouseFilled');
export const ShieldFilled = icon(IconShieldFilled, 'ShieldFilled');
export const UsersFilled = icon(IconUsersFilled, 'UsersFilled');
export const ServerFilled = icon(IconServerFilled, 'ServerFilled');
export const BoltFilled = icon(IconBoltFilled, 'BoltFilled');
export const WalletFilled = icon(IconWalletFilled, 'WalletFilled');
export const PaintbrushFilled = icon(IconPaintbrushFilled, 'PaintbrushFilled');
export const Check = icon(IconCheck, 'Check');
export const CircleCheck = icon(IconCircleCheckFilled, 'CircleCheck');
export const CircleX = icon(IconCircleXmarkFilled, 'CircleX');
export const ChevronDown = icon(IconChevronDown, 'ChevronDown');
export const ChevronLeft = icon(IconChevronLeft, 'ChevronLeft');
export const ChevronRight = icon(IconChevronRight, 'ChevronRight');
export const Ellipsis = icon(IconDots, 'Ellipsis');
export const Inbox = icon(IconInboxTray, 'Inbox');
export const MessageSquare = icon(IconMsg, 'MessageSquare');
export const MonitorSmartphone = icon(IconLaptopMobile, 'MonitorSmartphone');
export const Plus = icon(IconPlus, 'Plus');
export const Search = icon(IconMagnifier, 'Search');
export const SquarePen = icon(IconCompose, 'SquarePen');
export const X = icon(IconXmarkSm, 'X');

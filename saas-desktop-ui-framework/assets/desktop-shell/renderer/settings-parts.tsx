import {
  Button,
  Icons,
  Menu,
  MenuContent,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
  type ButtonProps,
} from '@diotia/ui';
import type { ReactNode } from 'react';

/**
 * 设置页版式部件（2026-10-12 按 Linear 设置页实测规格重做，见 ADR 0018 附录）：
 * - 居中单栏：内容宽 640，标题 24/32、分组标题 15/500，标题→分组 32、分组标题→卡片 16、卡片→下一分组 48；
 * - 卡片：白底、圆角 10、无描边（0.5px 半透明描边阴影 + 两层极淡投影）；
 * - 行：最小 60 高、内边距 16，名称 13/500、说明 12 次要色，行间 0.5px 分隔线左右内缩 16；
 * - 选择框 30 高、圆角 8；按钮为 32 高胶囊；「管理」类为文字按钮。
 * 只是布局，交互组件仍来自 @diotia/ui。
 */

export function SettingsPageTitle({
  title,
  description,
}: {
  title: string;
  description?: ReactNode;
}) {
  return (
    <header className="settings-head">
      <h1 className="settings-title" id="settings-title" tabIndex={-1}>
        {title}
      </h1>
      {description && <p className="settings-desc">{description}</p>}
    </header>
  );
}

/** 分组：标题（可选说明、可选右侧操作）+ 一张或多张卡片。 */
export function SettingsSection({
  title,
  description,
  action,
  children,
}: {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="settings-section" aria-label={title}>
      {(title || action) && (
        <div className="settings-section__head">
          <div className="settings-section__text">
            {title && <h2 className="settings-section__title">{title}</h2>}
            {description && <p className="settings-desc">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="settings-section__cards">{children}</div>
    </section>
  );
}

export function SettingsCard({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="settings-card" role={label ? 'group' : undefined} aria-label={label}>
      {children}
    </div>
  );
}

export function SettingsRow({
  label,
  description,
  leading,
  children,
  muted,
}: {
  label: ReactNode;
  description?: ReactNode;
  /** 行首（头像、图标方块）。 */
  leading?: ReactNode;
  /** 行尾控件或数值。 */
  children?: ReactNode;
  /** 不可用 / 次要的行（名称用次要色）。 */
  muted?: boolean;
}) {
  return (
    <div className={`settings-row${muted ? ' settings-row--muted' : ''}`}>
      {leading}
      <div className="settings-row__text">
        <div className="settings-row__label">{label}</div>
        {description && <div className="settings-row__desc">{description}</div>}
      </div>
      {children !== undefined && <div className="settings-row__control">{children}</div>}
    </div>
  );
}

/** 列表卡片的首行：「N 个 xx」+ 右侧操作（对照 Linear 的 API / 会话列表）。 */
export function SettingsListHead({ label, action }: { label: ReactNode; action?: ReactNode }) {
  return (
    <div className="settings-row settings-row--head">
      <div className="settings-row__label">{label}</div>
      {action && <div className="settings-row__control">{action}</div>}
    </div>
  );
}

/** 32 的图标方块（列表行首）。 */
export function SettingsTile({ children }: { children: ReactNode }) {
  return (
    <span className="settings-tile" aria-hidden="true">
      {children}
    </span>
  );
}

/** 入口卡片：图标、标题与说明，右侧箭头；整行可点击（对照 Linear 的 Usage explorer）。 */
export function SettingsLinkCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <Button variant="card" className="settings-card settings-link" onClick={onClick}>
      <SettingsTile>{icon}</SettingsTile>
      <span className="settings-row__text">
        <span className="settings-row__label">{title}</span>
        {description && <span className="settings-row__desc">{description}</span>}
      </span>
      <Icons.ChevronRight className="settings-link__chevron" aria-hidden="true" />
    </Button>
  );
}

/** 文字按钮（Linear 的「Manage」「Revoke all」）；tone="danger" 为红色。 */
export function TextButton({
  tone,
  className,
  ...rest
}: Omit<ButtonProps, 'variant'> & { tone?: 'danger' }) {
  return (
    <Button
      {...rest}
      variant="ghost"
      className={`settings-text-button${tone === 'danger' ? ' settings-text-button--danger' : ''}${className ? ` ${className}` : ''}`}
    />
  );
}

/** 选择框的细线小箭头（与侧栏 Workspace 选择器一致）。 */
export function SelectChevron() {
  return (
    <svg
      className="settings-select__chevron"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 4 5 6.5 7.5 4" />
    </svg>
  );
}

/**
 * 选择框（Linear 规格：30 高、圆角 8、白底细描边、13/400，右侧小箭头）。
 * 由 @diotia/ui 的 Menu + 单选项组合而成，不是新组件；选中后关闭菜单。
 */
export function SettingsSelect<V extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
  shape = 'rect',
  align = 'end',
}: {
  /** 无障碍名称前缀，例如「时区」。 */
  label: string;
  value: V;
  options: readonly {
    value: V;
    label: string;
    meta?: string;
    disabled?: boolean;
    /** 选项前的小预览（例如主题样张），选择框与菜单中都显示。 */
    leading?: ReactNode;
  }[];
  onChange: (value: V) => void;
  disabled?: boolean;
  /** pill：工具栏中的时间范围等（28 高胶囊）。 */
  shape?: 'rect' | 'pill';
  align?: 'start' | 'end';
}) {
  const current = options.find((o) => o.value === value);
  return (
    <Menu>
      <MenuTrigger
        variant="bare"
        className={`settings-select${shape === 'pill' ? ' settings-select--pill' : ''}`}
        aria-label={`${label}：${current?.label ?? ''}`}
        disabled={disabled}
      >
        {current?.leading}
        <span className="settings-select__value">{current?.label}</span>
        <SelectChevron />
      </MenuTrigger>
      <MenuContent align={align}>
        <MenuRadioGroup value={value} onValueChange={(v) => onChange(v as V)}>
          {options.map((o) => (
            <MenuRadioItem
              closeOnClick
              key={o.value}
              value={o.value}
              meta={o.meta}
              disabled={o.disabled}
            >
              {o.leading ? (
                <span className="settings-select__option">
                  {o.leading}
                  {o.label}
                </span>
              ) : (
                o.label
              )}
            </MenuRadioItem>
          ))}
        </MenuRadioGroup>
      </MenuContent>
    </Menu>
  );
}

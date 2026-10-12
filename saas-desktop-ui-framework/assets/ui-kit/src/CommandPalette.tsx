import { Autocomplete } from '@base-ui/react/autocomplete';
import { Dialog } from '@base-ui/react/dialog';
import { Search } from './icons';
import type { ReactNode } from 'react';

export type CommandItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  meta?: ReactNode;
  shortcut?: string;
  onSelect: () => void;
};
export type CommandGroup = { label: string; items: CommandItem[] };

/**
 * ⌘K 命令面板：Base UI Dialog + Autocomplete（inline 列表）。
 * 过滤由调用方完成（本地 Agent / 命令 + 服务端聊天搜索），这里只负责呈现与键盘选择。
 */
export function CommandPalette(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  groups: CommandGroup[];
  placeholder?: string;
  emptyText?: string;
}) {
  const groups = props.groups
    .filter((g) => g.items.length > 0)
    .map((g) => ({ value: g.label, items: g.items }));
  const choose = (item: CommandItem) => {
    props.onOpenChange(false);
    item.onSelect();
  };

  return (
    <Dialog.Root open={props.open} onOpenChange={(o) => props.onOpenChange(o)}>
      <Dialog.Portal>
        <Dialog.Backdrop className="ui-backdrop" />
        <Dialog.Popup className="ui-palette">
          <Dialog.Title className="ui-sr-only">命令面板</Dialog.Title>
          <Autocomplete.Root
            inline
            open
            filteredItems={groups}
            value={props.query}
            onValueChange={(v) => props.onQueryChange(v)}
            itemToStringValue={(item: CommandItem) => item.label}
            autoHighlight="always"
          >
            <div className="ui-palette__search">
              <Search aria-hidden="true" />
              <Autocomplete.Input
                className="ui-palette__input"
                placeholder={props.placeholder ?? '搜索或输入命令…'}
                aria-label="搜索或输入命令"
              />
              <span className="ui-kbd">esc</span>
            </div>
            <Autocomplete.Empty className="ui-palette__empty">
              {props.emptyText ?? '没有匹配的结果。'}
            </Autocomplete.Empty>
            <Autocomplete.List className="ui-palette__list">
              {(group: { value: string; items: CommandItem[] }) => (
                <Autocomplete.Group key={group.value} items={group.items}>
                  <Autocomplete.GroupLabel className="ui-palette__group-label">
                    {group.value}
                  </Autocomplete.GroupLabel>
                  <Autocomplete.Collection>
                    {(item: CommandItem) => (
                      <Autocomplete.Item
                        key={item.id}
                        value={item}
                        className="ui-palette__item"
                        onClick={() => choose(item)}
                      >
                        {item.icon && <span className="ui-palette__item-icon">{item.icon}</span>}
                        <span className="ui-palette__item-label">{item.label}</span>
                        {item.meta && <span className="ui-palette__item-meta">{item.meta}</span>}
                        {item.shortcut && <span className="ui-kbd">{item.shortcut}</span>}
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.Collection>
                </Autocomplete.Group>
              )}
            </Autocomplete.List>
          </Autocomplete.Root>
          <div className="ui-palette__footer">
            <span>↑↓ 选择</span>
            <span>⏎ 打开</span>
            <span>esc 关闭</span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

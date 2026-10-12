import { CommandPalette, Icons, SidebarIcon, StatusDot, type CommandGroup } from '@diotia/ui';
import { useDeferredValue, useMemo, useState } from 'react';
import { agentRoute, useNav } from '../nav';
import { useHome, useSearch } from '../queries';
import { useFrame } from './frame-context';

/**
 * ⌘K 命令面板的数据：命令（本地过滤）、Agents（本地过滤名称与用途）、聊天（服务端搜索标题）。
 */
export function CommandMenu({ onOpenSessions }: { onOpenSessions: () => void }) {
  const { paletteOpen, setPaletteOpen, sidebarOpen, toggleSidebar } = useFrame();
  const { navigate } = useNav();
  const [query, setQuery] = useState('');
  const q = useDeferredValue(query.trim());
  const home = useHome();
  const search = useSearch(q);

  const groups = useMemo<CommandGroup[]>(() => {
    const match = (...texts: string[]) =>
      !q || texts.some((t) => t.toLowerCase().includes(q.toLowerCase()));
    const commands = [
      {
        id: 'cmd:new',
        label: '新建 Agent',
        icon: <Icons.SquarePen />,
        shortcut: '⌘N',
        onSelect: () => navigate({ name: 'new' }),
      },
      {
        id: 'cmd:activity',
        label: '打开活动',
        icon: <Icons.Inbox />,
        shortcut: '⇧⌘A',
        onSelect: () => navigate({ name: 'activity' }),
      },
      {
        id: 'cmd:sidebar',
        label: '切换侧栏',
        icon: <SidebarIcon collapsed={!sidebarOpen} />,
        shortcut: '⌘\\',
        onSelect: toggleSidebar,
      },
      {
        id: 'cmd:sessions',
        label: '查看登录设备',
        icon: <Icons.MonitorSmartphone />,
        onSelect: onOpenSessions,
      },
    ].filter((c) => match(c.label));

    const agents = (home.data?.agents ?? [])
      .filter((a) => match(a.name, a.description))
      .slice(0, 8)
      .map((a) => ({
        id: `agent:${a.id}`,
        label: a.name,
        icon: a.needsAttention ? <StatusDot tone="attention" /> : <Icons.Bot />,
        meta: a.needsAttention ? '需要处理' : a.status === 'draft' ? '草稿' : undefined,
        onSelect: () => navigate(agentRoute(a.id)),
      }));

    const conversations = (
      q ? (search.data?.conversations ?? []) : (home.data?.recentConversations ?? [])
    )
      .slice(0, 8)
      .map((c) => ({
        id: `conv:${c.id}`,
        label: c.title,
        icon: <Icons.MessageSquare />,
        meta: c.agentName,
        onSelect: () => navigate(agentRoute(c.agentId, c.id)),
      }));

    return [
      { label: 'Agents', items: agents },
      { label: q ? '聊天' : '最近聊天', items: conversations },
      { label: '命令', items: commands },
    ];
  }, [q, home.data, search.data, navigate, sidebarOpen, toggleSidebar, onOpenSessions]);

  return (
    <CommandPalette
      open={paletteOpen}
      onOpenChange={(o) => {
        setPaletteOpen(o);
        if (!o) setQuery('');
      }}
      query={query}
      onQueryChange={setQuery}
      groups={groups}
      placeholder="搜索 Agent、聊天，或输入命令…"
      emptyText={q && search.isFetching ? '搜索中…' : '没有匹配的结果。'}
    />
  );
}

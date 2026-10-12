import type { Route } from './nav';

/**
 * 标签页模型（交互对照 Chrome）：每个标签页有自己的前进 / 后退历史；
 * 记录打开它的标签页（opener），用于「在新标签页中打开」的插入位置与关闭后的选中规则。
 */
export type Tab = { id: string; stack: Route[]; index: number; openerId?: string };
export type ClosedTab = { tab: Tab; index: number };
export type TabsState = { tabs: Tab[]; activeId: string; closed: ClosedTab[]; seq: number };

export type TabsAction =
  /** 在指定标签页（默认当前标签页）内导航 / 后退 / 前进。 */
  | { type: 'navigate'; route: Route; id?: string }
  | { type: 'back'; id?: string }
  | { type: 'forward'; id?: string }
  /** 从当前标签页打开链接（⌘ 点击 / 中键）：插在当前标签页及其已打开的子标签页之后。 */
  | { type: 'open'; route: Route; background: boolean }
  /** ⌘T / 「+」：在末尾新建并切换过去。 */
  | { type: 'new'; route?: Route }
  | { type: 'close'; id: string }
  | { type: 'closeOthers'; id: string }
  | { type: 'closeRight'; id: string }
  | { type: 'activate'; id: string }
  /** ⌘1–⌘8 按位置切换，⌘9 切到最后一个（index = -1）。 */
  | { type: 'activateIndex'; index: number }
  | { type: 'cycle'; delta: 1 | -1 }
  | { type: 'move'; id: string; to: number }
  | { type: 'duplicate'; id: string }
  | { type: 'reopen' };

const HOME: Route = { name: 'new' };
const MAX_HISTORY = 100;
const MAX_CLOSED = 25;

export const currentRoute = (tab: Tab): Route => tab.stack[tab.index]!;
const same = (a: Route, b: Route) => JSON.stringify(a) === JSON.stringify(b);

export function initialTabs(): TabsState {
  return { tabs: [{ id: 't1', stack: [HOME], index: 0 }], activeId: 't1', closed: [], seq: 1 };
}

function updateTab(state: TabsState, id: string | undefined, fn: (tab: Tab) => Tab): TabsState {
  const target = id ?? state.activeId;
  return { ...state, tabs: state.tabs.map((t) => (t.id === target ? fn(t) : t)) };
}

/** 关闭当前标签页后选中谁（Chrome 规则）：同一 opener 打开的右侧兄弟 → opener → 右侧 → 左侧。 */
function nextActive(tabs: Tab[], closedIndex: number, closed: Tab): string {
  if (closed.openerId) {
    const sibling = tabs.slice(closedIndex).find((t) => t.openerId === closed.openerId);
    if (sibling) return sibling.id;
    const opener = tabs.find((t) => t.id === closed.openerId);
    if (opener) return opener.id;
  }
  return (tabs[closedIndex] ?? tabs[closedIndex - 1])!.id;
}

const remember = (closed: ClosedTab[], items: ClosedTab[]) =>
  [...closed, ...items].slice(-MAX_CLOSED);

export function tabsReducer(state: TabsState, action: TabsAction): TabsState {
  switch (action.type) {
    case 'navigate':
      return updateTab(state, action.id, (t) => {
        if (same(currentRoute(t), action.route)) return t;
        const stack = [...t.stack.slice(0, t.index + 1), action.route].slice(-MAX_HISTORY);
        // 在标签页内自行导航后，它与 opener 的关系不再影响关闭后的选中（与 Chrome 一致）
        return { id: t.id, stack, index: stack.length - 1 };
      });
    case 'back':
      return updateTab(state, action.id, (t) => (t.index > 0 ? { ...t, index: t.index - 1 } : t));
    case 'forward':
      return updateTab(state, action.id, (t) =>
        t.index < t.stack.length - 1 ? { ...t, index: t.index + 1 } : t,
      );
    case 'open': {
      const seq = state.seq + 1;
      const tab: Tab = { id: `t${seq}`, stack: [action.route], index: 0, openerId: state.activeId };
      let at = state.tabs.findIndex((t) => t.id === state.activeId) + 1;
      while (state.tabs[at]?.openerId === state.activeId) at++;
      const tabs = [...state.tabs.slice(0, at), tab, ...state.tabs.slice(at)];
      return { ...state, seq, tabs, activeId: action.background ? state.activeId : tab.id };
    }
    case 'new': {
      const seq = state.seq + 1;
      const tab: Tab = { id: `t${seq}`, stack: [action.route ?? HOME], index: 0 };
      return { ...state, seq, tabs: [...state.tabs, tab], activeId: tab.id };
    }
    case 'close': {
      const index = state.tabs.findIndex((t) => t.id === action.id);
      // 最后一个标签页由调用方关闭窗口（Chrome 行为），这里不变
      if (index < 0 || state.tabs.length === 1) return state;
      const closedTab = state.tabs[index]!;
      const tabs = state.tabs.filter((t) => t.id !== action.id);
      const activeId =
        state.activeId === action.id ? nextActive(tabs, index, closedTab) : state.activeId;
      return {
        ...state,
        tabs,
        activeId,
        closed: remember(state.closed, [{ tab: closedTab, index }]),
      };
    }
    case 'closeOthers': {
      const keep = state.tabs.find((t) => t.id === action.id);
      if (!keep) return state;
      const gone = state.tabs
        .map((tab, index) => ({ tab, index }))
        .filter((c) => c.tab.id !== action.id);
      return { ...state, tabs: [keep], activeId: keep.id, closed: remember(state.closed, gone) };
    }
    case 'closeRight': {
      const index = state.tabs.findIndex((t) => t.id === action.id);
      if (index < 0) return state;
      const gone = state.tabs.slice(index + 1).map((tab, i) => ({ tab, index: index + 1 + i }));
      const tabs = state.tabs.slice(0, index + 1);
      const activeId = tabs.some((t) => t.id === state.activeId) ? state.activeId : action.id;
      return { ...state, tabs, activeId, closed: remember(state.closed, gone) };
    }
    case 'activate':
      return state.tabs.some((t) => t.id === action.id) ? { ...state, activeId: action.id } : state;
    case 'activateIndex': {
      const tab = action.index < 0 ? state.tabs.at(-1) : state.tabs[action.index];
      return tab ? { ...state, activeId: tab.id } : state;
    }
    case 'cycle': {
      const n = state.tabs.length;
      const i = state.tabs.findIndex((t) => t.id === state.activeId);
      return { ...state, activeId: state.tabs[(i + action.delta + n) % n]!.id };
    }
    case 'move': {
      const from = state.tabs.findIndex((t) => t.id === action.id);
      if (from < 0) return state;
      const to = Math.max(0, Math.min(state.tabs.length - 1, action.to));
      if (to === from) return state;
      const tabs = [...state.tabs];
      const [tab] = tabs.splice(from, 1);
      tabs.splice(to, 0, tab!);
      return { ...state, tabs };
    }
    case 'duplicate': {
      const index = state.tabs.findIndex((t) => t.id === action.id);
      if (index < 0) return state;
      const seq = state.seq + 1;
      const source = state.tabs[index]!;
      const tab: Tab = {
        id: `t${seq}`,
        stack: source.stack,
        index: source.index,
        openerId: source.id,
      };
      const tabs = [...state.tabs.slice(0, index + 1), tab, ...state.tabs.slice(index + 1)];
      return { ...state, seq, tabs, activeId: tab.id };
    }
    case 'reopen': {
      const last = state.closed.at(-1);
      if (!last) return state;
      const at = Math.min(last.index, state.tabs.length);
      const tabs = [...state.tabs.slice(0, at), last.tab, ...state.tabs.slice(at)];
      return { ...state, tabs, activeId: last.tab.id, closed: state.closed.slice(0, -1) };
    }
  }
}

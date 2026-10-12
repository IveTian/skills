import {
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  IconButton,
  Icons,
  Tooltip,
} from '@diotia/ui';
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useTabs, type Route } from '../nav';
import { useAgent } from '../queries';
import { currentRoute, type Tab } from '../tabs';

/** 拖动超过这个距离（px）才算拖动，否则是点击。 */
const DRAG_THRESHOLD = 4;

type Drag = {
  id: string;
  from: number;
  to: number;
  dx: number;
  startX: number;
  moved: boolean;
  /** 拖动开始时各标签页的左缘与宽度（拖动中 DOM 顺序不变，只用 transform 移动）。 */
  lefts: number[];
  widths: number[];
};

/**
 * 标签栏（交互对照 Chrome）：
 * - 按下即切换；中键或关闭按钮关闭；「+」/ ⌘T 新建；右键菜单（新标签页、复制、关闭、关闭其他、关闭右侧、重新打开）。
 * - 拖动排序：被拖的标签页跟随指针，其余标签页让位并过渡；松开后落位。
 * - 标签页等分可用宽度（有上限与下限）；用鼠标关闭后宽度冻结，直到指针离开标签栏，
 *   保证下一个标签页的关闭按钮正好落在指针下（可连续点击关闭）。
 */
export function TabStrip() {
  const { tabs, activeId, dispatch, close, canReopen } = useTabs();
  const listRef = useRef<HTMLDivElement>(null);
  const [frozen, setFrozen] = useState<number | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [settling, setSettling] = useState(false);

  const closeWithMouse = (tab: Tab, el: HTMLElement | null) => {
    if (el) setFrozen(el.getBoundingClientRect().width);
    close(tab.id);
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>, tab: Tab, index: number) => {
    if (e.button !== 0) return;
    dispatch({ type: 'activate', id: tab.id });
    const items = [...(listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])];
    setDrag({
      id: tab.id,
      from: index,
      to: index,
      dx: 0,
      startX: e.clientX,
      moved: false,
      lefts: items.map((el) => el.getBoundingClientRect().left),
      widths: items.map((el) => el.getBoundingClientRect().width),
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!drag) return;
    const raw = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(raw) < DRAG_THRESHOLD) return;
    const { lefts, widths, from } = drag;
    const last = lefts.length - 1;
    // 不拖出标签栏两端
    const min = lefts[0]! - lefts[from]!;
    const max = lefts[last]! + widths[last]! - (lefts[from]! + widths[from]!);
    const dx = Math.max(min, Math.min(max, raw));
    const center = lefts[from]! + dx + widths[from]! / 2;
    let to = lefts.findIndex((l, i) => center < l + widths[i]!);
    if (to < 0) to = last;
    setDrag({ ...drag, dx, to, moved: true });
  };

  const onPointerUp = () => {
    if (!drag) return;
    if (drag.moved && drag.to !== drag.from) {
      // 落位时先关掉让位过渡，避免 DOM 重排后各标签页从旧偏移动画回来
      setSettling(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setSettling(false)));
      dispatch({ type: 'move', id: drag.id, to: drag.to });
    }
    setDrag(null);
  };

  /** 拖动中各标签页的位移：被拖的跟随指针，经过的标签页让出被拖标签页的宽度。 */
  const offset = (index: number): number => {
    if (!drag?.moved) return 0;
    if (index === drag.from) return drag.dx;
    const gap = drag.widths.length > 1 ? drag.lefts[1]! - drag.lefts[0]! - drag.widths[0]! : 0;
    const shift = drag.widths[drag.from]! + gap;
    if (drag.from < drag.to && index > drag.from && index <= drag.to) return -shift;
    if (drag.to < drag.from && index >= drag.to && index < drag.from) return shift;
    return 0;
  };

  // 标签页开了尺寸容器（容器查询），对外内容宽度为 0，列表不能按内容自动定宽：
  // 由标签页数量给出列表的基准宽度（见 styles.css 的 .tabstrip__list）。
  const listStyle = {
    '--tab-count': tabs.length,
    ...(frozen === null ? {} : { '--tab-frozen-width': `${frozen}px` }),
  } as CSSProperties;

  return (
    <div
      className={`tabstrip ui-drag ${settling ? 'tabstrip--settling' : ''}`}
      onPointerLeave={() => setFrozen(null)}
    >
      <div
        ref={listRef}
        className={`tabstrip__list ${frozen === null ? '' : 'tabstrip__list--frozen'}`}
        style={listStyle}
        role="tablist"
        aria-label="标签页"
      >
        {tabs.map((tab, index) => (
          <TabItem
            key={tab.id}
            tab={tab}
            index={index}
            count={tabs.length}
            active={tab.id === activeId}
            dragging={drag?.moved === true && drag.id === tab.id}
            offset={offset(index)}
            canReopen={canReopen}
            onPointerDown={(e) => onPointerDown(e, tab, index)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClose={(el) => closeWithMouse(tab, el)}
          />
        ))}
      </div>
      <IconButton
        label="新标签页"
        shortcut="⌘T"
        icon={<Icons.Plus />}
        onClick={() => dispatch({ type: 'new' })}
      />
    </div>
  );
}

function TabItem({
  tab,
  index,
  count,
  active,
  dragging,
  offset,
  canReopen,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onClose,
}: {
  tab: Tab;
  index: number;
  count: number;
  active: boolean;
  dragging: boolean;
  offset: number;
  canReopen: boolean;
  onPointerDown: (e: PointerEvent<HTMLElement>) => void;
  onPointerMove: (e: PointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onClose: (el: HTMLElement | null) => void;
}) {
  const { dispatch, close } = useTabs();
  const route = currentRoute(tab);
  const { title, icon } = useTabLabel(route);
  const ref = useRef<HTMLDivElement>(null);
  const style =
    offset === 0 ? undefined : ({ transform: `translateX(${offset}px)` } as CSSProperties);

  return (
    <ContextMenu>
      <Tooltip side="bottom" content={title}>
        <ContextMenuTrigger
          ref={ref}
          className={`tab ${dragging ? 'tab--dragging' : ''}`}
          style={style}
          role="tab"
          aria-selected={active}
          tabIndex={active ? 0 : -1}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          // 中键关闭（与 Chrome 一致）；按下中键时阻止自动滚动
          onMouseDown={(e) => e.button === 1 && e.preventDefault()}
          onAuxClick={(e) => e.button === 1 && close(tab.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') dispatch({ type: 'activate', id: tab.id });
          }}
        >
          <span className="tab__icon">{icon}</span>
          <span className="tab__title">{title}</span>
          <Button
            variant="icon"
            className="tab__close"
            aria-label="关闭标签页"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onClose(ref.current)}
          >
            <Icons.X />
          </Button>
        </ContextMenuTrigger>
      </Tooltip>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => dispatch({ type: 'new' })}>新标签页</ContextMenuItem>
        <ContextMenuItem onClick={() => dispatch({ type: 'duplicate', id: tab.id })}>
          复制
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => close(tab.id)}>关闭</ContextMenuItem>
        <ContextMenuItem
          disabled={count === 1}
          onClick={() => dispatch({ type: 'closeOthers', id: tab.id })}
        >
          关闭其他标签页
        </ContextMenuItem>
        <ContextMenuItem
          disabled={index === count - 1}
          onClick={() => dispatch({ type: 'closeRight', id: tab.id })}
        >
          关闭右侧标签页
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled={!canReopen} onClick={() => dispatch({ type: 'reopen' })}>
          重新打开关闭的标签页
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

/** 标签页标题与图标：按当前路由显示（Agent 页显示 Agent 名称）。 */
function useTabLabel(route: Route) {
  const agent = useAgent(route.name === 'agent' ? route.agentId : '');
  if (route.name === 'new') return { title: '新建', icon: <Icons.SquarePen /> };
  if (route.name === 'activity') return { title: '活动', icon: <Icons.Inbox /> };
  return { title: agent.data?.name ?? 'Agent', icon: <Icons.Bot /> };
}

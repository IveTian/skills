import { Field } from '@base-ui/react/field';
import { Input } from '@base-ui/react/input';
import { Popover } from '@base-ui/react/popover';
import { Slider } from '@base-ui/react/slider';
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { clamp01, hexToHsv, hsvToHex, normalizeHex, percent, type Hsv } from './color';
import { cx } from './cx';

/**
 * 颜色选择器（2026-10-12 产品负责人批准新增，ADR 0019）：Base UI Popover + Slider 的组合。
 * 一行内左侧是色块按钮、右侧是 HEX 输入框；点色块弹出「饱和度 / 亮度」面板与色相滑杆。
 * - 拖动时只更新预览，松开（或键盘调整、HEX 失焦 / 回车）时才调用 onChange，避免频繁保存；
 * - HEX 可省略 #，统一为小写 #rrggbb；格式不对时恢复原值并调用 onInvalid；
 * - 面板支持方向键（Shift 为 10% 步长），色相滑杆由 Base UI Slider 提供键盘与读屏支持。
 * 不使用浏览器原生 <input type="color">。
 */
export function ColorPicker({
  label,
  value,
  onChange,
  onInvalid,
  disabled,
  className,
}: {
  label: string;
  /** #rrggbb */
  value: string;
  onChange: (hex: string) => void;
  onInvalid?: (input: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(value));
  const [text, setText] = useState(value);
  const dragging = useRef(false);
  const preview = hsvToHex(hsv);

  // 外部值变化（保存成功、他人修改）时同步；与当前预览相同则保留色相（黑 / 白 / 灰没有色相）。
  useEffect(() => {
    setText(value);
    if (!dragging.current) setHsv((cur) => (hsvToHex(cur) === value ? cur : hexToHsv(value)));
  }, [value]);

  const commit = (next: Hsv) => {
    const hex = hsvToHex(next);
    setText(hex);
    if (hex !== value) onChange(hex);
  };

  const commitText = () => {
    const hex = normalizeHex(text);
    if (!hex) {
      if (text.trim() !== value) onInvalid?.(text);
      setText(value);
      return;
    }
    setText(hex);
    setHsv(hexToHsv(hex));
    if (hex !== value) onChange(hex);
  };

  const fromPointer = (el: HTMLElement, clientX: number, clientY: number): Hsv => {
    const r = el.getBoundingClientRect();
    return {
      h: hsv.h,
      s: clamp01((clientX - r.left) / r.width),
      v: clamp01(1 - (clientY - r.top) / r.height),
    };
  };

  const onAreaKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 0.1 : 0.01;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    };
    const d = delta[e.key];
    if (!d) return;
    e.preventDefault();
    const next = { h: hsv.h, s: clamp01(hsv.s + d[0]), v: clamp01(hsv.v + d[1]) };
    setHsv(next);
    commit(next);
  };

  const hueColor = hsvToHex({ h: hsv.h, s: 1, v: 1 });
  const areaX = percent(hsv.s);
  const areaY = percent(1 - hsv.v);

  return (
    <div
      className={cx('ui-color-picker', className)}
      style={{ '--color-picker-value': preview } as CSSProperties}
    >
      <Popover.Root>
        <Popover.Trigger
          className="ui-color-picker__swatch"
          aria-label={`${label}：${value}，打开颜色选择器`}
          disabled={disabled}
        />
        <Popover.Portal>
          <Popover.Positioner side="bottom" align="start" sideOffset={6}>
            <Popover.Popup
              className="ui-color-picker__popup"
              aria-label={label}
              style={
                {
                  '--color-picker-hue-color': hueColor,
                  '--color-picker-x': areaX,
                  '--color-picker-y': areaY,
                } as CSSProperties
              }
            >
              <div
                className="ui-color-picker__area"
                role="slider"
                tabIndex={0}
                aria-label={`${label}：饱和度与亮度`}
                aria-valuetext={`饱和度 ${Math.round(hsv.s * 100)}%，亮度 ${Math.round(hsv.v * 100)}%`}
                aria-valuenow={Math.round(hsv.s * 100)}
                onKeyDown={onAreaKey}
                onPointerDown={(e) => {
                  dragging.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setHsv(fromPointer(e.currentTarget, e.clientX, e.clientY));
                }}
                onPointerMove={(e) => {
                  if (dragging.current) setHsv(fromPointer(e.currentTarget, e.clientX, e.clientY));
                }}
                onPointerUp={(e) => {
                  if (!dragging.current) return;
                  dragging.current = false;
                  const next = fromPointer(e.currentTarget, e.clientX, e.clientY);
                  setHsv(next);
                  commit(next);
                }}
              >
                <span className="ui-color-picker__area-thumb" />
              </div>
              <Slider.Root
                className="ui-color-picker__hue"
                min={0}
                max={359}
                value={Math.round(hsv.h)}
                onValueChange={(h) => setHsv((cur) => ({ ...cur, h }))}
                onValueCommitted={(h) => commit({ ...hsv, h })}
              >
                <Slider.Control className="ui-color-picker__hue-control">
                  <Slider.Track className="ui-color-picker__hue-track">
                    <Slider.Thumb
                      className="ui-color-picker__hue-thumb"
                      getAriaLabel={() => `${label}：色相`}
                    />
                  </Slider.Track>
                </Slider.Control>
              </Slider.Root>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      <Field.Root className="ui-color-picker__field" disabled={disabled}>
        <Field.Label className="ui-sr-only">{label}</Field.Label>
        <Input
          className="ui-field__control ui-color-picker__input"
          value={text}
          maxLength={7}
          spellCheck={false}
          autoComplete="off"
          onValueChange={setText}
          onBlur={commitText}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitText();
            }
          }}
        />
      </Field.Root>
    </div>
  );
}

import * as z from 'zod';

/** 窗口位置与大小的持久化（纯函数部分，便于单元测试）。 */
export type Rect = { x: number; y: number; width: number; height: number };
export type WindowState = Rect & { maximized: boolean };

export const DEFAULT_SIZE = { width: 1280, height: 820 };
export const MIN_SIZE = { width: 900, height: 600 };

const Saved = z.object({
  x: z.number().int(),
  y: z.number().int(),
  width: z.number().int().min(MIN_SIZE.width).max(10_000),
  height: z.number().int().min(MIN_SIZE.height).max(10_000),
  maximized: z.boolean().default(false),
});

/**
 * 校验保存的窗口状态：格式非法、尺寸异常或窗口不在任何显示器可见范围内（例如外接显示器已拔掉）时
 * 返回 null，由调用方使用默认尺寸居中。窗口至少要有 100×50 的区域落在某个显示器工作区内。
 */
export function sanitizeWindowState(raw: unknown, workAreas: Rect[]): WindowState | null {
  const parsed = Saved.safeParse(raw);
  if (!parsed.success) return null;
  const s = parsed.data;
  const visible = workAreas.some((a) => {
    const w = Math.min(s.x + s.width, a.x + a.width) - Math.max(s.x, a.x);
    const h = Math.min(s.y + s.height, a.y + a.height) - Math.max(s.y, a.y);
    return w >= 100 && h >= 50;
  });
  return visible ? s : null;
}

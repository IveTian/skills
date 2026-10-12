import { describe, expect, it } from 'vitest';
import { hexToHsv, hsvToHex, normalizeHex } from './color';

describe('ColorPicker 颜色换算', () => {
  it('hex ↔ hsv 往返一致', () => {
    for (const hex of ['#000000', '#ffffff', '#ff0000', '#00aa88', '#6d78d5', '#1b1d22']) {
      expect(hsvToHex(hexToHsv(hex))).toBe(hex);
    }
    expect(hexToHsv('#ff0000')).toEqual({ h: 0, s: 1, v: 1 });
    expect(hexToHsv('#0000ff').h).toBe(240);
  });
  it('规范化：可省略 #、统一小写；其他格式拒绝', () => {
    expect(normalizeHex('ABCDEF')).toBe('#abcdef');
    expect(normalizeHex(' #12ab9F ')).toBe('#12ab9f');
    expect(normalizeHex('#abc')).toBeNull();
    expect(normalizeHex('red')).toBeNull();
  });
});

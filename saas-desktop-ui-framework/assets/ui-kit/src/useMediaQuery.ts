import { useMediaQuery as baseUseMediaQuery } from '@base-ui/react/unstable-use-media-query';

/** Base UI 的媒体查询 hook（unstable 导出；升级 Base UI 时复查）。 */
export function useMediaQuery(query: string): boolean {
  return baseUseMediaQuery(query, {});
}

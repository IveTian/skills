import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';

/** 分段切换（Base UI ToggleGroup，单选；再次点击当前项不会取消选中）。 */
export function SegmentedControl<V extends string>({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: V;
  onValueChange: (value: V) => void;
  options: readonly { value: V; label: string }[];
}) {
  return (
    <ToggleGroup<V>
      aria-label={label}
      value={[value]}
      onValueChange={(next) => {
        const v = next[0];
        if (v && v !== value) onValueChange(v);
      }}
      className="ui-segmented"
    >
      {options.map((o) => (
        <Toggle<V> key={o.value} value={o.value} className="ui-segmented__item">
          {o.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}

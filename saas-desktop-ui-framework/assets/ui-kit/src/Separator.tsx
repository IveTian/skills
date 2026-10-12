import { Separator as BaseSeparator } from '@base-ui/react/separator';

export function Separator({
  orientation = 'horizontal',
}: {
  orientation?: 'horizontal' | 'vertical';
}) {
  return <BaseSeparator orientation={orientation} className="ui-separator" />;
}

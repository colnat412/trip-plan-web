import type { AppFilterChipOption } from '@/base/components/ui';

export function getDestinationFilterOptions(
  destinations: string[],
  selected: string,
): AppFilterChipOption<string>[] {
  const unique = [...new Set(destinations.filter(value => value.trim()))];
  const visible = unique.slice(0, 5);
  if (selected && !visible.includes(selected)) {
    if (visible.length === 5) visible.pop();
    visible.push(selected);
  }
  return visible.map(value => {
    const shortName = value.split(',')[0].trim() || value;
    const sameName = unique.filter(item => item.split(',')[0].trim() === shortName);
    return {
      value,
      label: sameName.length > 1 ? value.split(',').slice(0, 2).map(part => part.trim()).join(', ') : shortName,
      title: value,
    };
  });
}

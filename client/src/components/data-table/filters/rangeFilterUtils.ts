export function publishRangeValue<TRange extends Record<string, unknown>>(
  range: TRange,
  onChange: (next: TRange | undefined) => void
) {
  const hasValue = Object.values(range).some((value) => value !== undefined && value !== '');
  onChange(hasValue ? range : undefined);
}

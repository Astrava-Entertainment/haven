export function furnitureToColor(furniture?: string): string | undefined {
  if (!furniture) return;
  switch (furniture) {
    case 'red':
      return '#dc2626';
    case 'green':
      return '#16a34a';
    case 'blue':
      return '#2563eb';
    case 'orange':
      return '#f97316';
    default:
      return '#3f3f46';
  }
}

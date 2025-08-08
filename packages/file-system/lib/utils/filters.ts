import ExampleFS from '@haven/examples/example1.havenfs';

function searchDeep(fs: HavenFSItem[], parentId: string, query: string) {
  const lowerQuery = query.toLowerCase();
  const results: HavenFSItem[] = [];

  function traverse(id: string) {
    const children = fs.filter((item) => item.parent === id);
    for (const item of children) {
      if (item.name.toLowerCase().includes(lowerQuery)) {
        results.push(item);
      }
      if (item.type === 'directory') {
        traverse(item.id);
      }
    }
  }

  traverse(parentId);
  return results;
}

export function searchDeepTerm(fs: HavenFSItem[], parentId: string, term: string) {
  if (!term.trim()) return null;
  return searchDeep(fs, parentId, term);
}

export function searchDeepTags(items: HavenFSItem[], tagsString: string) {
  const tags = tagsString
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag !== '');
  if (!tags.length) return null;

  return items.filter((item) => {
    if (!item.tags || !Array.isArray(item.tags)) return false;
    const itemTags = item.tags.map((tag) => tag.toLowerCase());
    return tags.every((tag) => itemTags.includes(tag));
  });
}

export function searchDeepType(items: HavenFSItem[], type: HavenFSEntryType) {
  if (!type || type === 'none') return null;
  console.log(items);
  return items.filter((item) => {
    return item.type === type;
  });
}

// TODO: Use Luxon or similar library for date parsing
function parseHavenDate(str?: string): Date | null {
  if (!str) return null;
  const year = str.slice(0, 4);
  const month = str.slice(4, 6);
  const day = str.slice(6, 8);
  const hour = str.slice(9, 11) || '00';
  const minute = str.slice(11, 13) || '00';

  const dateStr = `${year}-${month}-${day}T${hour}:${minute}`;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

export function sortByDate(items: HavenFSItem[], direction: 'asc' | 'desc' = 'desc') {
  return [...items].sort((a, b) => {
    const dateA = parseHavenDate(a.metadata?.modified ?? a.metadata?.created);
    const dateB = parseHavenDate(b.metadata?.modified ?? b.metadata?.created);

    if (!dateA && !dateB) return 0;
    if (!dateA) return direction === 'asc' ? 1 : -1;
    if (!dateB) return direction === 'asc' ? -1 : 1;

    return direction === 'asc'
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });
}

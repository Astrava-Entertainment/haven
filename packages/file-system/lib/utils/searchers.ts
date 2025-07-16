import {havenfsExample} from '../constants/examples.ts';

export function searchDeep(parentId: string, query: string) {
  const lowerQuery = query.toLowerCase();

  const results: HavenFSItem[] = [];

  function traverse(id: string) {
    const children = havenfsExample.filter(item => item.parent === id);
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

export function searchDeepTerm(parentId: string, term: string) {
  if (!term.trim()) return null;
  return searchDeep(parentId, term);
}

export function searchDeepTags(items: HavenFSItem[], tagsString: string) {
  const tags = tagsString
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag !== '');
  if (!tags.length) return null;

  return items.filter(item => {
    if (!item.tags || !Array.isArray(item.tags)) return false;
    const itemTags = item.tags.map(tag => tag.toLowerCase());
    return tags.every(tag => itemTags.includes(tag));
  });
}

export function searchDeepType(items: HavenFSItem[], type: HavenFSEntryType) {
  if (!type || type === 'none') return null;
  return items.filter((item) => {
    return item.type === type
  });
}

export function searchDeepDate(items: HavenFSItem[], from?: Date, to?: Date) {
  if (!from && !to) return null;
  return items.filter(item => {
    const itemDate = new Date(item.modified ?? item.created);
    console.log("item.name: ", item.name);
    console.log("item.modified: ", item.modified);
    console.log("item.created: ", item.created);

    if (from && itemDate < from) return false;
    return !(to && itemDate > to);
  });
}

import { computed, type ComputedRef } from 'vue';

export function useDirectoryContents(havenfsExample: HavenFSItem[], currentDirId: Ref<string>): ComputedRef<HavenFSItem[]> {
  return computed(() => {
    const base = havenfsExample.filter(item => item.parent === currentDirId.value);

    if (currentDirId.value !== 'root') {
      const currentDir = havenfsExample.find(item => item.id === currentDirId.value);
      return [
        {
          id: '..',
          type: 'directory',
          name: '..',
          parent: currentDir?.parent ?? 'root',
          isBackLink: true,
        },
        ...base,
      ];
    }

    return base;
  });
}

import { computed, type ComputedRef } from 'vue';

export function useDirectoryContents(havenfsExample: HavenFSItem[], currentDirId: Ref<string>): ComputedRef<HavenFSItem[]> {
  return computed(() => {
    const base = havenfsExample.filter(item => item.parent === currentDirId.value);

    // * Uncomment this to add '/..' it has some bugs
    // if (currentDirId.value !== 'root') {
      // const currentDir = havenfsExample.find(item => item.id === currentDirId.value);
      // return [
      //   {
      //     id: 'root',
      //     type: 'directory',
      //     name: 'root',
      //     parent: currentDir?.parent ?? 'root',
      //   },
      //   ...base,
      // ];
    // }

    return base;
  });
}

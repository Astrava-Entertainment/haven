import { computed, type ComputedRef, type Ref } from 'vue';

export function useDirectoryContents(
  havenfsExample: Ref<HavenFSItem[]>,
  currentDirId: Ref<string>
): ComputedRef<HavenFSItem[]> {
  return computed(() => {
    return havenfsExample.value.filter(item => item.parent === currentDirId.value);
  });
}

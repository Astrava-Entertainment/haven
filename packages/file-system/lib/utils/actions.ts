import { useDirectoryStore } from '@/store/useDirectoryStore';

export const onAction = async (action: string, file: HavenFSItem) => {
  const dirStore = useDirectoryStore();

  // Ensure the default directory and .havensync file are initialised
  await dirStore.init();

  switch (action.toLowerCase()) {
    case 'download':
      let havenData: string = "";
      havenData = await dirStore.fileExists(".havensync");
      console.log("Exist:" + havenData)
      break;

    default:
      console.log(`Action "${action}" not implemented`);
      break;
  }
};

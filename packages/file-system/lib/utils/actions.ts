import {postDownloadFiles} from '@haven/core/api/downloads.ts'

export const onAction = async (action: string, file: HavenFSItem) => {
  switch (action.toLowerCase()) {
    case 'download':
      await postDownloadFiles({name: file.name, id: file.id})
      break;
    default:
      console.log(`Action "${action}" not implemented`);
      break;
  }
}

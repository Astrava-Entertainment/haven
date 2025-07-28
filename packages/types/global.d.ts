import {IHavenFilePrimitive} from './filesystem';

export {};

declare global {

  type Page = 'FileSystem' | 'Customization';

  interface ISorterState {
    sortType: ISortType;
    direction: 'asc' | 'desc';
  }

  interface IHavenDirectory extends IHavenFilePrimitive {
    id: string;
    name: string;
    children: (IHavenFile | IHavenDirectory)[];
    isBucketRoot?: boolean;
  }

  interface IHavenFile extends IHavenFilePrimitive {
    id: string;
    name: string;
    url: string;
    loadTime: number;
    cached: boolean;
    extension?: string;
  }

  interface IAssociation {
    name: string;
    pattern: string;
    icon: string;
    color: string;
    priority: number;
  }

  type IHavenTreeNode = IHavenFile | IHavenDirectory
}

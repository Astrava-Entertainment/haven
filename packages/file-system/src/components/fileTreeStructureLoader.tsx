import { useEffect } from 'react';
import { HavenFile } from '@haven/core/shared';
import { loadJson } from '@haven/file-system/store/slices/fileTreeSlice.ts';
import { useFileDispatch } from '../hooks';

interface FileTreeLoaderProps {
  structure: HavenFile[];
}

export const FileTreeStructureLoader: React.FC<FileTreeLoaderProps> = ({ structure }) => {
  const dispatch = useFileDispatch();

  useEffect(() => {
    dispatch(loadJson(structure));
  }, [dispatch, structure]);

  return null;
};

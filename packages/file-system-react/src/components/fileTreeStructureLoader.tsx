import React, { useEffect } from 'react';
import { useFileDispatch } from '../hooks';
import { loadJson } from '@haven/file-system/store/slices/fileTreeSlice.ts';
import { HavenFile } from '@haven/core/shared';

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

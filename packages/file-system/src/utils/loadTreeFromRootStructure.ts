import { HydrateTree } from '@haven/file-system';

import projectA from '@haven/examples/fs/project_a/structure.json';
import projectB from '@haven/examples/fs/project_b/structure.json';
import projectC from '@haven/examples/fs/project_c/structure.json';
import projectZ from '@haven/examples/fs/project_z/structure.json';

const bucketsData = [
  { name: 'project_a', data: projectA },
  { name: 'project_b', data: projectB },
  { name: 'project_c', data: projectC },
  { name: 'project_z', data: projectZ },
];

export const bucketStructure = bucketsData.map(({ name, data }) => ({
  id: name,
  name,
  type: 'directory',
  isBucketRoot: true,
  children: data,
})).map(HydrateTree);

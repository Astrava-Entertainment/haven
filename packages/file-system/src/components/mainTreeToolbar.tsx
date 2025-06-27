import React from 'react';

interface IMainTreeToolbar {
  historyPath: IHavenTreeNode[][]
}

export const MainTreeToolbar: React.FC<IMainTreeToolbar> = (props) => {
  const {historyPath} = props;

  if (!historyPath) return;

  return (
    // breadcrumbs
    <div className="flex flex-row">
      {/*{historyPath.map((node, index) => (*/}
      {/*  <p key={index}>{node.name}</p>*/}
      {/*))}*/}
    </div>
  )
}

import React from "react";
// import { IHavenDirectory } from "../common/interfaces.ts";
import { FileCard } from "./fileCard.tsx";
import { HavenFile } from "@haven/core/shared";

interface DirectoryGridView {
  tree: (IHavenDirectory | HavenFile)[];
  onDoubleClick: (node: IHavenDirectory | HavenFile) => void;
  onClick: (node: IHavenDirectory | HavenFile | null) => void;
}

type Props = DirectoryGridView;


export const TreeGridView: React.FC<Props> = (props) => {
  const { tree, onDoubleClick, onClick } = props;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {tree.map((node) => (
          <FileCard
            node={node}
            onDoubleClick={onDoubleClick}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};

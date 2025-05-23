import { EHavenFileActions } from "../common";
import { EHavenFileContextActions } from "../common/type";
import { HavenFileNode } from "../utils/directory";

export const getContextActions = (
  node: HavenFileNode,
  clipboard: HavenFileNode | null,
  onAction: (actionId: EHavenFileActions, node: HavenFileNode) => void
): EHavenFileContextActions[] => [
    {
      id: EHavenFileActions.Cut,
      label: "Cut",
      handler: () => onAction(EHavenFileActions.Cut, node),
    },
    {
      id: EHavenFileActions.Copy,
      label: "Copy",
      handler: () => onAction(EHavenFileActions.Copy, node),
    },
    {
      id: EHavenFileActions.Paste,
      label: "Paste",
      handler: () => onAction(EHavenFileActions.Paste, node),
      disabled: !clipboard,
    },
    {
      id: EHavenFileActions.Tag,
      label: "Tag",
      handler: () => onAction(EHavenFileActions.Tag, node),
    },
    {
      id: EHavenFileActions.Open,
      label: "Open",
      handler: () => onAction(EHavenFileActions.Open, node),
    },
    {
      id: EHavenFileActions.Undo,
      label: "Undo",
      handler: () => onAction(EHavenFileActions.Undo, node),
    },
    {
      id: EHavenFileActions.Rename,
      label: "Rename",
      handler: () => onAction(EHavenFileActions.Rename, node),
    },
    {
      id: EHavenFileActions.Delete,
      label: "Delete",
      handler: () => onAction(EHavenFileActions.Delete, node),
    },
  ];

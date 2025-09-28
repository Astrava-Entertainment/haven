import * as PhosphorIcons from '@phosphor-icons/vue';
import associationFile from '@haven/examples/file-icons.toml'

interface IconWithColor {
  icon: any
  color: string
}

const associations: IAssociation[] = associationFile.associations ?? [];
const defaultIcon = "PhFileX";
const defaultColor = "#6b717f";

export function getIcon(iconName: string) {
  return PhosphorIcons[iconName as keyof typeof PhosphorIcons] ?? PhosphorIcons.PhFileDashed;
}

export function getIconForFilename(filename: string): IconWithColor {
  for (const assoc of associations) {
    const regex = new RegExp(assoc.pattern);
    if (regex.test(filename)) {
      return {
        icon: getIcon(assoc.icon),
        color: assoc.color ?? defaultColor,
      };
    }
  }

  return {
    icon: getIcon(defaultIcon),
    color: defaultColor,
  };
}

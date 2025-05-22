function toCamelCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[_-\s]+(\w)/g, (_, c) => c.toUpperCase());
}

function toPascalCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/(^\w|[_-\s]+(\w))/g, (_, first, group) =>
      (first || group).toUpperCase()
    );
}

function toSnakeCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

function toCustomCase(input: string): string {
  return input;
}

const setFileStandardTransformMap: Map<EFileStandard, (name: string) => string> = new Map([
  [EFileStandard.Camel, toCamelCase],
  [EFileStandard.Pascal, toPascalCase],
  [EFileStandard.Snake, toSnakeCase],
  [EFileStandard.Custom, toCustomCase],
]);

function getCamelCaseRegex(): RegExp {
  // example: myFileName
  return /^[a-z]+([A-Z][a-z0-9]*)*$/;
}

function getPascalCaseRegex(): RegExp {
  // example: MyFileName
  return /^[A-Z][a-z0-9]*([A-Z][a-z0-9]*)*$/;
}

function getSnakeCaseRegex(): RegExp {
  // example: my_file_name
  return /^[a-z]+(_[a-z0-9]+)*$/;
}

function getCustomRegex(): RegExp {
  return /^.*$/;
}


const getFileStandardRegexMap: Map<EFileStandard, RegExp> = new Map([
  [EFileStandard.Camel, getCamelCaseRegex()],
  [EFileStandard.Pascal, getPascalCaseRegex()],
  [EFileStandard.Snake, getSnakeCaseRegex()],
  [EFileStandard.Custom, getCustomRegex()],
]);

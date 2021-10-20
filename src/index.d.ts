/**
 * Checks whether the given string represents file-system permission of octal
 * notation.
 * */
declare function isOctal(str: string): boolean;

/**
 * Checks whether the given string represents file-system permission of symbolic
 * notation.
 * */
declare function isSymbolic(str: string): boolean;

/**
 * Converts file-system permission from symbolic to octal notation and vice
 * versa.
 * */
declare function convert(str: string): string;

type RWX_OBJ = {
  read: boolean;
  write: boolean;
  execute: boolean;
};

type FileTypes =
  | "Directory"
  | "Symbolic Link"
  | "Block Device"
  | "Character Device"
  | "Socket"
  | "Named Pipe"
  | "Unknown";

interface AnalyzeResult {
  fileType: FileTypes;
  symbolic: string;
  octal: string;
  owner: RWX_OBJ;
  group: RWX_OBJ;
  other: RWX_OBJ;
}

/**
 * Analyzes file-system permission string and returns detailed results.
 * */
declare function analyze(str: string): AnalyzeResult;

export { isSymbolic, isOctal, convert, analyze };

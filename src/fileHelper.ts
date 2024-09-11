import fs, { lstat } from "fs";
import path from "path";

export function makeDir(directoryName: string) {
  const rootDir = process.cwd();
  const filePath = path.join(rootDir, directoryName);
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
  return filePath;
}

export function createFile(
  fileName: string,
  fileExtension: string,
  dirPath: string,
  fileContent: string,
) {
  const totalPath = path.join(dirPath, `${fileName}.${fileExtension}`);

  fs.writeFileSync(totalPath, fileContent);
}
export function extractCodeBlock(message: string) {
  const startIndex = message.indexOf("```");
  const endIndex = message.lastIndexOf("```");

  if (startIndex === -1 || endIndex === -1 || startIndex === endIndex) {
    return "";
  }

  const newLineIndex = message.indexOf("\n", startIndex);
  const codeStartIndex =
    newLineIndex === -1 ? startIndex + 3 : newLineIndex + 1;

  return message.slice(codeStartIndex, endIndex).trim();
}

import fs from "fs";
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

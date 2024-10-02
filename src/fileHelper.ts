import fs from "fs";
import path from "path";
import os from "os";
import toml from "toml";
import chalk from "chalk";

// helper functions to perform file modifications and creation

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

// this is a helper functioon to extract the code block from the response sent by groq
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

// helper function to load and parse a TOML config file
export function loadTomlConfig(
  configFileName: string = "dialectMorph-config.toml",
) {
  try {
    const homeDir = os.homedir();
    const configFilePath = path.resolve(homeDir, configFileName);

    if (!fs.existsSync(configFilePath)) {
      console.log(chalk.yellowBright("No config file found"));
      return {};
    }
    const fileContents = fs.readFileSync(configFilePath, "utf-8");
    // parse contents of the config file
    const config = toml.parse(fileContents);
    console.log(
      chalk.greenBright(`Loaded configuration from ${configFilePath}`),
    );
    return config;
  } catch (e) {
    throw e;
  }
}

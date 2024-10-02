import fs from "fs";
import path from "path";
import os from "os";
import toml from "toml";
import chalk from "chalk";

// a helper function to load and parse a TOML config file
export function loadTomlConfig(configFileName: string = "dialectMorph-config.toml") {
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
    console.log(chalk.greenBright(`Loaded configuration from ${configFilePath}`));
    return config;
  } catch (e) {
    throw e;
  }}
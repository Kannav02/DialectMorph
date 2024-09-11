#! /usr/bin/env bun

import figlet, { textSync } from "figlet";
import { Command } from "commander";
import fs, { mkdir } from "fs";
import path from "path";
import { createFile, makeDir } from "./fileHelper";
import { GroqClient } from "./LLMHandler";
import { extractCodeBlock } from "./fileHelper";

const program = new Command();
console.log(textSync("DialectMorph"));

const supportedLangMap = new Map([
  ["python", "py"],
  ["java", "java"],
  ["c++", "cpp"],
  ["javascript", "js"],
]);

program
  .version("1.0.0")
  .description(
    `This is a tool designed to transpile code from one language to the other, the options that this support right now is just the following ones
    1. Java
    2. JavaScript
    3. C++
    4. Python`,
  )
  .arguments("<files...>")
  .option("-o,--output <options>", "Output A Given File To The Given Language")
  .action(async (files: string[], options: string[] | any) => {
    try {
      const outputLanguage: string = options.output as string;
      const keysArr = [...supportedLangMap.keys()];
      if (!keysArr.includes(outputLanguage.toLowerCase())) {
        console.error(`The output language is not supported by the tool,
please choose from the following options
1. Java
2. JavaScript
3. C++
4. Python`);
        process.exit(1);
      }
      const directoryPath = makeDir("transpiledFiles");
      const groqClient = GroqClient.getInstance();
      files.forEach(async (file) => {
        const filePath = path.resolve(file);
        if (!fs.existsSync(filePath)) {
          console.error("The File Doesn't Exists");
          process.exit(1);
        }
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const fileName = path.basename(file).split(".")[0];
        const fileExtension = path.basename(file).split(".")[1];

        const message = await groqClient.getGroqChatCompletion(
          fileContents,
          fileExtension,
          outputLanguage,
        );
        const finalMessage = message as string;
        const code = extractCodeBlock(finalMessage);

        createFile(fileName, outputLanguage, directoryPath, code);
      });
      console.log(
        `\nThe files have been created in the transpiledFiles folder under the root directory`,
      );
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  })
  .parse(Bun.argv);

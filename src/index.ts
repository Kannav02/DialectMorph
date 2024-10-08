#!/usr/bin/env bun

// imports
import chalk from "chalk";
import { textSync } from "figlet";
import program from "./config";
import fs from "fs";
import path from "path";
import { createFile, makeDir } from "./fileHelper";
import CompositeAIClient from "./CompositeClass";
import { extractCodeBlock } from "./fileHelper";
import { loadTomlConfigFile } from "./fileHelper";
import AIClient from "./LLMHandler";
import ora from "ora";

console.log(chalk.yellow(textSync("DialectMorph")));

// map to store supported languages
const supportedLangMap = new Map([
  ["python", "py"],
  ["java", "java"],
  ["c++", "cpp"],
  ["javascript", "js"],
]);

// Commander.js instance
program
  // finally after getting all the files and argumnets, this is the main action function that will run which will perform the function intended for the CLI
  .action(async (files: string[], options: string[] | any) => {
    let config = {};
    let client: AIClient;
    try {
      // load tool settings from the user's home directory
      config = loadTomlConfigFile();
    } catch (e) {
      console.error(`Error trying to load config file: ${e}`);
    }

    // merge CLI options with config file options (CLI options take precedence)
    const mergedOptions = {
      ...config,
      ...options,
    };

    const apiKey = mergedOptions.api_key || null;
    const compositeAI = new CompositeAIClient(apiKey);

    if (options.gemini) {
      client = compositeAI.getInstance("gemini");
    } else {
      client = compositeAI.getInstance();
    }

    // this is just for listing the models from groq, part of a boolean option
    if (options.list_models) {
      const spinner = ora({
        spinner: "material",
        text: "Getting Models",
      }).start();
      try {
        // checking if the user provided the apiKey
        const models = (await client.getModels()) as string[];
        spinner.succeed("Fetched The Models");
        console.log("Available Models");
        console.log("-----------------------------------------");
        models.forEach((model) => {
          console.log(chalk.yellowBright(model));
        });
      } catch (e) {
        spinner.fail("Operation Failed");
        console.error(`Error while listing the models: ${e}`);
      }
      return;
    }
    const spinner = ora({
      spinner: "material",
      text: "Creating Files",
    }).start();
    try {
      const outputLanguage: string = mergedOptions.language as string;
      const modelName = mergedOptions.model ?? "";
      const keysArr = [...supportedLangMap.keys()];
      // if no files in the arguments
      if (!keysArr.includes(outputLanguage.toLowerCase())) {
        console.error(
          chalk.red(`The output language is not supported by the tool,
please choose from the following options
1. Java
2. JavaScript
3. C++
4. Python`),
        );
        process.exit(1);
      }
      // making the directory to store the transpiled code
      const directoryPath = makeDir("transpiledFiles");
      if (files.length === 0) {
        console.error("No files provided,exiting the operation");
        process.exit(1);
      }

      // checks if this option exists
      const showTokenUsage = options.token || false;

      let totalPromptTokens = 0;
      let totalCompletionTokens = 0;
      let totalTokens = 0;

      await Promise.all(
        files.map(async (file) => {
          const filePath = path.resolve(file);
          if (!fs.existsSync(filePath)) {
            console.error(chalk.redBright("The file doesn't exist"));
            process.exit(1);
          }
          const fileContents = fs.readFileSync(filePath, "utf-8");
          const fileName = path.basename(file).split(".")[0];
          const fileExtension = path.basename(file).split(".")[1];

          const { message, usage } = (await client.getChatCompletion(
            fileContents,
            fileExtension,
            outputLanguage,
            modelName,
          )) as {
            message: string;
            usage: {
              prompt_tokens: number;
              completion_tokens: number;
              total_tokens: number;
            };
          };

          if (showTokenUsage && usage) {
            totalPromptTokens += usage.prompt_tokens;
            totalCompletionTokens += usage.completion_tokens;
            totalTokens += usage.total_tokens;
          }

          const finalMessage = message as string;
          const code = extractCodeBlock(finalMessage);

          createFile(
            fileName,
            supportedLangMap.get(outputLanguage.toLowerCase()) as string,
            directoryPath,
            code,
          );
        }),
      );
      spinner.succeed("Succeeded");
      console.log(
        chalk.green(
          `\nThe files have been created in the transpiledFiles folder under the root directory`,
        ),
      );
      // token usage code
      if (showTokenUsage) {
        console.warn(chalk.blueBright("Token Usage Information:"));
        console.warn(
          `${chalk.yellowBright("Prompt Tokens:")} ${totalPromptTokens}`,
        );
        console.warn(
          `${chalk.yellowBright("Completion Tokens:")} ${totalCompletionTokens}`,
        );
        console.warn(`${chalk.yellowBright("Total Tokens:")} ${totalTokens}`);
      }

      process.exit(0);
    } catch (e) {
      spinner.fail("Unknown error occured");
      console.log(chalk.redBright(e));
      process.exit(1);
    }
  })
  .parse(Bun.argv);

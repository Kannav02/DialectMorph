import { Command } from "commander";
import chalk from "chalk";

// this file contains all the config settings for the main commander instance

const program = new Command();

program
  .version(chalk.whiteBright("1.0.0"))
  .name(chalk.magentaBright("dialectMorph"))
  .usage(chalk.yellowBright("<input_files> -l <output_language>"))
  .description(
    chalk.cyanBright(
      `This is a tool designed to transpile code from one language to the other, the options that this support right now is just the following ones
    1. Java
    2. JavaScript
    3. C++
    4. Python`,
    ),
  )
  // input files arguments
  .arguments("[files...]")
  // options that would be required for different functions
  .option(
    "-l,--language <options>",
    "Output A Given File To The Given Language",
  )
  .option("-lm,--list_models", "Lists the available models for the Groq API")
  .option("-m,--model <options>", "Give the model for the API to be used")
  .option("-a,--api_key <options>", "Provide the API Key for Groq API")
  .option(
    "-t,--token",
    "Lists the prompt tokens, completion tokens, and total tokens consumed from using the Groq API",
  )
  .option(
    "-gem,--gemini",
    "Uses Gemini as the LLM to generate the result from prompts,default model for gemini is gemini-1.5-flash",
  );

export default program;

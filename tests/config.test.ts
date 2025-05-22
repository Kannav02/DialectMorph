import program from "../src/config"; // program is the default export
import { Option } from "commander";

describe("Commander Program Configuration", () => {
  // Note: Commander's .version(), .name(), .usage(), .description()
  // might return strings without chalk escapes even if defined with them.
  // We will test against the raw strings.

  it("should have the correct version", () => {
    // As seen in config.ts: .version(chalk.whiteBright("1.2.7"))
    // Commander likely stores "1.2.7"
    expect(program.version()).toBe("1.2.7");
  });

  it("should have the correct name", () => {
    // As seen in config.ts: .name(chalk.magentaBright("dialectMorph"))
    // Commander likely stores "dialectMorph"
    expect(program.name()).toBe("dialectMorph");
  });

  it("should have the correct usage string", () => {
    // As seen in config.ts: .usage(chalk.yellowBright("<input_files> -l <output_language>"))
    // Commander likely stores "<input_files> -l <output_language>"
    expect(program.usage()).toBe("<input_files> -l <output_language>");
  });

  it("should have the correct description", () => {
    // As seen in config.ts: .description(chalk.cyanBright(...))
    // Commander likely stores the raw description string
    const expectedDescription = `This is a tool designed to transpile code from one language to the other, the options that this support right now is just the following ones
    1. Java
    2. JavaScript
    3. C++
    4. Python`;
    expect(program.description()).toBe(expectedDescription);
  });

  const findOption = (flag: string): Option | undefined => {
    return program.options.find(
      (opt) => opt.short === flag || opt.long === flag
    );
  };

  describe("Options", () => {
    it("should define the '-l, --language <options>' option correctly", () => {
      const option = findOption("-l");
      expect(option).toBeDefined();
      if (option) {
        expect(option.short).toBe("-l");
        expect(option.long).toBe("--language");
        expect(option.flags).toBe("-l,--language <options>");
        expect(option.description).toBe(
          "Output A Given File To The Given Language"
        );
      }
    });

    it("should define the '-lm, --list_models' option correctly", () => {
      const option = findOption("-lm");
      expect(option).toBeDefined();
      if (option) {
        expect(option.short).toBe("-lm");
        expect(option.long).toBe("--list_models");
        expect(option.flags).toBe("-lm,--list_models");
        expect(option.description).toBe(
          "Lists the available models for the Groq API"
        );
      }
    });

    it("should define the '-m, --model <options>' option correctly", () => {
      const option = findOption("-m");
      expect(option).toBeDefined();
      if (option) {
        expect(option.short).toBe("-m");
        expect(option.long).toBe("--model");
        expect(option.flags).toBe("-m,--model <options>");
        expect(option.description).toBe("Give the model for the API to be used");
      }
    });

    it("should define the '-a, --api_key <options>' option correctly", () => {
      const option = findOption("-a");
      expect(option).toBeDefined();
      if (option) {
        expect(option.short).toBe("-a");
        expect(option.long).toBe("--api_key");
        expect(option.flags).toBe("-a,--api_key <options>");
        expect(option.description).toBe("Provide the API Key for Groq API");
      }
    });

    it("should define the '-t, --token' option correctly", () => {
      const option = findOption("-t");
      expect(option).toBeDefined();
      if (option) {
        expect(option.short).toBe("-t");
        expect(option.long).toBe("--token");
        expect(option.flags).toBe("-t,--token"); // Boolean flags don't have <value>
        expect(option.description).toBe(
          "Lists the prompt tokens, completion tokens, and total tokens consumed from using the Groq API"
        );
      }
    });

    it("should define the '-gem, --gemini' option correctly", () => {
      const option = findOption("-gem");
      expect(option).toBeDefined();
      if (option) {
        expect(option.short).toBe("-gem");
        expect(option.long).toBe("--gemini");
        expect(option.flags).toBe("-gem,--gemini"); // Boolean flag
        expect(option.description).toBe(
          "Uses Gemini as the LLM to generate the result from prompts,default model for gemini is gemini-1.5-flash"
        );
      }
    });
  });
});

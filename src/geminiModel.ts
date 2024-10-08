import { GoogleGenerativeAI, UsageMetadata } from "@google/generative-ai";
import AIClient from "./LLMHandler";

export default class GeminiClient implements AIClient {
  // used to check if the instance exists
  private static instance: GeminiClient;

  private gemini: GoogleGenerativeAI;

  private constructor(apiKey: string | null = null) {
    this.gemini = new GoogleGenerativeAI(
      apiKey || (process.env.GEMINI_API_KEY as string),
    );
  }

  public static getInstance(apiKey: string | null = null): GeminiClient {
    if (!GeminiClient.instance) {
      GeminiClient.instance = new GeminiClient(apiKey);
    }
    return GeminiClient.instance;
  }

  public async getChatCompletion(
    fileContent: string,
    fileExtension: string,
    outputType: string,
    modelName: string | null,
  ): Promise<{
    message: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  } | null> {
    // tbh, gemini is pretty deranged in terms of model generation
    // first you get a model object from gemini
    // then you get the result from that model
    // then you parse the response form the result
    // then you parse the message and usage details from response using a function
    // too many function calls

    try {
      const systemPrompt = `you are a code transpilation assistant. Your task is to convert source code from one programming language to another specified
      language. You will receive the source code and the target language. for each output of transpiled code, Ensure the transpiled code maintains the original functionality and logic 
      while adapting to the target language's idioms and best practices. Support transpilation for this language ${outputType}, 
      TypeScript, and Ruby.Your goal is to produce accurate, readable, and efficient code in the target language and to just return back code , no other things so i can add them into the file directly.`;

      const userPrompt = `The input content of the file has been provided to you for the extension ${fileExtension}
            Output Should be in the following Language:${outputType}
            fileContent: ${fileContent}`;
      const model = this.gemini.getGenerativeModel({
        model: modelName || "gemini-1.5-flash",
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent(userPrompt);
      const response = await result.response;
      const message = response.text();
      const usage = response.usageMetadata as UsageMetadata;

      let prompt_tokens = 0;
      let completion_tokens = 0;
      let total_tokens = 0;

      prompt_tokens += usage?.promptTokenCount;
      completion_tokens += usage?.candidatesTokenCount;
      total_tokens += usage?.totalTokenCount;

      return {
        message,
        usage: {
          prompt_tokens,
          completion_tokens,
          total_tokens,
        },
      };
    } catch (e) {
      console.error(`Error occured during chat completion:${e}`);
      return null;
    }
  }

  public async getModels() {
    // upon researching , gemini doesn't support providing a list of available models, so we will proceed with a static list of models

    const geminiModels = ["gemini-1.5-flash", "gemini-1.5-pro"];

    return geminiModels as string[];
  }
}

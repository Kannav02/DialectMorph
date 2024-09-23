import Groq from "groq-sdk";

//singleton class for GroqqClient, wouldn't want more than two instanes at once
export class GroqClient {
  // used to point at the instance that exists, this is static
  private static instance: GroqClient;

  // actual instance
  private groq: Groq;

  // private constructor
  private constructor(apiKey: string | null = null) {
    this.groq = new Groq({ apiKey: apiKey || process.env.GROQ_API_KEY });
  }

  // public method for the program to use
  public static getInstance(apiKey: string | null = null) {
    if (!GroqClient.instance) {
      GroqClient.instance = new GroqClient(apiKey);
    }
    return GroqClient.instance;
  }

  // method to list the models available by groq, again this is public as well
  public async getGroqModels() {
    try {
      const models = await this.groq.models.list();
      const modelNames: string[] = models.data.map((model) => {
        return model.id;
      });

      return modelNames;
    } catch (e) {
      console.error(`Error fetching the Groq models: ${e}`);
    }
  }

  // main function that gets the completion from groq
  public async getGroqChatCompletion(
    fileContent: string,
    fileExtension: string,
    outputType: string,
    modelName: string | null,
  ): Promise<object | null> {
    try {
      const apiCall = await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `you are a code transpilation assistant. Your task is to convert source code from one programming language to another specified
            language. You will receive the source code and the target language. for each output of transpiled code, Ensure the transpiled code maintains the original functionality and logic 
            while adapting to the target language's idioms and best practices. Support transpilation for this language ${outputType}, 
            TypeScript, and Ruby.Your goal is to produce accurate, readable, and efficient code in the target language and to just return back code , no other things so i can add them into the file directly.`,
          },
          {
            role: "user",
            content: `The input content of the file has been provided to you for the extension ${fileExtension}
          Output Should be in the following Language:${outputType}
          fileContent: ${fileContent}
          `,
          },
        ],
        temperature: 0.2,
        model: modelName || "llama3-8b-8192",
      });

      const message = apiCall.choices[0].message.content;
      const usage = apiCall.usage;

      return { message, usage };
    } catch (e) {
      console.error(`Error fetching the chat completion: ${e}`);
      return null;
    }
  }
}

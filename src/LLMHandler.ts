import Groq from "groq-sdk";

export class GroqClient {
  private static instance: GroqClient;
  private groq: Groq;

  private constructor(apiKey: string | null = null) {
    this.groq = new Groq({ apiKey: apiKey ?? process.env.GROQ_API_KEY });
  }

  public static getInstance(apiKey: string | null = null) {
    if (!GroqClient.instance) {
      GroqClient.instance = new GroqClient(apiKey);
    }
    return GroqClient.instance;
  }
  public async getGroqModels() {
    const models = await this.groq.models.list();
    const modelNames: string[] = models.data.map((model) => {
      return model.id;
    });
    return modelNames;
  }
  public async getGroqChatCompletion(
    fileContent: string,
    fileExtension: string,
    outputType: string,
    modelName: string | null,
  ): Promise<string | null> {
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

    return apiCall.choices[0].message.content;
  }
}

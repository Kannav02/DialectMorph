import Groq from "groq-sdk";
import AIClient from "./LLMHandler";

export default class GroqClient implements AIClient {
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
	public async getModels() {
		try {
			const models = await this.groq.models.list();
			const modelNames: string[] = models.data.map((model) => {
				return model.id;
			});

			return modelNames as string[];
		} catch (e) {
			console.error(`Error fetching the Groq models: ${e}`);
			return null;
		}
	}

	// main function that gets the completion from groq
	public async getChatCompletion(
		fileContent: string,
		fileExtension: string,
		outputType: string,
		modelName: string | null
	): Promise<{
		message: string;
		usage: {
			prompt_tokens: number;
			completion_tokens: number;
			total_tokens: number;
		};
	} | null> {
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

			return {
				message: message as string,
				usage: usage as {
					prompt_tokens: number;
					completion_tokens: number;
					total_tokens: number;
				},
			};
		} catch (e) {
			console.error(`Error fetching the chat completion: ${e}`);
			return null;
		}
	}
}

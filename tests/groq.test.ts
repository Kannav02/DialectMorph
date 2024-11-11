/* eslint-disable @typescript-eslint/no-explicit-any */
import { Groq } from "groq-sdk";
import GroqClient from "../src/groqModel";

jest.mock("groq-sdk");

describe("GroqClient", () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let groqClientInstance: GroqClient;
	const mockApiKey = "mock-api-key";

	// Mock response for models.list
	const mockModelsResponse = {
		data: [{ id: "model-1" }, { id: "model-2" }, { id: "model-3" }],
	};

	// Mock response for chat completion
	const mockChatCompletionResponse = {
		choices: [
			{
				message: {
					content: 'function example() { return "Hello World"; }',
				},
			},
		],
		usage: {
			prompt_tokens: 100,
			completion_tokens: 50,
			total_tokens: 150,
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		GroqClient.resetInstance();

		// Mock Groq API methods
		(Groq.prototype as any).models = {
			list: jest.fn().mockResolvedValue(mockModelsResponse),
		};

		(Groq.prototype as any).chat = {
			completions: {
				create: jest.fn().mockResolvedValue(mockChatCompletionResponse),
			},
		};
	});

	describe("getInstance", () => {
		test("creates singleton instance with API key", () => {
			const instance1 = GroqClient.getInstance(mockApiKey);
			const instance2 = GroqClient.getInstance(mockApiKey);
			expect(instance1).toBe(instance2);
		});

		test("creates singleton instance with environment variable when no API key provided", () => {
			process.env.GROQ_API_KEY = "env-api-key";
			const instance = GroqClient.getInstance();
			expect(instance).toBeDefined();
			delete process.env.GROQ_API_KEY;
		});
	});

	describe("resetInstance", () => {
		test("resets the singleton instance", () => {
			const instance1 = GroqClient.getInstance(mockApiKey);
			GroqClient.resetInstance();
			const instance2 = GroqClient.getInstance(mockApiKey);
			expect(instance1).not.toBe(instance2);
		});
	});

	describe("getModels", () => {
		test("successfully retrieves model list", async () => {
			const instance = GroqClient.getInstance(mockApiKey);
			const models = await instance.getModels();
			expect(models).toEqual(["model-1", "model-2", "model-3"]);
			expect(Groq.prototype.models.list).toHaveBeenCalled();
		});

		test("handles error when fetching models", async () => {
			(Groq.prototype as any).models.list.mockRejectedValue(
				new Error("API Error")
			);
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const instance = GroqClient.getInstance(mockApiKey);
			const result = await instance.getModels();

			expect(result).toBeNull();
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining("Error fetching the Groq models")
			);

			consoleSpy.mockRestore();
		});
	});

	describe("getChatCompletion", () => {
		const mockFileContent = "const sum = (a, b) => a + b;";
		const mockFileExtension = ".js";
		const mockOutputType = "Python";
		const mockModelName = "llama3-8b-8192";

		test("successfully gets chat completion", async () => {
			const instance = GroqClient.getInstance(mockApiKey);
			const result = await instance.getChatCompletion(
				mockFileContent,
				mockFileExtension,
				mockOutputType,
				mockModelName
			);

			expect(result).toEqual({
				message: mockChatCompletionResponse.choices[0].message.content,
				usage: mockChatCompletionResponse.usage,
			});

			expect(Groq.prototype.chat.completions.create).toHaveBeenCalledWith({
				messages: expect.arrayContaining([
					expect.objectContaining({
						role: "system",
						content: expect.stringContaining("code transpilation assistant"),
					}),
					expect.objectContaining({
						role: "user",
						content: expect.stringContaining(mockFileContent),
					}),
				]),
				temperature: 0.2,
				model: mockModelName,
			});
		});

		test("uses default model when modelName is null", async () => {
			const instance = GroqClient.getInstance(mockApiKey);
			await instance.getChatCompletion(
				mockFileContent,
				mockFileExtension,
				mockOutputType,
				null
			);

			expect(Groq.prototype.chat.completions.create).toHaveBeenCalledWith(
				expect.objectContaining({
					model: "llama3-8b-8192",
				})
			);
		});

		test("handles error in chat completion", async () => {
			(Groq.prototype as any).chat.completions.create.mockRejectedValue(
				new Error("API Error")
			);
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const instance = GroqClient.getInstance(mockApiKey);
			const result = await instance.getChatCompletion(
				mockFileContent,
				mockFileExtension,
				mockOutputType,
				mockModelName
			);

			expect(result).toBeNull();
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining("Error fetching the chat completion")
			);

			consoleSpy.mockRestore();
		});
	});
});

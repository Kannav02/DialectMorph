import { jest } from "@jest/globals";
import GeminiClient from "../src/geminiModel";
import { GoogleGenerativeAI } from "@google/generative-ai";

jest.mock("@google/generative-ai");

describe("GeminiClient", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		// @ts-expect-error: Accessing private static member for testing
		GeminiClient.instance = undefined;
	});

	it("should create a singleton instance", () => {
		const instance1 = GeminiClient.getInstance("test-key");
		const instance2 = GeminiClient.getInstance("test-key");
		expect(instance1).toBe(instance2);
	});

	it("should handle errors in chat completion", async () => {
		const mockGenerateContent = jest
			.fn()
			// @ts-expect-error: this is for the error assignment
			.mockRejectedValue(new Error("API Error"));

		(GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
			getGenerativeModel: () => ({
				generateContent: mockGenerateContent,
			}),
		}));

		const client = GeminiClient.getInstance("test-key");
		const result = await client.getChatCompletion(
			"const sum = (a, b) => a + b;",
			".ts",
			"python",
			"gemini-1.5-pro"
		);

		expect(result).toBeNull();
	});

	it("should return available models", async () => {
		const client = GeminiClient.getInstance("test-key");
		const models = await client.getModels();
		expect(models).toEqual(["gemini-1.5-flash", "gemini-1.5-pro"]);
	});
});

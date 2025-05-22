import CompositeClass from "../src/CompositeClass"; // Assuming CompositeClass is in src
import GroqClient from "../src/groqModel";
import GeminiClient from "../src/geminiModel";

// Mock the client modules
jest.mock("../src/groqModel");
jest.mock("../src/geminiModel");

describe("CompositeClass", () => {
  const mockGroqApiKey = "groq-api-key";
  const mockGeminiApiKey = "gemini-api-key";

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock environment variables or configuration if CompositeClass reads them directly
    // For example, if API keys are read from process.env
    process.env.GROQ_API_KEY = mockGroqApiKey;
    process.env.GEMINI_API_KEY = mockGeminiApiKey;
  });

  describe("getInstance", () => {
    it("should return a GroqClient instance by default", () => {
      const instance = CompositeClass.getInstance();
      expect(GroqClient).toHaveBeenCalledTimes(1);
      expect(GroqClient).toHaveBeenCalledWith(mockGroqApiKey);
      expect(instance).toBeInstanceOf(GroqClient);
      expect(GeminiClient).not.toHaveBeenCalled();
    });

    it("should return a GeminiClient instance when 'gemini' is specified", () => {
      const instance = CompositeClass.getInstance("gemini");
      expect(GeminiClient).toHaveBeenCalledTimes(1);
      expect(GeminiClient).toHaveBeenCalledWith(mockGeminiApiKey);
      expect(instance).toBeInstanceOf(GeminiClient);
      expect(GroqClient).not.toHaveBeenCalled();
    });

    it("should pass the correct API key to GroqClient", () => {
      CompositeClass.getInstance();
      expect(GroqClient).toHaveBeenCalledWith(mockGroqApiKey);
    });

    it("should pass the correct API key to GeminiClient", () => {
      CompositeClass.getInstance("gemini");
      expect(GeminiClient).toHaveBeenCalledWith(mockGeminiApiKey);
    });

    it("should return the same instance if called multiple times with the same type (Groq default)", () => {
      const instance1 = CompositeClass.getInstance();
      const instance2 = CompositeClass.getInstance();
      expect(GroqClient).toHaveBeenCalledTimes(1); // Constructor called only once
      expect(instance1).toBe(instance2);
    });

    it("should return the same instance if called multiple times with 'gemini'", () => {
      const instance1 = CompositeClass.getInstance("gemini");
      const instance2 = CompositeClass.getInstance("gemini");
      expect(GeminiClient).toHaveBeenCalledTimes(1); // Constructor called only once
      expect(instance1).toBe(instance2);
    });

     it("should return a new Groq instance if called after a Gemini instance", () => {
      const geminiInstance = CompositeClass.getInstance("gemini");
      const groqInstance = CompositeClass.getInstance();
      expect(GeminiClient).toHaveBeenCalledTimes(1);
      expect(GroqClient).toHaveBeenCalledTimes(1);
      expect(geminiInstance).toBeInstanceOf(GeminiClient);
      expect(groqInstance).toBeInstanceOf(GroqClient);
      expect(groqInstance).not.toBe(geminiInstance);
    });
  });
});

import AIClient from "./LLMHandler";
import GeminiClient from "./geminiModel";
import GroqClient from "./groqModel";

export default class CompositeAIClient {
  private client: AIClient | null = null;
  private apiKey: string | null;

  constructor(apiKey: string | null = null) {
    this.apiKey = apiKey;
  }

  private getGroqInstance() {
    if (!this.client) {
      this.client = GroqClient.getInstance(this.apiKey);
    }
    return this.client;
  }
  private getGeminiInstance() {
    if (!this.client) {
      this.client = GeminiClient.getInstance(this.apiKey);
    }
    return this.client;
  }

  public getInstance(provider: string = "groq") {
    if (provider.toLowerCase() == "gemini") {
      return this.getGeminiInstance();
    }
    return this.getGroqInstance();
  }
}

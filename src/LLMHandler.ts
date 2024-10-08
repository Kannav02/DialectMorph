export default interface AIClient {
  getChatCompletion: (
    fileContent: string,
    fileExtension: string,
    outputType: string,
    modelName: string | null,
  ) => Promise<{
    message: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  } | null>;
  getModels: () => Promise<string[] | null>;
}

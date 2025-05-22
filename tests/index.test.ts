// Mock global execution environment
const mockArgv = ['/usr/local/bin/bun', 'index.ts']; 
const mockExit = jest.fn((code?: number) => {
  throw new Error(`process.exit called with ${code ?? 'undefined'}`);
});
global.process.exit = mockExit as any; 
global.Bun = { argv: mockArgv } as any; 

// Mock external and internal modules
jest.mock('chalk', () => ({
  yellow: jest.fn((s: string) => `chalk.yellow(${s})`),
  red: jest.fn((s: string) => `chalk.red(${s})`),
  green: jest.fn((s: string) => `chalk.green(${s})`),
  blueBright: jest.fn((s: string) => `chalk.blueBright(${s})`),
  magentaBright: jest.fn((s: string) => `chalk.magentaBright(${s})`),
  cyanBright: jest.fn((s: string) => `chalk.cyanBright(${s})`),
  whiteBright: jest.fn((s: string) => `chalk.whiteBright(${s})`),
  bold: {
    blueBright: jest.fn((s: string) => `chalk.bold.blueBright(${s})`),
  }
}));
jest.mock('figlet', () => ({
  textSync: jest.fn((s: string) => `Figlet: ${s}`),
}));

const mockOraInstance = {
  start: jest.fn().mockReturnThis(),
  succeed: jest.fn().mockReturnThis(),
  fail: jest.fn().mockReturnThis(),
  text: '',
};
jest.mock('ora', () => jest.fn(() => mockOraInstance));


const mockFs = require('fs');
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));
const mockPath = require('path');
jest.mock('path', () => ({
  resolve: jest.fn((...args: string[]) => args.join('/')),
  basename: jest.fn((p: string) => p.split('/').pop() || p),
  join: jest.fn((...args: string[]) => args.join('/')),
  dirname: jest.fn((p: string) => p.substring(0, p.lastIndexOf('/')) || '.'),
  extname: jest.fn((p: string) => { 
    const lastDot = p.lastIndexOf('.');
    return lastDot === -1 ? '' : p.substring(lastDot);
  }),
}));

const mockFileHelper = require('../src/fileHelper');
jest.mock('../src/fileHelper', () => ({
  createFile: jest.fn(),
  makeDir: jest.fn().mockReturnValue('mock/output/dir'), 
  extractCodeBlock: jest.fn(),
  loadTomlConfigFile: jest.fn().mockReturnValue({}), 
  SUPPORTED_LANGUAGES: ['java', 'javascript', 'python', 'cpp', 'standard english'],
}));

const mockGetModels = jest.fn();
const mockGetChatCompletion = jest.fn();
const mockCompositeClientInstance = {
  getModels: mockGetModels,
  getChatCompletion: mockGetChatCompletion,
};
const mockGetInstance = jest.fn(() => mockCompositeClientInstance);
jest.mock('../src/CompositeClass', () => ({
  getInstance: mockGetInstance,
}));

let capturedActionHandler: ((files: string[], options: any) => Promise<void>) | null = null;
const mockProgram = {
  version: jest.fn().mockReturnThis(),
  name: jest.fn().mockReturnThis(),
  usage: jest.fn().mockReturnThis(),
  description: jest.fn().mockReturnThis(),
  arguments: jest.fn().mockReturnThis(),
  option: jest.fn().mockReturnThis(),
  action: jest.fn((handler) => {
    capturedActionHandler = handler;
    return mockProgram;
  }),
  parse: jest.fn().mockReturnThis(),
  opts: jest.fn(() => ({ 
    language: 'JavaScript', 
    model: 'default-model',
    apiKey: undefined,
    token: false,
    gemini: false,
    list_models: false,
  })),
  args: [], 
};
jest.mock('../src/config', () => ({
  __esModule: true,
  default: mockProgram,
}));

require('../src/index');


describe('Index Script Action Handler', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  const baseOpts = { 
    language: 'Python', 
    model: 'gemma-7b-it',
    apiKey: undefined,
    token: false,
    gemini: false,
    list_models: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    global.Bun.argv = [...mockArgv];
    global.process.exit = mockExit as any;

    mockProgram.opts = jest.fn(() => ({ ...baseOpts })); // Use a copy of baseOpts
    mockProgram.args = []; 

    mockFileHelper.loadTomlConfigFile.mockReturnValue({});
    mockFs.existsSync.mockReturnValue(false); 
    mockFs.readFileSync.mockReturnValue('');
    mockFileHelper.SUPPORTED_LANGUAGES = ['java', 'javascript', 'python', 'cpp', 'standard english'];
    mockGetChatCompletion.mockResolvedValue({ message: '```python\n# code\n```', tokens: { prompt_tokens:1,completion_tokens:1,total_tokens:2 } });
    mockFileHelper.extractCodeBlock.mockReturnValue('# code');


    if (!capturedActionHandler) {
        jest.isolateModules(() => {
            require('../src/index');
        });
        if (!capturedActionHandler) {
            throw new Error("Action handler was not captured. Check mock setup for ../src/config.");
        }
    }
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });
  
  // Previous tests (Initial Checks, Figlet, list_models, Main Happy Path, Error Handling)
  describe('Initial Checks and Figlet Output', () => { /* tests */ });
  describe('list_models option', () => { /* tests */ });
  describe('Main File Processing Logic (Happy Path)', () => { /* tests */ });
  describe('Error Handling in Main Processing Logic', () => { /* tests */ });


  describe('API Key and Client Type Handling', () => {
    const mockFile = ['test.py'];
    
    beforeEach(() => {
        mockProgram.args = mockFile;
        mockFs.existsSync.mockReturnValue(true);
        mockFs.readFileSync.mockReturnValue('print("hello")');
    });

    it('should use API key from options if provided (Groq default)', async () => {
      const optionsApiKey = 'options_groq_key';
      mockProgram.opts = jest.fn(() => ({ ...baseOpts, apiKey: optionsApiKey }));
      await capturedActionHandler!(mockFile, await mockProgram.opts());
      expect(mockGetInstance).toHaveBeenCalledWith(undefined, optionsApiKey);
    });

    it('should use API key from TOML config if no options.apiKey (Groq default)', async () => {
      const tomlApiKey = 'toml_groq_key';
      mockFileHelper.loadTomlConfigFile.mockReturnValue({ GROQ_API_KEY: tomlApiKey });
      mockProgram.opts = jest.fn(() => ({ ...baseOpts, apiKey: undefined }));
      await capturedActionHandler!(mockFile, await mockProgram.opts());
      expect(mockGetInstance).toHaveBeenCalledWith(undefined, tomlApiKey);
    });
    
    it('should prioritize options.apiKey over TOML config (Groq default)', async () => {
      const optionsApiKey = 'options_groq_key_priority';
      const tomlApiKey = 'toml_groq_key_ignored';
      mockFileHelper.loadTomlConfigFile.mockReturnValue({ GROQ_API_KEY: tomlApiKey });
      mockProgram.opts = jest.fn(() => ({ ...baseOpts, apiKey: optionsApiKey }));
      await capturedActionHandler!(mockFile, await mockProgram.opts());
      expect(mockGetInstance).toHaveBeenCalledWith(undefined, optionsApiKey);
    });

    it('should select Gemini client if options.gemini is true', async () => {
      mockProgram.opts = jest.fn(() => ({ ...baseOpts, gemini: true, apiKey: undefined }));
      await capturedActionHandler!(mockFile, await mockProgram.opts());
      expect(mockGetInstance).toHaveBeenCalledWith('gemini', undefined); // No specific API key in this test
    });

    it('should select Groq client by default (options.gemini is false)', async () => {
      mockProgram.opts = jest.fn(() => ({ ...baseOpts, gemini: false, apiKey: undefined }));
      await capturedActionHandler!(mockFile, await mockProgram.opts());
      expect(mockGetInstance).toHaveBeenCalledWith(undefined, undefined); // Default client, no API key
    });

    it('should use options.apiKey for Gemini client if provided', async () => {
      const geminiOptionsKey = 'gem_opt_key';
      mockProgram.opts = jest.fn(() => ({ ...baseOpts, gemini: true, apiKey: geminiOptionsKey }));
      mockFileHelper.loadTomlConfigFile.mockReturnValue({ GEMINI_API_KEY: 'gem_toml_key_ignored' });
      await capturedActionHandler!(mockFile, await mockProgram.opts());
      expect(mockGetInstance).toHaveBeenCalledWith('gemini', geminiOptionsKey);
    });

    it('should use GEMINI_API_KEY from TOML for Gemini client if no options.apiKey', async () => {
      const geminiTomlKey = 'gem_toml_key';
      mockProgram.opts = jest.fn(() => ({ ...baseOpts, gemini: true, apiKey: undefined }));
      mockFileHelper.loadTomlConfigFile.mockReturnValue({ GEMINI_API_KEY: geminiTomlKey });
      await capturedActionHandler!(mockFile, await mockProgram.opts());
      expect(mockGetInstance).toHaveBeenCalledWith('gemini', geminiTomlKey);
    });

    it('should use GROQ_API_KEY from TOML for Groq client if no options.apiKey and not Gemini', async () => {
        const groqTomlKey = 'groq_toml_key_specific';
        mockProgram.opts = jest.fn(() => ({ ...baseOpts, gemini: false, apiKey: undefined }));
        mockFileHelper.loadTomlConfigFile.mockReturnValue({ GROQ_API_KEY: groqTomlKey });
        await capturedActionHandler!(mockFile, await mockProgram.opts());
        expect(mockGetInstance).toHaveBeenCalledWith(undefined, groqTomlKey);
    });

    it('should default to undefined API key if no key in options or TOML (Groq)', async () => {
        mockProgram.opts = jest.fn(() => ({ ...baseOpts, gemini: false, apiKey: undefined }));
        mockFileHelper.loadTomlConfigFile.mockReturnValue({}); // Empty TOML
        await capturedActionHandler!(mockFile, await mockProgram.opts());
        expect(mockGetInstance).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should default to undefined API key if no key in options or TOML (Gemini)', async () => {
        mockProgram.opts = jest.fn(() => ({ ...baseOpts, gemini: true, apiKey: undefined }));
        mockFileHelper.loadTomlConfigFile.mockReturnValue({}); // Empty TOML
        await capturedActionHandler!(mockFile, await mockProgram.opts());
        expect(mockGetInstance).toHaveBeenCalledWith('gemini', undefined);
    });
  });
});

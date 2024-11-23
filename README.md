# DialectMorph

![Demo Gif](./demo.gif)

DialectMorph is a powerful code transpilation tool designed to convert source code from one programming language to another. It leverages the Groq API to perform intelligent code translations while maintaining the original functionality and logic.

## Features

- Supports transpilation between Python, JavaScript, Java, and C++
- Command-line interface for easy usage
- Automatically creates a `transpiledFiles` directory for output
- By default, Utilizes Groq's language model for accurate code conversion, option to use Gemini can be specified
- User can also provide their own API-Key to be used in this CLI Tool
- User can also request the the list of models available in the Groq-API
- User can also specify the model that they want to use for their use-case

## Installation

### Two Installation Options

#### Global Package Installation

To install DialectMorph globally:

1. Ensure you have [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed on your system.
2. Run the following command to install globally:

   ```bash
   npm install -g dialect-morph
   ```

3. Verify the installation by running:

   ```bash
   dialectMorph -V
   ```

   If the `dialectMorph` command isn’t recognized, ensure your `PATH` variable includes npm binaries. You may also need to restart your terminal.

---

#### Local Installation

To install DialectMorph locally in your project:

1. Clone the repository:

   ```bash
   git clone https://github.com/Kannav02/DialectMorph.git
   cd DialectMorph
   ```

2. Install dependencies using [Bun](https://bun.sh/docs/installation):

   ```bash
   bun install
   ```

3. Build the TypeScript files to JavaScript:

   ```bash
   bun run build
   ```

4. Link the CLI tool globally:

   ```bash
   bun link
   ```

5. Add Bun binaries to your `PATH` variable:

   ```bash
   export PATH="/Users/username/.bun/bin:$PATH"
   source ~/.zshrc
   ```

6. Configure the Groq API key and Gemini API key:

   ```bash
   cp .env.example .env
   ```

   Add your API keys to the `.env` file:

   ```
   GROQ_API_KEY=your_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

---

####

---

# DialectMorph

![Demo Gif](./demo.gif)

DialectMorph is a powerful code transpilation tool designed to convert source code from one programming language to another. It leverages the Groq API to perform intelligent code translations while maintaining the original functionality and logic.

## Features

- Supports transpilation between Python, JavaScript, Java, and C++
- Command-line interface for easy usage
- Automatically creates a `transpiledFiles` directory for output
- Utilizes Groq's or Gemini's language models for accurate code conversion
- Allows users to specify API keys and models via CLI or configuration files

## Installation

### Install via Package Registry

1. Ensure you have [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) ann [Bun](https://bun.sh/docs/installation) globally .
2. Install DialectMorph globally:

   ```sh
   npm i -g dialect-morph
   ```

3. Verify the installation:

   ```sh
   dialectMorph --help
   ```

   If the `dialectMorph` command isn't recognized, ensure your `PATH` variable includes Bun's binaries. Add this to your shell configuration (`.zshrc` or `.bashrc`):

   ```sh
   export PATH="/Users/username/.bun/bin:$PATH"
   source ~/.zshrc
   ```

4. Set up your API keys by creating a `.env` file or editing `~/.dialectMorph.config.toml`.

### Github Repo Installation

1. Clone the repository:

   ```
   git clone https://github.com/Kannav02/DialectMorph.git
   cd DialectMorph
   ```

2. Install dependencies:

   > To install `bun`, please follow this [installation guide](https://bun.sh/docs/installation).

   ```
   bun install
   ```

   **To skip steps 3 and 4 , you can run the following script, which will run all of these commands in a single-go**

   ```
   bun run linkage:build

   ```

3. Run the following commands to have bun build/transpile typescript files to javascript so as to run the binary

   ```
   bun run build
   ```

4. Link and Install Bun Binaries in the Global Scope

   we would have to register the CLI tool globally and then also install the binaries in the global scope to make it useful in the terminal

   to register the CLI tool globally ,run the following command

   ```
   bun link
   ```

   after this,
   to install the bun binaries globally, run the following commmand

   ```
   bun link dialect-morph
   ```

5. Run the following commands in the terminal to make sure that .bun/bin exists in the path variable

   ```
   export PATH="/Users/username/.bun/bin:$PATH"
   ```

   reload the shell config file

   ```
   source ~/.zshrc
   ```

6. Set up your Groq API key:

   - Create a `.env` file in the root directory or run the following command in the shell

     ```
     cp .env.example .env

     ```

   - Add your Groq API key: `GROQ_API_KEY=your_api_key_here`
   - Add your Gemini API key: `GEMINI_API_KEY=api_key_goes_here`

## Configuration via TOML file

You can specify your preferred settings for the CLI tool by creating and editing a TOML configuration file.
It will allow you to customize the default options to tailor the tool's behaviour to your needs.
Learn more about TOML on the [official website](https://toml.io/en/).

The arguments that can be specified in the `dialectMorph.config.toml`:

- `api_key` - provide the API key to be used
- `model` - set the Large Language Model of choice
- `language` - specify the output programming language

1. A sample configuration file `sample.dialectMorph.config.toml` is provided in the repository.
2. To create your own configuration file, run the following command:

To create your own configuration file in your home directory, run the following command:

```sh
cp sample.dialectMorph.config.toml ~/dialectMorph.config.toml
```

**Important!** - Make sure that the config file you create is named `dialectMorph.config.toml`, as the tool will be looking for this specific file in your home directory.

## Usage

Run DialectMorph using the following command:

### Main Command

```
dialectMorph <input_files...> -l <output_language>
```

The `input_files` argument can take multiple files at once and is a required argument
the `output_language` argument is also a required argument

Examples:

Take one of the files from the examples folder and run the following command

```
dialectMorph ./examples/example.py -l java
dialectMorph ./examples/example.cpp -l python
```

### Optional Arguments

- a (--api_key)
  This command is one of the optional arguments and can be used with the main command or the lm command (see below)

  Command

  ```
  dialectMorph ./examples/examples.py -l C++ -a YOUR_API_KEY

  ```

- m (--model)
  This command is one of the optional arguments and can be used with the main command to specify the model that you want to be used to fetch the request , by default the model is `llama3-8b-8192` for Groq and `gemini-1.5-flash` for Gemini

  **BE CAREFUL TO ONLY USE A MODEL NAME THAT EXISTS AFTER YOU USE THE LM OPTION OTHERWISE THE PROGRAM WILL THROW AN ERROR**

  Command

  ```
  dialectMorph ./example/example.py -l java -a YOUR_API_KEY -m MODEL_NAME

  ```

- lm (--list_models)
  This command can be used on its own without the need to provide any files and is used to fetch the list of models that are available on Groq, it can also take an API-Key as one of the optional arguments

  Command

  ```
   dialectMorph -lm -a YOUR_API_KEY

  ```

- t (--token)
  This command is one of the optional arguments and can be used with the main command to specify the desire to see how many tokens are consumed (i.e., prompt tokens, completion tokens, and total tokens) from making a request to the Groq API.

  ```
   dialectMorph ./examples/example.py -l java -t

  ```

- gem (--gemini)
  This command is used to indicate to the CLI tool that Gemini LLM would be used to generate the code that would be used in the transpiled files, if this option isn't provided, groq is used by default

  ```
  dialectMorph ./examples/example.py -l java -gem

  ```

## Supported Languages

- Python (.py)
- JavaScript (.js)
- Java (.java)
- C++ (.cpp)

## Project Structure

- `index.ts`: Main entry point and CLI logic
- `LLMHandler.ts`: Handles interactions with Groq API and Gemini API
- `fileHelper.ts`: Utility functions for file and directory operations

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Groq SDK](https://www.groq.com/) for providing the language model API
- [Gemini SDK](https://ai.google.dev/gemini-api/docs) for providing the a secondary language model API
- [Commander.js](https://github.com/tj/commander.js/) for CLI argument parsing
- [Figlet](https://github.com/patorjk/figlet.js) for ASCII art text generation
- [Chalk](https://www.npmjs.com/package/chalk) for terminal styling
- [Ora](https://www.npmjs.com/package/ora) for terminal spinner
- [VHS](https://github.com/charmbracelet/vhs) for making the demo video for the CLI tool
- [TOML](https://github.com/BinaryMuse/toml-node#readme) for parsing the contents of the config file

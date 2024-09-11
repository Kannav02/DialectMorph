# DialectMorph

DialectMorph is a powerful code transpilation tool designed to convert source code from one programming language to another. It leverages the Groq API to perform intelligent code translations while maintaining the original functionality and logic.

## Features

- Supports transpilation between Python, JavaScript, Java, and C++
- Command-line interface for easy usage
- Automatically creates a `transpiledFiles` directory for output
- Utilizes Groq's language model for accurate code conversion

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/DialectMorph.git
   cd DialectMorph
   ```

2. Install dependencies:

   ```
   bun install
   ```

3. Set up your Groq API key:
   - Create a `.env` file in the root directory or follow, an `.env.example` has been created to take a reference from it
   - Add your Groq API key: `GROQ_API_KEY=your_api_key_here`

## Usage

Run DialectMorph using the following command:

```
bun run index.ts <input_files...> -o <output_language>
```

The `input_files` argument can take multiple files at once and is a required argument
the `output_language` argument is also a required argument

Example:

```
bun run index.ts myfile.py -o java
```

This command will transpile `myfile.py` to Java and save the output in the `transpiledFiles` directory.

## Supported Languages

- Python (.py)
- JavaScript (.js)
- Java (.java)
- C++ (.cpp)

## Project Structure

- `index.ts`: Main entry point and CLI logic
- `LLMHandler.ts`: Handles interactions with the Groq API
- `fileHelper.ts`: Utility functions for file and directory operations

## Contributing

Before making any Pull Requests or Pushes to the main branch, make sure to run the following linting scripts to pass the tests set by the CI pipeline

```
bun run format
bun run format:check
```

`format` script here is used to format all of the files to the standards specified by prettier
`format:check` script here is used to check if all of the files have been formatted by prettier

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Groq SDK](https://www.groq.com/) for providing the language model API
- [Commander.js](https://github.com/tj/commander.js/) for CLI argument parsing
- [Figlet](https://github.com/patorjk/figlet.js) for ASCII art text generation

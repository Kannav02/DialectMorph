# Contributing to DialectMorph

Thank you for your interest in contributing to DialectMorph! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/Kannav02/DialectMorph.git
cd DialectMorph
```

2. Install dependencies:
   - Make sure you have bun installed (follow the installation guide)
   - Run `bun install`

## Code Formatting and Quality Standards

Before submitting any Pull Requests or pushing to the main branch, ensure you run the following linting scripts to pass the CI pipeline:

```bash
bun run format      # Format all files according to prettier standards
bun run format:check # Verify all files are properly formatted
```

To lint and check the code use the following commands

```sh
bun run lint

```

The project uses:

Automatic Editor Configuration
We provide automated editor configuration to ensure consistent development experience. The repository includes:

.vscode/settings.json - VS Code workspace settings
.vscode/extensions.json - Recommended VS Code extensions
.prettierrc - Prettier configuration
.eslintrc - ESLint configuration

If you're using VS Code:

The editor will automatically prompt you to install recommended extensions
Workspace settings will be automatically applied
Format-on-save is enabled by default

- Prettier for maintaining consistent code formatting
- ESlint for linting purposes
- CI pipeline for automated testing and quality checks

## Making Changes

1. Create a new branch for your changes
2. Make your changes following the project's code style
3. Run the formatting scripts mentioned above
4. Test your changes thoroughly
5. Submit a Pull Request

## Pull Request Process

1. Ensure your code passes all formatting checks
2. Update the README.md if you've added any new features or changed existing functionality
3. Your PR will be reviewed by maintainers

## Questions or Need Help?

Feel free to open an issue if you have questions or need clarification about contributing to the project.

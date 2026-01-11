# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PTvo is a VS Code extension that provides file preview and translation capabilities. The extension consists of two main features:

1. **Preview Panel**: A side-by-side preview panel that displays the current file's content. When a file is opened, users can click the extension to open a preview view on the right side of the editor.
2. **Translation**: AI-powered translation of the file content, supporting both free and paid Chinese AI services.

## Development Commands

```bash
# Install dependencies
npm install

# Compile the project
npm run compile

# Watch for changes during development
npm run watch

# Run tests
npm run test

# Run the extension in development mode (launch Extension Development Host)
# Press F5 in VS Code or use:
npm run start
```

## Architecture

```
src/
├── extension.ts          # Extension entry point, command registration
├── providers/
│   ├── PreviewProvider.ts    # Webview provider for preview panel
│   └── TranslationProvider.ts # Translation service abstraction
├── services/
│   └── translators/          # AI translator implementations
│       ├── DeepSeekTranslator.ts
│       ├── ZhipuTranslator.ts
│       └── TencentTranslator.ts
└── webview/
    └── preview.html          # Preview panel UI
```

### Key Components

1. **PreviewProvider** (`src/providers/PreviewProvider.ts`)
   - Extends `vscode.WebviewViewProvider`
   - Manages the preview webview panel
   - Handles file content updates and renders content in the webview
   - Communicates between extension and webview via messages

2. **TranslationProvider** (`src/providers/TranslationProvider.ts`)
   - Abstract base class for translation services
   - Defines common interface for all translators
   - Manages API credentials and configuration

3. **Webview Communication**
   - Uses `vscode.WebviewView` for the preview panel
   - Message types: `updateContent`, `translate`, `showError`

## Configuration

Extension settings in `package.json` under `contributes.configuration`:

- `PTvo.translator`: Choose translation service (deepseek, zhipu, tencent)
- `PTvo.apiKey`: API key for the selected translation service
- `PTvo.autoTranslate`: Enable auto-translation on preview open

## Build & Release

```bash
# Package the extension for release
npm run package

# Publish to VS Code Marketplace
vsce publish
```

## Development Workflow

1. Make code changes
2. Run `npm run watch` to compile in watch mode
3. Press F5 to launch Extension Development Host
4. Test the extension in the new VS Code window
5. Check the "Developer: Toggle Developer Tools" for console logs and errors

## Important Notes

- The preview panel uses Webview API - all communication is asynchronous via messages
- File content is passed as text; for binary files, show appropriate error message
- Translation API keys should be stored in VS Code's `secrets` API, not in configuration
- Handle large files by implementing pagination or content truncation

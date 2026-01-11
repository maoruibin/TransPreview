import * as vscode from 'vscode';
import { createTranslationProvider, TranslationConfig } from './TranslationProvider';

export class PreviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'PTvo.previewView';

  private _view?: vscode.WebviewView;
  private _currentDocument?: vscode.TextDocument;

  constructor(
    private readonly _extensionUri: vscode.Uri
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case 'translate':
            await this.translate();
            break;
          case 'ready':
            // Send current content when webview is ready
            if (this._currentDocument) {
              this._sendContentToWebview(this._currentDocument);
            }
            break;
        }
      },
      undefined
    );

    // Load current document content
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      this.updateContent(activeEditor.document);
    }
  }

  public updateContent(document: vscode.TextDocument) {
    this._currentDocument = document;
    if (this._view) {
      this._sendContentToWebview(document);
    }
  }

  public async translate() {
    const config = vscode.workspace.getConfiguration('PTvo');
    const translator = config.get<string>('translator', 'deepseek');
    const apiKey = config.get<string>('apiKey', '');

    if (!apiKey) {
      vscode.window.showErrorMessage('Please set your API key in settings (PTvo.apiKey)');
      return;
    }

    if (this._view && this._currentDocument) {
      const content = this._currentDocument.getText();

      // Show progress indicator
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Translating...',
          cancellable: false
        },
        async (progress) => {
          try {
            const translatedText = await this._callTranslationAPI(
              translator,
              apiKey,
              content
            );

            this._view?.webview.postMessage({
              command: 'updateContent',
              content: translatedText,
              isTranslated: true
            });
          } catch (error) {
            vscode.window.showErrorMessage(
              `Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }
      );
    }
  }

  private async _callTranslationAPI(
    translator: string,
    apiKey: string,
    content: string
  ): Promise<string> {
    const config: TranslationConfig = {
      apiKey: apiKey,
      baseURL: translator === 'zhipu' ? 'https://open.bigmodel.cn/api/paas/v4' : undefined,
      model: translator === 'zhipu' ? 'glm-4-flash' : undefined
    };

    const provider = createTranslationProvider(translator, config);

    // Detect target language based on current document
    const currentLanguage = this._currentDocument?.languageId || '';
    const targetLanguage = this._detectTargetLanguage(currentLanguage);

    return await provider.translate(content, targetLanguage);
  }

  private _detectTargetLanguage(languageId: string): string {
    // If the file is already in a Chinese-like context, translate to English
    // Otherwise translate to Chinese
    const chineseLikePatterns = ['zh', 'chinese', 'csharp'];
    const isChineseLike = chineseLikePatterns.some(p => languageId.toLowerCase().includes(p));

    return isChineseLike ? 'en' : 'zh-CN';
  }

  private _sendContentToWebview(document: vscode.TextDocument) {
    const content = document.getText();
    const fileName = document.fileName.split('/').pop() || 'Untitled';

    this._view?.webview.postMessage({
      command: 'updateContent',
      content: content,
      fileName: fileName,
      language: document.languageId,
      isTranslated: false
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PTvo Preview</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: var(--vscode-editorForeground);
      background-color: var(--vscode-editorGroupHeader-tabsBackground);
      height: 100vh;
      overflow: hidden;
    }

    .container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .header {
      padding: 12px 16px;
      background-color: var(--vscode-editorGroupHeader-tabsBackground);
      border-bottom: 1px solid var(--vscode-panelSection-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .file-name {
      font-weight: 600;
      color: var(--vscode-editorForeground);
    }

    .language-badge {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 3px;
      background-color: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
    }

    .header-right {
      display: flex;
      gap: 8px;
    }

    button {
      padding: 6px 12px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 13px;
      background-color: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    button:hover {
      background-color: var(--vscode-button-hoverBackground);
    }

    button:disabled {
      background-color: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      cursor: not-allowed;
    }

    .content {
      flex: 1;
      overflow: auto;
      padding: 16px;
      background-color: var(--vscode-editor-background);
    }

    .content pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: var(--vscode-editor-font-family);
      font-size: var(--vscode-editor-font-size);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--vscode-descriptionForeground);
      text-align: center;
      padding: 20px;
    }

    .empty-state svg {
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .translated-indicator {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 3px;
      background-color: #28a745;
      color: white;
      display: none;
    }

    .translated-indicator.show {
      display: inline-block;
    }

    .loading {
      display: none;
      text-align: center;
      padding: 40px;
      color: var(--vscode-descriptionForeground);
    }

    .loading.show {
      display: block;
    }

    .spinner {
      border: 3px solid var(--vscode-editorGroupHeader-tabsBackground);
      border-top: 3px solid var(--vscode-button-background);
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <span class="file-name" id="fileName">No file open</span>
        <span class="language-badge" id="languageBadge" style="display: none;"></span>
        <span class="translated-indicator" id="translatedIndicator">Translated</span>
      </div>
      <div class="header-right">
        <button id="translateBtn" title="Translate content">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.5 1.5A1.5 1.5 0 0 0 7 0h-4A1.5 1.5 0 0 0 1.5 1.5v7A1.5 1.5 0 0 0 3 10h4a1.5 1.5 0 0 0 1.5-1.5v-7zM7 1H3a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7A.5.5 0 0 0 7 1zm2.5 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
          </svg>
          Translate
        </button>
      </div>
    </div>
    <div class="content" id="content">
      <div class="empty-state">
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
        </svg>
        <p>Open a file to see its preview here</p>
      </div>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    const contentEl = document.getElementById('content');
    const fileNameEl = document.getElementById('fileName');
    const languageBadgeEl = document.getElementById('languageBadge');
    const translatedIndicatorEl = document.getElementById('translatedIndicator');
    const translateBtn = document.getElementById('translateBtn');

    // Send ready message to extension
    window.addEventListener('load', () => {
      vscode.postMessage({ command: 'ready' });
    });

    // Listen for messages from extension
    window.addEventListener('message', (event) => {
      const message = event.data;

      switch (message.command) {
        case 'updateContent':
          updateContent(message.content, message.fileName, message.language, message.isTranslated);
          break;
      }
    });

    translateBtn.addEventListener('click', () => {
      translateBtn.disabled = true;
      translateBtn.textContent = 'Translating...';
      vscode.postMessage({ command: 'translate' });
    });

    function updateContent(content, fileName, language, isTranslated) {
      fileNameEl.textContent = fileName || 'No file open';

      if (language) {
        languageBadgeEl.textContent = language;
        languageBadgeEl.style.display = 'inline-block';
      } else {
        languageBadgeEl.style.display = 'none';
      }

      if (isTranslated) {
        translatedIndicatorEl.classList.add('show');
      } else {
        translatedIndicatorEl.classList.remove('show');
      }

      if (content) {
        contentEl.innerHTML = '<pre>' + escapeHtml(content) + '</pre>';
      } else {
        contentEl.innerHTML = \`
          <div class="empty-state">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
            </svg>
            <p>This file has no content</p>
          </div>
        \`;
      }

      translateBtn.disabled = false;
      translateBtn.innerHTML = \`
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8.5 1.5A1.5 1.5 0 0 0 7 0h-4A1.5 1.5 0 0 0 1.5 1.5v7A1.5 1.5 0 0 0 3 10h4a1.5 1.5 0 0 0 1.5-1.5v-7zM7 1H3a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7A.5.5 0 0 0 7 1zm2.5 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
        </svg>
        Translate
      \`;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  </script>
</body>
</html>`;
  }
}

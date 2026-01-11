import * as vscode from 'vscode';
import { PreviewPanel } from './providers/PreviewPanel';

let previewPanel: PreviewPanel | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('TransPreview extension is now active!');

  // Register open preview command
  context.subscriptions.push(
    vscode.commands.registerCommand('TransPreview.openPreview', () => {
      if (!previewPanel) {
        previewPanel = new PreviewPanel(context.extensionUri);
        previewPanel.onDidDispose(() => {
          previewPanel = undefined;
        });
      }
      previewPanel.reveal();
    })
  );

  // Register translate command
  context.subscriptions.push(
    vscode.commands.registerCommand('TransPreview.translateContent', () => {
      previewPanel?.translate();
    })
  );

  // Register close preview command
  context.subscriptions.push(
    vscode.commands.registerCommand('TransPreview.closePreview', () => {
      previewPanel?.dispose();
      previewPanel = undefined;
    })
  );

  // Update preview when active editor changes
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && previewPanel && previewPanel.isVisible()) {
        previewPanel.updateContent(editor.document);
      }
    })
  );

  // Update preview when document content changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor && event.document === activeEditor.document) {
        if (previewPanel && previewPanel.isVisible()) {
          previewPanel.updateContent(event.document);
        }
      }
    })
  );
}

export function deactivate() {
  previewPanel?.dispose();
  console.log('TransPreview extension is now deactivated!');
}

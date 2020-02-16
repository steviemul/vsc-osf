import * as vscode from 'vscode';

export class DsAssetContentProvider implements vscode.TextDocumentContentProvider, vscode.Disposable{
  
  private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
  contents: any;

  get onDidChange(): vscode.Event<vscode.Uri> {
    return this._onDidChange.event;
  }

  dispose(): void {
    this._onDidChange.dispose();
  }

  provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
    if (token.isCancellationRequested) { return "Canceled"; }

    if (this.contents) {
      return this.contents[uri.path];
    }
  }
}
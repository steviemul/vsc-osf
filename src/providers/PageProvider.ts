import * as vscode from 'vscode';
import Page from './Page';

export class PageProvider implements vscode.TreeDataProvider<Page> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  pages: Page[];
  
  constructor(private context: vscode.ExtensionContext) {
    this.pages = new Array();

    this.openPage = this.openPage.bind(this);

    this.registerCommands();
  }

  public setData(pages: Page[]) {
    this.pages = pages;

    this._onDidChangeTreeData.fire();
  }

  public async getChildren(page?: Page): Promise<Page[]> {
    return this.pages;
  }

  getTreeItem(page: Page): vscode.TreeItem {
    return page;
  }

  private openPage(location: string) {
    vscode.window.showTextDocument(vscode.Uri.file(location))
  }

  private registerCommands() {
    const subscription = vscode.commands.registerCommand('occ.osf.openPage', this.openPage);

    this.context.subscriptions.push(subscription);
  }
}
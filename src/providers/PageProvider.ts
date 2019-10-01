import * as vscode from 'vscode';
import Page from './Page';

export class PageProvider implements vscode.TreeDataProvider<Page> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  pages: Page[]

  constructor(private context: vscode.ExtensionContext) {
    this.pages = new Array();
  }

  public setData(pages: Page[]) {
    this.pages = pages;

    this._onDidChangeTreeData.fire();
  }

  public async getChildren(page?: Page): Promise<Page[]> {

    let pages: Page[] = [];

    return pages;
  }

  getTreeItem(page: Page): vscode.TreeItem {
    return page;
  }
}
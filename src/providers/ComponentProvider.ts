import * as vscode from 'vscode';
import Component from './Component';

export class ComponentProvider implements vscode.TreeDataProvider<Component> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  components: Component[]

  constructor(private context: vscode.ExtensionContext) {
    this.components = new Array();
  }

  public setData(components: Component[]) {
    this.components = components;

    this._onDidChangeTreeData.fire();
  }

  public async getChildren(component?: Component): Promise<Component[]> {

    let components: Component[] = [];

    return components;
  }

  getTreeItem(component: Component): vscode.TreeItem {
    return component;
  }
}
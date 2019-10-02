import * as vscode from 'vscode';
import Component from './Component';

export class ComponentProvider implements vscode.TreeDataProvider<Component> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  components: Component[];

  constructor(private context: vscode.ExtensionContext) {
    this.components = new Array();
  }

  public setData(components: Component[]) {
    this.components.splice(0);
    this.components.push(...components);
    this._onDidChangeTreeData.fire();
  }

  public async getChildren(component?: Component): Promise<Component[]> {
    return this.components;
  }

  getTreeItem(component: Component): vscode.TreeItem {
    return component;
  }
}
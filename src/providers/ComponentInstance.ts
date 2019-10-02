import * as vscode from 'vscode';
import * as path from 'path';

export default class ComponentInstance extends vscode.TreeItem {

  type: string;
  root: String;
  componentType: String;
  container: boolean = false;

  constructor(
    type: string,
    label: string,
    root: string,
    componentType: String,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.root = root;
    this.componentType = componentType;
    this.contextValue = 'instance';
    this.iconPath = path.join(__filename, '..', '..', '..', 'images/code-fork32x32.png');
  }

}
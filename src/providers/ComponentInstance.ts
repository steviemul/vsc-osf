import * as vscode from 'vscode';
import * as path from 'path';

export default class ComponentInstance extends vscode.TreeItem {

  type: string;
  root: string;
  componentType: string;
  container: boolean = false;

  constructor(
    type: string,
    label: string,
    root: string,
    componentType: string,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.root = root;
    this.componentType = componentType;
    this.contextValue = 'instance';

    this.iconPath = {
      light: path.join(__filename, '..', '..', '..', 'images/dark/code-fork.png'),
      dark: path.join(__filename, '..', '..', '..', 'images/light/code-fork.png')
    };
  }

}
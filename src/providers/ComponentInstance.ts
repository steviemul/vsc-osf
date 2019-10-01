import * as vscode from 'vscode';
import * as path from 'path';

export default class ComponentInstance extends vscode.TreeItem {

  type: string;

  constructor(
    type: string,
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.command = command;
    this.iconPath = path.join(__filename, '..', '..', '..', 'images/flash32x32.png');
  }

}
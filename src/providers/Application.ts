import * as vscode from 'vscode';
import * as path from 'path';

export default class Application extends vscode.TreeItem {

  type: string;
  root: string;
  metadata: object;

  constructor(
    type: string, label: string,
    root: string, metadata: object, 
    collapsibleState: vscode.TreeItemCollapsibleState, command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.root = root;
    this.metadata = metadata;
    this.command = command;
    this.iconPath = path.join(__filename, '..', '..', '..', 'images/cubes.png');
  }

}
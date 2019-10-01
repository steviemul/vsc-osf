import * as vscode from 'vscode';
import * as path from 'path';

export default class Page extends vscode.TreeItem {

  type: string;
  metadata: object;

  constructor(type: string, label: string, metadata: object, collapsibleState: vscode.TreeItemCollapsibleState, command?: vscode.Command) {
    super(label, collapsibleState);
    this.type = type;
    this.metadata = metadata;
    this.command = command;
    this.iconPath = path.join(__filename, '..', '..', '..', 'images/th.png');
  }

}
import * as vscode from 'vscode';
import * as path from 'path';

export default class Environment extends vscode.TreeItem {
  metadata: any;

  constructor(
    label: string,
    metadata: object,
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.metadata = metadata;

    this.command = {
      command: 'occ.osf.selectEnvironment',
      arguments: [this],
      title: 'Select Environment'
    };

    this.iconPath = {
      light: path.join(__filename, '..', '..', '..', 'images/dark/server.png'),
      dark: path.join(__filename, '..', '..', '..', 'images/light/server.png'),
    };
  }

}
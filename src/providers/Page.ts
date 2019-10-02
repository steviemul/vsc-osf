import * as vscode from 'vscode';
import * as path from 'path';

export default class Page extends vscode.TreeItem {

  type: string;
  metadata: object;
  root: string;

  constructor(
    type: string, label: string,
    root: string, metadata: object,
    collapsibleState: vscode.TreeItemCollapsibleState) {

    super(label, collapsibleState);
    this.type = type;
    this.root = root;
    this.metadata = metadata;
    this.command = {
      command: 'occ.osf.openPage',
      arguments: [this.root],
      title: 'Open page'
    };

    this.contextValue = 'page';
    this.iconPath = path.join(__filename, '..', '..', '..', 'images/th.png');
  }

}
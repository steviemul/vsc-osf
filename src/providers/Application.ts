import * as vscode from 'vscode';
import * as path from 'path';

export default class Application extends vscode.TreeItem {

  type: string;
  root: string;
  metadata: any;
  changedResources: vscode.SourceControlResourceGroup;
  
  constructor(
    type: string, label: string,
    root: string, metadata: object, 
    collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.root = root;
    this.metadata = metadata;

    this.command = {
      command: 'occ.osf.selectApplication',
      arguments: [this],
      title: 'Select Application'
    };

    this.iconPath = {
      light: path.join(__filename, '..', '..', '..', 'images/dark/cubes.png'),
      dark: path.join(__filename, '..', '..', '..', 'images/light/cubes.png'),
    };
  }

}
import * as vscode from 'vscode';
import * as path from 'path';
import ComponentInstance from './ComponentInstance';

export default class Component extends vscode.TreeItem {

  type: string;
  metadata: object;
  instances: ComponentInstance[];
  
  constructor(
    type: string, label: string,
    instances: ComponentInstance[], metadata: object,
    collapsibleState: vscode.TreeItemCollapsibleState, command?: vscode.Command) {

    super(label, collapsibleState);
    this.type = type;

    this.metadata = metadata;
    this.command = command;
    this.iconPath = path.join(__filename, '..', '..', '..', 'images/cube.png');

    this.instances = instances;
  }

}
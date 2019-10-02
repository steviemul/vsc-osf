import * as vscode from 'vscode';
import * as path from 'path';

interface IconDefinition {
  [config: string]: string,
  resources: string,
  layout: string
}

const ICONS: IconDefinition = {
  'config': 'cog48x48.png',
  'resources': 'pencil32x32.png',
  'layout': 'th.png'
};

export default class InstanceData extends vscode.TreeItem {

  type: string;
  root: string;

  constructor(
    type: string,
    label: string,
    root: string) {
      
    super(label, vscode.TreeItemCollapsibleState.None);

    this.type = type;
    this.root = root;

    this.iconPath = path.join(__filename, '..', '..', '..', 'images', ICONS[type].toString());

    this.command = {
      command: 'occ.osf.showInstanceData',
      arguments: [path.join(root, type + '.json')],
      title: 'Open data'
    };
  }
}
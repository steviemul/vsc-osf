import * as vscode from 'vscode';
import * as path from 'path';

interface IconDefinition {
  [config: string]: string;
  resources: string;
  layout: string;
}

const ICONS: IconDefinition = {
  'config': 'cog.png',
  'resources': 'font.png',
  'layout': 'th.png',
  'content': 'globe.png',
  'contentItem': 'file-code-o.png'
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
    
    if (this.type === 'content') {
      this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    }
    else {
      const filename = (this.type === 'contentItem') ? label : type + '.json';

      this.command = {
        command: 'occ.osf.showInstanceData',
        arguments: [path.join(root, filename)],
        title: 'Open data'
      };
    }

    this.iconPath = {
      light: path.join(__filename, '..', '..', '..', 'images', 'dark', ICONS[type].toString()),
      dark: path.join(__filename, '..', '..', '..', 'images', 'light', ICONS[type].toString())
    };
  }
}
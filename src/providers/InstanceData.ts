import * as vscode from 'vscode';
import * as path from 'path';

interface IconDefinition {
  [config: string]: string;
  resources: string;
  layout: string;
}

const ICONS: IconDefinition = {
  'config': 'cog48x48.png',
  'resources': 'font32x32.png',
  'layout': 'th.png',
  'content': 'globe32x32.png',
  'contentItem': 'file-code-o32x32.png'
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

    this.iconPath = path.join(__filename, '..', '..', '..', 'images', ICONS[type].toString());
  }
}
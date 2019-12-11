import * as vscode from 'vscode';
import Component from './Component';
import InstanceData from './InstanceData';
import { compareIgnoreCase } from '../utils';
import * as fs from 'fs';
import * as path from 'path';

export class ComponentProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  components: Component[];

  constructor(private context: vscode.ExtensionContext) {
    this.components = new Array();

    this.showInstanceData = this.showInstanceData.bind(this);

    this.registerCommands();
  }

  public setData(components: Component[]) {
    this.components.splice(0);
    this.components.push(...components);
    this._onDidChangeTreeData.fire();
  }

  public async getChildren(item?: Component): Promise<vscode.TreeItem[]> {

    if (item === undefined) {
      return this.components.sort(compareIgnoreCase);
    }

    if (item.instances) {
      return item.instances;
    }

    if (item.type === 'instance') {
      return this.getInstanceChildren(item);
    }

    return [];
  }

  private getInstanceChildren(item: any) :InstanceData[] {

    const instanceData: InstanceData[] = [];

    instanceData.push(
      new InstanceData('config', 'config', item.root),
      new InstanceData('resources', 'resources', item.root)
    );
    
    if (item.container) {
      instanceData.push(new InstanceData('layout', 'layout', item.root));
    }

    if (fs.existsSync(path.join(item.root, 'content'))) {
      instanceData.push(new InstanceData('content', 'content', item.root));
    }

    return instanceData;
  }

  getTreeItem(component: Component): vscode.TreeItem {
    return component;
  }

  private showInstanceData(location: string) {
    if (!fs.existsSync(location)) {
      const data = {};

      fs.writeFileSync(location, JSON.stringify(data, null, 2), 'utf8');
    }

    vscode.window.showTextDocument(vscode.Uri.file(location));
  }

  private registerCommands() {
    const subscription = vscode.commands.registerCommand('occ.osf.showInstanceData', this.showInstanceData);

    this.context.subscriptions.push(subscription);
  }
}
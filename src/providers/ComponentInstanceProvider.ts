import * as vscode from 'vscode';
import ComponentInstance from './ComponentInstance';
import InstanceData from './InstanceData';

export class ComponentInstanceProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  instances: ComponentInstance[];

  constructor(private context: vscode.ExtensionContext) {
    this.instances = new Array();
  }

  private getInstanceChildren(item: any): InstanceData[] {

    const instanceData: InstanceData[] = [];

    instanceData.push(
      new InstanceData('config', 'config', item.root),
      new InstanceData('resources', 'resources', item.root)
    );

    if (item.container) {
      instanceData.push(new InstanceData('layout', 'layout', item.root));
    }
    return instanceData;
  }

  public setData(instances: ComponentInstance[]) {

    this.instances.splice(0);
    this.instances.push(...instances);
    this._onDidChangeTreeData.fire();
  }

  public async getChildren(item?: ComponentInstance): Promise<vscode.TreeItem[]> {

    if (item === undefined) {
      return this.instances;
    }

    if (item.type === 'instance') {
      return this.getInstanceChildren(item);
    }

    return [];
  }

  getTreeItem(instance: ComponentInstance): vscode.TreeItem {
    return instance;
  }
}
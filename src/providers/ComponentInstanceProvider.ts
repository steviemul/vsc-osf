import * as vscode from 'vscode';
import ComponentInstance from './ComponentInstance';
import InstanceData from './InstanceData';
import {compareIgnoreCase} from '../utils';
import * as fs from 'fs-extra';
import * as path from 'path';

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

    const children = fs.readdirSync(item.root);

    children.forEach(child => {
      if (fs.lstatSync(path.join(item.root, child)).isDirectory()) {
        instanceData.push(new InstanceData('content', child, item.root));  
      }
    });

    return instanceData;
  }

  private getContentChildren(item: any): InstanceData[] {

    const instanceData: InstanceData[] = [];

    const children = fs.readdirSync(item.root);
    
    children.forEach(child => {
      if (fs.lstatSync(path.join(item.root, child)).isDirectory()) {
        const files = fs.readdirSync(path.join(item.root, child));

        files.forEach(file => {
          instanceData.push(new InstanceData('contentItem', file, path.join(item.root, child)));
        });
      }
    });

    return instanceData;
  }

  public setData(instances: ComponentInstance[]) {

    this.instances.splice(0);
    this.instances.push(...instances);
    this._onDidChangeTreeData.fire();
  }

  public async getChildren(item?: ComponentInstance): Promise<vscode.TreeItem[]> {

    if (item === undefined) {
      return this.instances.sort(compareIgnoreCase);
    }

    if (item.type === 'instance') {
      return this.getInstanceChildren(item);
    }

    if (item.type === 'content') {
      return this.getContentChildren(item);
    }
    
    return [];
  }

  getTreeItem(instance: ComponentInstance): vscode.TreeItem {
    return instance;
  }
}
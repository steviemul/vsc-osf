import * as vscode from 'vscode';
import ComponentInstance from './ComponentInstance';
import * as fs from 'fs-extra';
import * as path from 'path';
import Environment from './Environment';

export class EnvironmentProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  environments: Environment[];

  constructor(private context: vscode.ExtensionContext) {
    this.environments = new Array();

    this.update();
  }

  public update() {
    const environments: Environment[] = [];
    const configPath = path.join(vscode.workspace.rootPath, '.occ', 'config');

    try {
      const config = require(configPath);

      const serverConfig = config.serverConfig;

      for (const env in serverConfig) {
        environments.push(
          new Environment(
            env, 
            serverConfig[env],
            vscode.TreeItemCollapsibleState.None
          )
        );
      }

      console.info('Config loaded successfully', config);
    }
    catch (e) {
      console.error('Error loading config', e);
    }

    this.setData(environments);
  }

  public setData(environments: Environment[]) {

    this.environments.splice(0);
    this.environments.push(...environments);
    this._onDidChangeTreeData.fire();
  }

  public async getChildren(item?: Environment): Promise<vscode.TreeItem[]> {
    return this.environments;
  }

  getTreeItem(environment: Environment): vscode.TreeItem {
    return environment;
  }
}
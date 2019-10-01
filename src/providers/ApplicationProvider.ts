import * as vscode from 'vscode';
import Application from './Application';
import {ComponentProvider} from './ComponentProvider';
import {PageProvider} from './PageProvider';

export class ApplicationProvider implements vscode.TreeDataProvider<Application> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  applications: object;
  componentProvider: ComponentProvider;

  constructor(private context: vscode.ExtensionContext) {
    this.applications = new Array();
    this.componentProvider = new ComponentProvider(context);
  }

  public setData(applications: object) {
    this.applications = applications;

    this._onDidChangeTreeData.fire();
  }

  public getComponentProvider() :ComponentProvider {
    return this.componentProvider;
  }
  
  public async getChildren(application?: Application): Promise<Application[]> {

    let applications: Application[] = [];

    Object.values(this.applications).forEach((application: any) => {
      applications.push(
        new Application(
          'application',
          application.metadata.name, 
          application.root, 
          application.metadata, 
          vscode.TreeItemCollapsibleState.None
        )
      );
    });

    return applications;
  }

  getTreeItem(application: Application): vscode.TreeItem {
    return application;
  }
}
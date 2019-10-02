import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import Application from './Application';
import {ComponentProvider} from './ComponentProvider';
import Component from './Component';
import {PageProvider} from './PageProvider';
import Page from './Page';
import { readJson } from '../utils';
import ComponentInstance from './ComponentInstance';

export class ApplicationProvider implements vscode.TreeDataProvider<Application> {

  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  applications: object;
  componentProvider: ComponentProvider;
  pageProvider: PageProvider;
  context: vscode.ExtensionContext;
  selectedApplication: Application | undefined;

  constructor(context: vscode.ExtensionContext) {
    this.applications = new Array();
    this.context = context;
    this.componentProvider = new ComponentProvider(context);
    this.pageProvider = new PageProvider(context);
    this.selectApplication = this.selectApplication.bind(this);

    this.registerCommands();
  }

  private getPagesForApplication(application: Application) {

    const location = path.join(application.root, 'assets', 'pages');
    const pages: Page[] = [];

    if (fs.existsSync(location)) {
      const pageFiles = fs.readdirSync(location);

      pageFiles.forEach((pageFile) => {
        const pageLocation = path.join(location, pageFile);

        const pageJson = readJson(pageLocation);

        pages.push(
          new Page(
            'page', 
            pageJson.title, 
            pageLocation,
            pageJson,
            vscode.TreeItemCollapsibleState.None
          )
        );
      });
    }

    return pages;
  }

  private getComponentInstancesForApplication(application: Application) :ComponentInstance[] {

    const instances: ComponentInstance[] = [];

    const location = path.join(application.root, 'assets', 'components');

    if (fs.existsSync(location)) {
      const children = fs.readdirSync(location);

      children.forEach((child) => {
        const componentLocation = path.join(location, child, 'index.json');

        if (fs.existsSync(componentLocation)) {
          const metadata = readJson(componentLocation);

          instances.push(
            new ComponentInstance(
              'instance',
              child,
              path.join(location, child),
              metadata.type,
              vscode.TreeItemCollapsibleState.Collapsed
            )
          )
        }
      });
    }

    return instances;
  }

  private getComponentInstancesForType(instances: ComponentInstance[], component: string) :ComponentInstance[] {
    return instances.filter((instance) => {
      return instance.componentType === component;
    });
  }

  private selectApplication(application: Application) {

    this.selectedApplication = application;

    const componentMetadata = application.metadata.components;

    const instances = this.getComponentInstancesForApplication(application);

    const components: Component[] = [];

    Object.keys(componentMetadata).forEach((component) => {
      const instancesForType = this.getComponentInstancesForType(instances, component);

      instancesForType.forEach((instance) => {
        instance.container = (componentMetadata[component].type === 'container');
      });

      components.push(
        new Component(
          'component', 
          component,
          instancesForType,
          componentMetadata[component],
          (instancesForType.length) > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
        )
      );
    });

    const pages = this.getPagesForApplication(application);

    this.pageProvider.setData(pages);
    this.componentProvider.setData(components);
  }

  private registerCommands() {
    const subscription = vscode.commands.registerCommand('occ.osf.selectApplication', this.selectApplication);

    this.context.subscriptions.push(subscription);
  }

  public refresh() {

    if (this.selectedApplication) {
      this.selectApplication(this.selectedApplication);
    }
  }

  public setData(applications: object) {
    this.applications = applications;

    this._onDidChangeTreeData.fire();
  }

  public getComponentProvider() :ComponentProvider {
    return this.componentProvider;
  }
  
  public getPageProvider() :PageProvider {
    return this.pageProvider;
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
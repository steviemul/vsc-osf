import * as vscode from 'vscode';
import { ApplicationProvider } from '../providers/ApplicationProvider';
import Environment from '../providers/Environment';
import AssetsSourceProvider from '../scm/AssetsSourceProvider';

export default class EnvironmentCommands {

  context: vscode.ExtensionContext;
  dataProvider: ApplicationProvider;
  scmProviders: any;

  constructor(context: vscode.ExtensionContext, dataProvider: ApplicationProvider) {
    this.context = context;
    this.dataProvider = dataProvider;
    this.scmProviders = {};
  }

  register() {

    const selectSubscription = vscode.commands.registerCommand('occ.osf.selectEnvironment', (env: Environment) => {
      const scmProvider: AssetsSourceProvider = this.scmProviders[env.label] || new AssetsSourceProvider(env, this.dataProvider);

      this.scmProviders[env.label] = scmProvider;

      scmProvider.update();
    });

    this.context.subscriptions.push(selectSubscription);
  }
}
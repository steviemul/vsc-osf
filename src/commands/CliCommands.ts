import * as vscode from 'vscode';
import Application from '../providers/Application';

export default class CliCommands {

  context: vscode.ExtensionContext;
  occTerminal: vscode.Terminal;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.occTerminal = vscode.window.createTerminal('OCC');
  }

  register() {

    const deploySubscription = vscode.commands.registerCommand('occ.osf.deployApp', (application: Application) => {
      this.occTerminal.show();
      this.occTerminal.sendText('yarn deploy --noBuild ' + application.metadata.name);
    });

    this.context.subscriptions.push(deploySubscription);

  }
}
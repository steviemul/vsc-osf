import * as vscode from 'vscode';
import Application from '../providers/Application';

export default class CliCommands {

  context: vscode.ExtensionContext;
  occTerminal: vscode.Terminal;
  occServerTerminal: vscode.Terminal;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.occTerminal = vscode.window.createTerminal('OCC');
    this.occServerTerminal = vscode.window.createTerminal({
      name: 'OCC Node Server',
      env: {
        HTTP_PORT: vscode.workspace.getConfiguration('occ.server').get('http.port') as string,
        HTTPS_PORT: vscode.workspace.getConfiguration('occ.server').get('https.port') as string
      }
    });
  }

  register() {

    const deploySubscription = vscode.commands.registerCommand('occ.osf.deployApp', (application: Application) => {
      const name = application ? application.metadata.name : '';
      
      this.occTerminal.show();
      this.occTerminal.sendText(`yarn delete ${name} && yarn deploy --noBuild ${name}`);
    });

    const buildSubscription = vscode.commands.registerCommand('occ.osf.buildApp', (application: Application) => {
      const name = application ? application.metadata.name : '';
      this.occTerminal.show();
      this.occTerminal.sendText(`yarn build ${name} && yarn output`);
    });

    this.context.subscriptions.push(deploySubscription);
    this.context.subscriptions.push(buildSubscription);
  }
}
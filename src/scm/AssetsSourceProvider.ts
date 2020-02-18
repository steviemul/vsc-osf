import * as vscode from 'vscode';
import Environment from '../providers/Environment';
import { ApplicationProvider } from '../providers/ApplicationProvider';
import { Change, getChangedResources } from './Comparator';
import Services from '../net/Services';
import Application from '../providers/Application';
import { DsAssetRepository } from './DsAssetRepository';
import { DsAssetContentProvider } from './DsAssetContentProvider';

export default class AssetsSourceProvider {
  
  private context: vscode.ExtensionContext;
  private sourceControl: vscode.SourceControl[];
  private applicationProvider: ApplicationProvider;
  private selectedEnv: Environment;
  private services: Services;
  private terminal: vscode.Terminal;
  private repository: DsAssetRepository;
  private contentProvider: DsAssetContentProvider;

  constructor(
    context: vscode.ExtensionContext, 
    applicationProvider: ApplicationProvider
  ) {
    this.context = context;
    this.applicationProvider = applicationProvider;
    this.services =  new Services();
    this.sourceControl = new Array();

    this.terminal = vscode.window.createTerminal('OCC SCM');

    this.repository = new DsAssetRepository();
    this.contentProvider = new DsAssetContentProvider();

    this.selectedEnv = applicationProvider.environmentProvider.environments[0];
    
    Object.values(this.applicationProvider.applications).forEach(app => {
      const id = `occ.ds.assets.${app.metadata.name}`;
      const label = `${app.metadata.name}`;
      const sourceControl = vscode.scm.createSourceControl(id, label);
      
      sourceControl.quickDiffProvider = this.repository;

      this.updateCommands(sourceControl, app);

      app.changedResources = sourceControl.createResourceGroup(app.metadata.name, 'CHANGES');

      this.sourceControl.push(sourceControl);
    });

    this.registerCommands();
  }

  updateSourceControlCommands() {
    this.sourceControl.forEach((sc: vscode.SourceControl, index: number) => {
      const app: any = Object.values(this.applicationProvider.applications)[index];

      this.updateCommands(sc, app);
    });
  }

  updateCommands(sc: vscode.SourceControl, app: Application) {

    sc.statusBarCommands = [
      {
        "command": "occ.osf.selectEnvironment",
        "title": "$(git-branch) " + this.selectedEnv.metadata.appServerAdmin,
        "tooltip": "Select another remote environment"
      },
      {
        "command": "occ.osf.syncAppUp",
        "title": "$(arrow-up)",
        "tooltip": "Upload app",
        "arguments": [sc, app]
      },
      {
        "command": "occ.osf.syncAppDown",
        "title": "$(arrow-down)",
        "tooltip": "Download application assets",
        "arguments": [sc, app]
      },
      {
        "command": "occ.osf.syncApp",
        "title": "$(compare-changes)",
        "tooltip": "Compare local with remote app",
        "arguments": [sc, app]
      }
    ];
  }

  registerCommands() {

    const selectEnvSubscription = vscode.commands.registerCommand('occ.osf.selectEnvironment', async () => {
      
      const envs = this.applicationProvider.environmentProvider.environments;

      const labels = envs.map((env: Environment) => {
        return env.metadata.appServerAdmin;
      });

      const selectedEnv = await vscode.window.showQuickPick(labels);

      this.selectedEnv = envs.find((env: Environment) => {
        return env.metadata.appServerAdmin === selectedEnv;
      });

      this.updateSourceControlCommands();
    });

    const syncAppSubscription = vscode.commands.registerCommand('occ.osf.syncApp', async (sc: vscode.SourceControl, app: Application) => {

      const appContents = await this.services.getApplicationContents(app, this.selectedEnv);

      this.contentProvider.contents = appContents;
      
      const changes: Change[] = getChangedResources(app, appContents);

      const resourceChanges: vscode.SourceControlResourceState[] = new Array();

      changes.forEach((change: Change) => {

        const remoteUri = vscode.Uri.parse(`dsAsset:${change.remotePath}`);
        const localUri = vscode.Uri.file(change.path);

        const command: vscode.Command = (change.type === 1)
          ? {
            title: "Show changes",
            command: "vscode.diff",
            arguments: [remoteUri, localUri, `${change.remotePath} ↔ Remote changes (${this.selectedEnv.label})`],
            tooltip: "Diff your changes"
          }
          : null;

        const resourceState: vscode.SourceControlResourceState = {
          resourceUri: localUri,
          command
        };

        resourceChanges.push(resourceState);
      });  
      
      app.changedResources.resourceStates = resourceChanges;
    });

    const syncAppUpSubscription = vscode.commands.registerCommand('occ.osf.syncAppUp', (sc: vscode.SourceControl, app: Application) => {
      this.terminal.show();

      const command = `yarn deploy --noBuild --reset --serverEnv=${this.selectedEnv.label} ${app.metadata.name}`;

      this.terminal.sendText(command);
    });

    const syncAppDownSubscription = vscode.commands.registerCommand('occ.osf.syncAppDown', (sc: vscode.SourceControl, app: Application) => {
      this.terminal.show();

      const command = `yarn download-assets --serverEnv=${this.selectedEnv.label} ${app.metadata.name}`;

      this.terminal.sendText(command);
    });

    const contentProviderSubscribtion = vscode.workspace.registerTextDocumentContentProvider('dsAsset', this.contentProvider);

    this.context.subscriptions.push(selectEnvSubscription);
    this.context.subscriptions.push(syncAppSubscription);
    this.context.subscriptions.push(syncAppUpSubscription);
    this.context.subscriptions.push(contentProviderSubscribtion);
  }

}
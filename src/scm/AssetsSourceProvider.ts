import * as vscode from 'vscode';
import Environment from '../providers/Environment';
import { ApplicationProvider } from '../providers/ApplicationProvider';
import Services from '../net/Services';

export default class AssetsSourceProvider {

  sourceControl: vscode.SourceControl;
  applicationProvider: ApplicationProvider;
  env: Environment;
  services: Services;

  constructor(
    env: Environment,
    applicationProvider: ApplicationProvider
  ) {
    this.env = env;
    this.applicationProvider = applicationProvider;
    this.services =  new Services();

    const id = `occ.ds.assets.${this.env.label}`;
    const label = `Design Studio Assets (${this.env.label})`;

    this.sourceControl = vscode.scm.createSourceControl(id, label);
  }

  async update() {
    const appContents = await this.services.getApplicationContents(this.applicationProvider.selectedApplication, this.env);

    console.log(appContents);
  }
}
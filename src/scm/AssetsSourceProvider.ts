import * as vscode from 'vscode';

export default class AssetsSourceProvider {

  sourceControl: vscode.SourceControl;

  register() {
    this.sourceControl = vscode.scm.createSourceControl('occ.ds.assets', 'OCC DS Assets');
  }
}
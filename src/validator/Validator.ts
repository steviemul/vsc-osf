import * as vscode from 'vscode';
import * as glob from 'glob';
import { ApplicationProvider } from '../providers/ApplicationProvider';

export default class Validator {

  context: vscode.ExtensionContext;
  dataProvider: ApplicationProvider;

  constructor(context: vscode.ExtensionContext, dataProvider: ApplicationProvider) {
    this.context = context;
    this.dataProvider = dataProvider;
  }

  register () {
    
    vscode.workspace.onDidSaveTextDocument( (document: vscode.TextDocument) => {
      console.log(document);
    });
  }
}
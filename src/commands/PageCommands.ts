import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { getAppRoot } from '../data';

const titleCase = (str: string) => {

  const parts: string[] = str.toLowerCase().split(' ');

  let final = [];

  for (let word of parts) {
    final.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  }

  return final.join(' ');

}

const readJson = (location: string) => {
  if (fs.existsSync(location)) {
    const json: string = fs.readFileSync(location, 'utf8');

    return JSON.parse(json);
  }
};

async function createPageDefinition (fileLocation: string, extensionRoot: string) {
  
  const name = await vscode.window.showInputBox({
    prompt: 'Page Name'
  });

  if (name) {
    const appRoot = getAppRoot(fileLocation);

    const pageDesination = path.join(appRoot || '', 'assets', 'pages');

    fs.ensureDirSync(pageDesination);

    const pageDefinitionLocation = path.join(pageDesination, name.toLowerCase() + '.json');

    if (fs.existsSync(pageDefinitionLocation)) {
      vscode.window.showErrorMessage('Page definition ' + name + ' already exists');
    }
    else {
      const defaultDefinitionLocation = path.join(extensionRoot, 'json', 'pageDefinition.json');

      const pageDefinition = readJson(defaultDefinitionLocation);

      pageDefinition.title = titleCase(name + ' page');
      pageDefinition.address = '/' + name;
      pageDefinition.shortName = name;

      fs.writeFileSync(pageDefinitionLocation, JSON.stringify(pageDefinition, null, 2), 'utf8');
      
      vscode.window.showTextDocument(vscode.Uri.file(pageDefinitionLocation));
    }
  }
}

export default class PageCommands {

  context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  register() {

    const createSubscription = vscode.commands.registerCommand('occ.osf.createPage', () => {
      const activeEditor = vscode.window.activeTextEditor;

      if (activeEditor) {
        const activeDoc = activeEditor.document;

        if (activeDoc) {
          createPageDefinition(activeDoc.fileName, this.context.extensionPath);
        }
      }
    });

    this.context.subscriptions.push(createSubscription);
  }
}
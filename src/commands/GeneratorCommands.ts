import * as vscode from 'vscode';
import { getTargetAssetLocation } from '../data';
import { ApplicationProvider } from '../providers/ApplicationProvider';
import {pascalCase, paramCase} from 'change-case';

import * as fs from 'fs-extra';
import * as path from 'path';

async function copy(src: string, destination: string, visit: Function)  {

  const files = fs.readdirSync(src);

  files.forEach(file => {
    const location = path.join(src, file);

    const stat = fs.statSync(location);

    if (stat.isFile()) {
      const contents = fs.readFileSync(location, 'utf8');

      fs.mkdirpSync(destination);

      const target = path.join(destination, file);

      fs.writeFileSync(target, visit(contents), 'utf8')
    }
    else if (stat.isDirectory()) {
      copy(path.join(src, file), path.join(destination, file), visit);
    }
  });
};

async function outputComponent (extensionPath: string, name: string, appPath: string) {

  const componentFolder = paramCase(name);
  const componentName = pascalCase(name);

  const componentPath = path.join(appPath, 'src', 'components', componentFolder);

  fs.mkdirpSync(componentPath);

  const templatePath = path.join(extensionPath, 'templates', 'component');

  copy(templatePath, componentPath, (contents: string) => {
    const search = new RegExp('SampleComponent', 'g');
    return contents.replace(search, componentName);
  });
}

async function addBoilerplate(name: string, fileLocation: string) {

  const index = path.join(fileLocation, 'src', 'components', 'index.js');
  const meta = path.join(fileLocation, 'src', 'components', 'meta.js');

  if (fs.existsSync(index)) {
    const line = `export const ${pascalCase(name)} = () => import('./${paramCase(name)}');\n`

    fs.appendFileSync(index, line, 'utf8');
  }

  if (fs.existsSync(meta)) {
    const line = `export * from './${paramCase(name)}/meta';\n`

    fs.appendFileSync(meta, line, 'utf8');
  }
}

async function generateComponent (extensionPath: string) {

  const fileLocation = await getTargetAssetLocation();

  console.log(fileLocation);

  if (fileLocation && fs.existsSync(fileLocation)) {
    const name = await vscode.window.showInputBox({
      prompt: 'New Component type name'
    });

    if (name) {
      await outputComponent(extensionPath, name, fileLocation);
    }  

    addBoilerplate(name, fileLocation);

    const componentPath = path.join(fileLocation, 'src', 'components', paramCase(name), 'index.js');

    vscode.window.showTextDocument(vscode.Uri.file(componentPath));
  }
}

export default class GeneratorCommands {

  context: vscode.ExtensionContext;
  dataProvider: ApplicationProvider;

  constructor(context: vscode.ExtensionContext, dataProvider: ApplicationProvider) {
    this.context = context;
    this.dataProvider = dataProvider;
  }

  register() {

    const createComponentTypeSubscription = vscode.commands.registerCommand('occ.osf.createComponentType', () => {
      generateComponent(this.context.extensionPath);  
    });

    this.context.subscriptions.push(createComponentTypeSubscription);
  }
}
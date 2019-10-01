import * as vscode from 'vscode';
import { getComponentsForContainingApp, getAppRoot, getTargetAssetLocation } from '../data';
import * as fs from 'fs-extra';
import * as path from 'path';

const outputMetaFile = (filename: string, contents: Object) => {
  fs.writeFileSync(filename, JSON.stringify(contents, null, 2), 'utf8');
};

async function createComponentInstance() {

  const fileLocation = await getTargetAssetLocation();
  const appJson = getComponentsForContainingApp(fileLocation);

  if (appJson) {

    const type = await vscode.window.showQuickPick(
      Object.keys(appJson.components), {
      placeHolder: 'Select component type'
    });

    if (type) {
      const name = await vscode.window.showInputBox({
        prompt: 'Component instance name'
      });

      if (name) {
        const appRoot = getAppRoot(fileLocation);
        
        if (appRoot) {
          const componentsLocation = path.join(appRoot, 'assets', 'components');

          fs.ensureDirSync(componentsLocation);

          const instanceLocation = path.join(componentsLocation, name);

          if (fs.existsSync(instanceLocation)) {
            vscode.window.showErrorMessage(`Instance ${name} already exists`);
          }
          else {
            const appJson = getComponentsForContainingApp(fileLocation);

            fs.ensureDirSync(instanceLocation);

            const instanceMetaLocation = path.join(instanceLocation, 'index.json');
            const instanceMeta = {
              type: type
            };

            outputMetaFile(instanceMetaLocation, instanceMeta);

            const typeDefinition = appJson.components[type];

            if (typeDefinition.type === 'container') {
              const layoutMeta = {regions: [{
                width:12,
                components: []
              }]};

              const layoutMetaLocation = path.join(instanceLocation, 'layout.json');
              outputMetaFile(layoutMetaLocation, layoutMeta);
            }

            const resourcesMetaLocation = path.join(instanceLocation, 'resources.json');

            const resources = typeDefinition.resources 
              ? 
                typeDefinition.resources :
              { 'sampleResouce1': 'sampleValue1' };

            outputMetaFile(resourcesMetaLocation, resources);

            const configMetaLocation = path.join(instanceLocation, 'config.json');
            const config = { 'sampleConfig': 'sampleConfigValue1' };

            outputMetaFile(configMetaLocation, config);

            vscode.window.showTextDocument(vscode.Uri.file(instanceMetaLocation));
          }
        }
      }
    }
  }
  

}

export default class ComponentCommands {

  context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  register() {

    const createSubscription = vscode.commands.registerCommand('occ.osf.createInstance', () => {
      createComponentInstance();
    });

    this.context.subscriptions.push(createSubscription);
  }
}
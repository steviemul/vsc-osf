import * as vscode from 'vscode';
import { getComponentsForContainingApp, getAppRoot, getTargetAssetLocation } from '../data';
import * as fs from 'fs-extra';
import * as path from 'path';
import ComponentInstance from '../providers/ComponentInstance';
import { ApplicationProvider } from '../providers/ApplicationProvider';

const outputMetaFile = (filename: string, contents: Object) => {
  fs.writeFileSync(filename, JSON.stringify(contents, null, 2), 'utf8');
};

const generateConfig = (component: any): any | undefined => {

  if (component.config) {
    if (component.config.properties) {
      const config: any = {};

      component.config.properties.forEach((property: any) => {
        config[property.id] = property.defaultValue || ''
      });

      return config;
    }
  }

  return { 'sampleConfig': 'sampleConfigValue1' };
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

            const components: any[] = [];

            if (typeDefinition.type === 'container') {
              const layoutMeta = {regions: [{
                width:12,
                components: components
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
            const config = generateConfig(typeDefinition);

            outputMetaFile(configMetaLocation, config);

            vscode.window.showTextDocument(vscode.Uri.file(instanceMetaLocation));
          }
        }
      }
    }
  }
}

const updateReferences = (fileLocation: string, oldRef: string, newRef: string) => {
 
  if (fs.existsSync(fileLocation)) {
    console.info(fileLocation + " : " + oldRef + " -> " + newRef);

    const contents = fs.readFileSync(fileLocation, 'utf8');
    const replacement = new RegExp(oldRef, 'g');

    const replaced = contents.replace(replacement, newRef);

    fs.writeFileSync(fileLocation, replaced, 'utf8');
  }
};

async function renameComponentInstance(renamedInstance: any, dataProvider: ApplicationProvider) {

  const name = await vscode.window.showInputBox({
    prompt: 'New Component instance name'
  });

  if (name) {
    const newPath = renamedInstance.root.replace(renamedInstance.label, name);

    if  (fs.existsSync(newPath)) {
      vscode.window.showInformationMessage('Instance ' + name + ' already exists, reusing existing instance.');
    }
    else {
      fs.moveSync(renamedInstance.root, newPath);
    }
    
    const pages = dataProvider.pageProvider.pages;

    pages.forEach(page => {
      updateReferences(page.root, renamedInstance.label, name);
    });

    const instances: ComponentInstance[] = dataProvider.componentInstanceProvider.instances;

    instances.forEach((instance : ComponentInstance) => {
      if (instance.container === true && instance.label !== name) {
        const layoutPath = path.join(instance.root, 'layout.json');
        updateReferences(layoutPath, renamedInstance.label, name);   
      }
    });
    
  }
}

export default class ComponentCommands {

  context: vscode.ExtensionContext;
  dataProvider: ApplicationProvider;

  constructor(context: vscode.ExtensionContext, dataProvider: ApplicationProvider) {
    this.context = context;
    this.dataProvider = dataProvider;
  }

  register() {

    const createSubscription = vscode.commands.registerCommand('occ.osf.createInstance', () => {
      createComponentInstance().then(() => {
        this.dataProvider.refresh();      
      });
    });

    const deleteSubscription = vscode.commands.registerCommand('occ.osf.deleteInstance', (item: any) => {
      fs.removeSync(item.root);
      this.dataProvider.refresh();
    });

    const renameSubscription = vscode.commands.registerCommand('occ.osf.renameInstance', (item: any) => {
      renameComponentInstance(item, this.dataProvider).then(() => {
        this.dataProvider.refresh();
      });
    });

    this.context.subscriptions.push(createSubscription);
    this.context.subscriptions.push(deleteSubscription);
    this.context.subscriptions.push(renameSubscription);
  }
}
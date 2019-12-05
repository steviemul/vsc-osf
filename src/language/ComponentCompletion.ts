import * as vscode from "vscode";
import {getComponentsForContainingApp} from '../data';
import {getNearestProperty} from '../parser';

const TYPE_PROPERTY = 'type';
const COMPONENTS_PROPERTY = 'components';

const createComponentCompletionProvider = () => {

  return {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
      const components: vscode.CompletionItem[] = [];

      const includeInstances = !document.fileName.endsWith('index.json');

      const nearestProperty = getNearestProperty(document, position.line);

      let shouldSuggest = false;

      if  (document.fileName.endsWith('index.json')) {
        shouldSuggest = (TYPE_PROPERTY === nearestProperty);
      }
      else {
        shouldSuggest = (COMPONENTS_PROPERTY === nearestProperty);
      }
     
      if (shouldSuggest) {
        const appDetails = getComponentsForContainingApp(document.fileName, includeInstances);

        if (appDetails) {
          const componentNames = Object.keys(appDetails.components);

          for (let componentName of componentNames) {
            const componentCompletion = new vscode.CompletionItem(componentName);

            componentCompletion.insertText = `"${componentName}"`;
            
            components.push(componentCompletion);
          }
        }
      }

      // return all completion items as array
      return components;
    }
  };
};

export default class ComponentCompletion {

  apps: any;
  layoutComponentProvider: vscode.CompletionItemProvider;

  constructor() {
    this.apps = {};
    this.layoutComponentProvider = createComponentCompletionProvider();
  }

  activate() {
    const selectors = [
      { language: 'json', pattern: '**/pages/*.json' },
      { language: 'json', pattern: '**/pages/**/*.json' },
      { language: 'json', pattern: '**/assets/components/*/layout.json' },
      { language: 'json', pattern: '**/assets/components/*/index.json' }
    ];

    vscode.languages.registerCompletionItemProvider(selectors, this.layoutComponentProvider);
  }
}
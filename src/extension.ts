import * as vscode from 'vscode';
import * as glob from 'glob';
import ComponentCompletion from './language/ComponentCompletion';
import ComponentCommands from './commands/ComponentCommands';
import GeneratorCommands from './commands/GeneratorCommands';
import PageCommands from './commands/PageCommands';
import {ApplicationProvider} from './providers/ApplicationProvider';
import {setApplicationInformationFromFiles, APPS} from './data/applications';

const APP_JSON_PATTERN = '**/app.json';

export function activate(context: vscode.ExtensionContext) {

	const applicationProvider = new ApplicationProvider(context);

	const componentCommands = new ComponentCommands(context, applicationProvider);

	componentCommands.register();

	const pageCommands = new PageCommands(context, applicationProvider);

	pageCommands.register();
	
	const generatorCommands = new GeneratorCommands(context, applicationProvider);

	generatorCommands.register();

	const componentCompletion = new ComponentCompletion();
	
	const workspaceRoot = vscode.workspace.rootPath;

	glob(APP_JSON_PATTERN, {
		cwd: workspaceRoot,
		ignore: ['node_modules'],
		dot: true
	}, (err, files) => {
		if (files && files.length > 0) {
			setApplicationInformationFromFiles(workspaceRoot, files);
			componentCompletion.activate();

			applicationProvider.setData(APPS);
			
			vscode.window.registerTreeDataProvider('occ.osf.apps', applicationProvider);
			vscode.window.registerTreeDataProvider('occ.osf.pages', applicationProvider.pageProvider);
			vscode.window.registerTreeDataProvider('occ.osf.components', applicationProvider.componentProvider);
			vscode.window.registerTreeDataProvider('occ.osf.components.instances', applicationProvider.componentInstanceProvider);
		}
	});	

}

// this method is called when your extension is deactivated
export function deactivate() {}

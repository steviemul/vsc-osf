import * as vscode from 'vscode';
import * as glob from 'glob';
import ComponentCompletion from './language/ComponentCompletion';
import ComponentCommands from './commands/ComponentCommands';
import PageCommands from './commands/PageCommands';
import {ApplicationProvider} from './providers/ApplicationProvider';
import {setApplicationInformationFromFiles, APPS} from './data/applications'

const APP_JSON_PATTERN = '**/app.json';

export function activate(context: vscode.ExtensionContext) {

	const applicationProvider = new ApplicationProvider(context);

	const componentCommands = new ComponentCommands(context);

	componentCommands.register();

	const pageCommands = new PageCommands(context);

	pageCommands.register();
	
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
			vscode.window.registerTreeDataProvider('occ.osf.components', applicationProvider.getComponentProvider())
		}
	});	

}

// this method is called when your extension is deactivated
export function deactivate() {}

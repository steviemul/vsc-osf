import * as vscode from 'vscode';
import ComponentCompletion from './language/ComponentCompletion';
import ComponentCommands from './commands/ComponentCommands';
import PageCommands from './commands/PageCommands';
import {setApplicationInformationFromFiles} from './data/applications'
import * as glob from 'glob';

const APP_JSON_PATTERN = '**/app.json';

export function activate(context: vscode.ExtensionContext) {

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
		}
	});	

}

// this method is called when your extension is deactivated
export function deactivate() {}

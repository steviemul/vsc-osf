import * as path from 'path';
import * as vscode from 'vscode';
import {readJson} from '../utils';

const APPS: any = {};

const getAppRoot = (location: string) => {

  const parts = location.split('/');

  return parts.splice(0, parts.length - 2).join('/');
};

async function getTargetAssetLocation() {

  if (Object.keys(APPS).length === 0) {
    return;
  }

  if (Object.keys(APPS).length === 1) {
    const app = Object.keys(APPS)[0];

    return APPS[app].root;
  }

  const application = await vscode.window.showQuickPick(
    Object.keys(APPS), {
    placeHolder: 'Select Application'
  });

  if (application) {
    return APPS[application].root;
  }
  
};

const setApplicationInformationFromFiles = (workspaceRoot: any, files: string[]) => {

  for (let file of files) {
    const location = path.join(workspaceRoot, file);

    const appJson = readJson(location);

    APPS[appJson.name] = {
      metadata: appJson,
      root: getAppRoot(location)
    };
  }
};

export {
  APPS,
  getTargetAssetLocation,
  setApplicationInformationFromFiles
};
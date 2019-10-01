import * as path from 'path';
import * as fs from 'fs';
import {readJson} from '../utils';

const APPS = 'apps';
const PACKAGES = 'packages';
const OCC = '.occ';
const APP_JSON = 'app.json';

const getCompoentInstances = (appJsonLocation: string) => {

  const appPath = path.resolve(appJsonLocation, '..', '..');
  const instanceLocation = path.join(appPath, 'assets', 'components');

  if (fs.existsSync(instanceLocation)) {
    return fs.readdirSync(instanceLocation);
  }

  return [];
};

const getAppRoot = (fileLocation: string) => {

  const parts = fileLocation.split(path.sep);

  for (let i = parts.length - 1; i > 0; i--) {

    if (parts[i - 1] === APPS) {
      if (i > 1 && parts[i - 2] === PACKAGES) {
        return parts.splice(0, i + 1).join(path.sep);
      }
    }
  }
};

const getComponentsForContainingApp = (fileLocation: string, includeInstances: boolean = false) => {

  const appRoot = getAppRoot(fileLocation);

  if (appRoot) {
    const appJsonLocation = path.join(appRoot, OCC, APP_JSON);

    if (fs.existsSync(appJsonLocation)) {
      const appJson = readJson(appJsonLocation);

      if (includeInstances) {
        const instances = getCompoentInstances(appJsonLocation);

        for (let instance of instances) {
          appJson.components[instance] = {};
        }
      }

      return appJson;
    }
  }
  
  return {};
};

export {
  getAppRoot,
  getComponentsForContainingApp
};
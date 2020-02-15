import * as AdmZip from 'adm-zip';
import Application from '../providers/Application';
import * as fs from 'fs-extra';
import * as path from 'path';
import { getComponentsForContainingApp } from '../data';

export async function unpack (data: Buffer) :Promise<any> {

  const contents: any = {};

  const zip = new AdmZip(data);

  const entries = zip.getEntries();

  entries.forEach((entry: AdmZip.IZipEntry) => {
    if (entry.entryName) {
      const content = zip.readAsText(entry);

      contents[entry.entryName] = content;
    }
  });

  return contents;
}

const getComparableAppContents = (application: Application) => {

  const assetsDir = path.join(application.root, 'assets');

  const contents: any = {};


  return contents;
};

export function getChangeList (application: Application, remoteContents: any): any {

  const localContents = getComparableAppContents(application);

  
}
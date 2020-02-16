import * as AdmZip from 'adm-zip';
import Application from '../providers/Application';
import * as path from 'path';

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
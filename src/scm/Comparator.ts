import Application from "../providers/Application";
import * as path from 'path';
import * as fs from 'fs';

export class Change {

  type: number;
  path: string;
  remotePath: string;

  constructor(type: number, path: string, remotePath: string) {
    this.type = type;
    this.path = path;
    this.remotePath = remotePath;
  }
}

export function getChangedResources(app: Application, remoteContents: any) : Change[] {
  const changes: Change[] = new Array();

  for (const remotePath in remoteContents) {

    const location = path.join(app.root, 'assets', remotePath);

    if (!fs.existsSync(location)) {
      changes.push(
        new Change(2, location, remotePath)
      );
    }
    else {
      const contents = fs.readFileSync(location, 'utf8');
      const remote = remoteContents[remotePath];

      if (contents !== remote) {
        changes.push(
          new Change(1, location, remotePath)
        );  
      }
    }
  }

  return changes;
}
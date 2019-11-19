import * as fs from 'fs';
import * as vscode from 'vscode';

const readJson = (location: string) => {
  if (fs.existsSync(location)) {
    const json: string = fs.readFileSync(location, 'utf8');

    return JSON.parse(json);
  }
};

const compareIgnoreCase = (itemA: vscode.TreeItem, itemB: vscode.TreeItem) => {
  const labelA = itemA.label.toLowerCase();
  const labelB =  itemB.label.toLowerCase();

  if (labelA < labelB) {
    return -1;
  }
  
  if (labelB > labelA) {
    return 1;
  }

  return 0;
};

export {
  readJson,
  compareIgnoreCase
};
import * as fs from 'fs';

const readJson = (location: string) => {
  if (fs.existsSync(location)) {
    const json: string = fs.readFileSync(location, 'utf8');

    return JSON.parse(json);
  }
};

export {
  readJson
};
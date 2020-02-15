import Application from "../providers/Application";
import Client from './Client';
import Environment from "../providers/Environment";
import {fromBuffer, Entry, ZipFile} from 'yauzl';
import { ReadStream } from "fs-extra";
import { Stream } from "stream";
import { unpack } from './utils';

const streamToString = (stream: Stream) => {
  const chunks: any = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
};

export default class Services {

  async getApplicationContents (application: Application, env: Environment) {
    
    const client = new Client(env);
    
    await client.login();
    
    const uri = `${env.metadata.appServerAdmin}/ccadmin/v1/clientApplications/${application.label}/assets`;
    
    const response = await client.request(uri);

    const data: Buffer = await response.buffer();

    const appContents = await unpack(data);

    console.log('Application Contents', appContents);
  }
}
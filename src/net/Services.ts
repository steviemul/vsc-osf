import Application from "../providers/Application";
import Client from './Client';
import Environment from "../providers/Environment";
import { unpack } from './utils';

export default class Services {

  async getApplicationContents (application: Application, env: Environment) {
    
    const client = new Client(env);
    
    await client.login();
    
    const uri = `${env.metadata.appServerAdmin}/ccadmin/v1/clientApplications/${application.metadata.name}/assets`;
    
    const response = await client.request(uri);

    const data: Buffer = await response.buffer();

    const appContents = await unpack(data);

    return appContents;
  }
}
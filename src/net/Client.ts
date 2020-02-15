import Environment from "../providers/Environment";
import fetch from 'node-fetch';
import * as vscode from 'vscode';

const LOGIN_URI = '/ccadmin/v1/login';

export default class Client {

  bearer: string;
  env: Environment;

  constructor(env: Environment) {
    this.env = env;
  }

  async login() {

    try {
      const url = `${this.env.metadata.appServerAdmin}${LOGIN_URI}`;

      const response = await fetch(
        url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Authorization: `Bearer ${this.env.metadata.appKey}`
        },
        body: 'grant_type=client_credentials',
        timeout: 5000
      }
      );

      if (response.ok) {
        const body = await response.json();

        this.bearer = body.access_token;
      }
      else {
        vscode.window.showErrorMessage(`Unable to login to ${this.env.label} : ${response.statusText}`);
      }
    }
    catch (e) {
      vscode.window.showErrorMessage(`Unable to login to ${this.env.label} `);  
      console.error(e);
    }
  }

  request(url: string, options: any = {}) {
    
    const {headers = {}} = options;

    headers.authorization = `Bearer ${this.bearer}`;

    options.headers = headers;

    return fetch(url, options);
  }
}
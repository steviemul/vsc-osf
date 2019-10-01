import * as vscode from "vscode";

const COLON = ':';
const QUOTE = '"';
const MAX_DISTANCE  = 200;

/**
 * Method searches back through a json document for the nearest property definition.
 * 
 * @param document the document to examine.
 * @param startPosition the line number to start searching at.
 */
const getNearestProperty = (document: vscode.TextDocument, startPosition: number) => {

  let distance: number = 0;
  let approachingProperty: boolean = false;
  let inPropertyKey: boolean = false;
  let property: string = '';

  for (let i=startPosition;i>=0;i--) {
    const line = document.lineAt(i).text;
    
    for (let j=line.length;j>=0;j--) {
      if (distance++ >= MAX_DISTANCE) {
        return;
      }

      const ch = line.charAt(j);

      if (inPropertyKey === true) {
        if (ch === QUOTE) {
          return property.split("").reverse().join("");
        }
        else {
          property += ch;
        }
      }
      else if (approachingProperty) {
        if (ch === QUOTE) {
          inPropertyKey = true;
          approachingProperty = false;
        }
      }
      else if (ch === COLON) {
        if (approachingProperty) {
          console.log('Invalid state searching for property');
          return;
        }
        else {
          approachingProperty = true;
        }
      }
    }
  }
  
};

export {
  getNearestProperty
};
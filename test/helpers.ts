import {TextEditor, TextDocument, WorkspaceConfiguration, workspace, window, Position} from 'vscode';
import * as fs from 'fs';
import TypeUtil from '../src/util/TypeUtil';
import Config from '../src/util/config';

export default class Helper {
    static fixturePath = __dirname + '/../../test/fixtures/';

    public static loadFixture(fixture:string, callback: (editor:TextEditor, document:TextDocument) => any) {
        workspace.openTextDocument(Helper.fixturePath + fixture).then(textDocument => {
            window.showTextDocument(textDocument).then(textEditor => {
                callback.call(this, textEditor, textDocument);
            }, error => {
                console.log(error);
            });
        }, error => {
            console.log(error);
        });
    }

    public static getFixturePositions(document:TextDocument):any
    {
        let testPositions:any = {};

        for (let line = 0; line < document.lineCount; line++) {
            let lineText = document.lineAt(line);
            if (!lineText.isEmptyOrWhitespace) {
                let pos = lineText.text.search(/\/\/\/\/=>/);
                if (pos !== -1) {
                    let name = lineText.text.match(/\/\/\/\/=>\s*([a-z0-9-]+)\s*$/);
                    if (name !== null) {
                        testPositions[name[1]] = new Position(line, pos);
                    }
                }
            }
        }

        return testPositions;
    }

    public static getFixtureMap(fixture:string):any {
        return JSON.parse(fs.readFileSync(Helper.fixturePath + fixture).toString());
    }

    public static getConfig():Config {
        return Config.instance;
    }

    public static setConfig(overrides:any) {
        Config.instance.load(true);
        Config.instance.override(overrides);
    }
}

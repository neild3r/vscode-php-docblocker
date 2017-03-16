import * as assert from 'assert';
import * as vscode from 'vscode';
import Function from '../src/block/function';
import {Doc, Param} from '../src/doc';
import * as fs from 'fs';

suite("Function tests", function(){
    let editor:vscode.TextEditor;
    let document:vscode.TextDocument;
    let testPositions:Array<{ name:string, position:vscode.Position}> = [];

    let map = JSON.parse(fs.readFileSync(__dirname + '/../../test/fixtures/functions.php.json').toString());

    suiteSetup(function(done) {
        vscode.workspace.openTextDocument(__dirname + '/../../test/fixtures/functions.php').then(textDocument => {
            vscode.window.showTextDocument(textDocument).then(textEditor => {
                document = textDocument;
                editor = textEditor;
                for (let line = 0; line < document.lineCount; line++) {
                    let lineText = document.lineAt(line);
                    if (!lineText.isEmptyOrWhitespace) {
                        let pos = lineText.text.search(/\/\/\/\/=>/);
                        if (pos !== -1) {
                            let name = lineText.text.match(/\/\/\/\/=>\s*([A-Za-z0-9 ]+)\s*$/);
                            testPositions.push({
                                name: name[1],
                                position: new vscode.Position(line, pos)
                            });

                        }
                    }
                }
                done();
            }, error => {
                console.log(error);
            });
        }, error => {
            console.log(error);
        });
    });

    for (let testNum = 0; testNum < map.length; testNum++) {
        let testData = map[testNum];
        test("Match Test: "+ testData.name, function() {
            let test = testPositions[testNum];
            let func = new Function(test.position, editor);
            assert.equal(true, func.test(), test.name);
        });

        test("Parse Test: "+ testData.name, function() {
            let test = testPositions[testNum];
            let func = new Function(test.position, editor);
            assert.ok(func.parse(), test.name);
        });

        test("Param Test: "+ testData.name, function() {
            let test = testPositions[testNum];
            let func = new Function(test.position, editor);
            let actual:Doc = func.parse();
            let expected:Doc = new Doc();
            expected.fromObject({
                params: testData.params
            });
            assert.deepEqual(actual.params, expected.params);
        });
    }
});

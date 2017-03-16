import * as assert from 'assert';
import * as vscode from 'vscode';
import Function from '../src/block/function';
import {Doc, Param} from '../src/doc';
import * as fs from 'fs';

suite("Function tests", function(){
    let editor:vscode.TextEditor;
    let document:vscode.TextDocument;
    let testPositions:any = {};

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
                            let name = lineText.text.match(/\/\/\/\/=>\s*([a-z0-9-]+)\s*$/);
                            if (name !== null) {
                                testPositions[name[1]] = new vscode.Position(line, pos);
                            }
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

    map.forEach(testData => {
        test("Match Test: "+ testData.name, function() {
            let func = new Function(testPositions[testData.key], editor);
            assert.equal(func.test(), true, test.name);
        });

        test("Parse Test: "+ testData.name, function() {
            let func = new Function(testPositions[testData.key], editor);
            assert.ok(func.parse(), test.name);
        });

        test("Param Test: "+ testData.name, function() {
            let func = new Function(testPositions[testData.key], editor);
            let actual:Doc = func.parse();
            let expected:Doc = new Doc();
            expected.fromObject({
                params: testData.params
            });
            assert.deepEqual(actual.params, expected.params);
        });
    });
});

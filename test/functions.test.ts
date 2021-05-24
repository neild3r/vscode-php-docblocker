import * as assert from 'assert';
import {TextEditor, TextDocument, WorkspaceConfiguration} from 'vscode';
import Helper from './helpers';
import Function from '../src/block/function';
import {Doc, Param} from '../src/doc';
import Config from '../src/util/config';

suite("Function tests", () => {
    let editor:TextEditor;
    let document:TextDocument;
    let testPositions:any = {};

    let defaults:Config = Helper.getConfig();
    let map = Helper.getFixtureMap('functions.php.json');

    suiteSetup(function(done) {
        Helper.loadFixture('functions.php', (edit:TextEditor, doc:TextDocument) => {
            editor = edit;
            document = doc;
            testPositions = Helper.getFixturePositions(document);
            done();
        });
    });

    map.forEach(testData => {
        if (testData.name === undefined) {
            testData.name = testData.key;
        }
        test("Match Test: "+ testData.name, () => {
            let func = new Function(testPositions[testData.key], editor);
            assert.equal(func.test(), true, test.name);
        });

        test("Parse Test: "+ testData.name, () => {
            let func = new Function(testPositions[testData.key], editor);
            assert.ok(func.parse(), test.name);
        });

        test("Result Test: "+ testData.name, () => {
            Helper.setConfig(testData.config);
            let func = new Function(testPositions[testData.key], editor);
            let actual:Doc = func.parse();
            let expected:Doc = new Doc('Undocumented function');
            expected.fromObject(testData.result);
            expected.template = Helper.getConfig().get('functionTemplate');
            assert.deepEqual(actual, expected);
        });
    });
});

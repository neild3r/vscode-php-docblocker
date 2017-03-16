import * as assert from 'assert';
import {TextEditor, TextDocument} from 'vscode';
import Helper from './helpers';
import Function from '../src/block/function';
import {Doc, Param} from '../src/doc';

suite("Function tests", () => {
    let editor:TextEditor;
    let document:TextDocument;
    let testPositions:any = {};

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
        test("Match Test: "+ testData.name, () => {
            let func = new Function(testPositions[testData.key], editor);
            assert.equal(func.test(), true, test.name);
        });

        test("Parse Test: "+ testData.name, () => {
            let func = new Function(testPositions[testData.key], editor);
            assert.ok(func.parse(), test.name);
        });

        test("Param Test: "+ testData.name, () => {
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

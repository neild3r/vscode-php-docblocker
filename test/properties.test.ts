import * as assert from 'assert';
import {TextEditor, TextDocument} from 'vscode';
import Helper from './helpers';
import Function from '../src/block/property';
import {Doc, Param} from '../src/doc';

suite("Property tests", () => {
    let editor:TextEditor;
    let document:TextDocument;
    let testPositions:any = {};

    let map = Helper.getFixtureMap('properties.php.json');

    suiteSetup(function(done) {
        Helper.loadFixture('properties.php', (edit:TextEditor, doc:TextDocument) => {
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

        test("Type Test: "+ testData.name, () => {
            let func = new Function(testPositions[testData.key], editor);
            let doc:Doc = func.parse();
            assert.equal(doc.var, testData.var, test.name);
        });
    });
});

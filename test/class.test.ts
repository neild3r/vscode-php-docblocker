import * as assert from 'assert';
import {TextEditor, TextDocument} from 'vscode';
import Helper from './helpers';
import Class from '../src/block/class';
import {Doc, Param} from '../src/doc';

suite("Class tests", () => {
    let editor:TextEditor;
    let document:TextDocument;
    let testPositions:any = {};

    let map = Helper.getFixtureMap('classes.php.json');

    suiteSetup(function(done) {
        Helper.loadFixture('classes.php', (edit:TextEditor, doc:TextDocument) => {
            editor = edit;
            document = doc;
            testPositions = Helper.getFixturePositions(document);
            done();
        });
    });

    map.forEach(testData => {
        test("Match Test: "+ testData.name, () => {
            let func = new Class(testPositions[testData.key], editor);
            assert.equal(func.test(), true, test.name);
        });

        test("Parse Test: "+ testData.name, () => {
            let func = new Class(testPositions[testData.key], editor);
            assert.ok(func.parse(), test.name);
        });
    });
});

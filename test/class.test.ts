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
        if (testData.name === undefined) {
            testData.name = testData.key;
        }
        test("Match Test: "+ testData.name, () => {
            let func = new Class(testPositions[testData.key], editor);
            assert.equal(func.test(), true, test.name);
        });

        test("Parse Test: "+ testData.name, () => {
            let func = new Class(testPositions[testData.key], editor);
            assert.ok(func.parse(), test.name);
        });

        if (testData.result) {
            test("Type Test: "+ testData.name, () => {
                Helper.setConfig(testData.config);
                let prop = new Class(testPositions[testData.key], editor);
                let actual:Doc = prop.parse();
                let expected:Doc = new Doc('Undocumented class');
                expected.fromObject(testData.result);
                expected.template = Helper.getConfig().get('classTemplate');
                assert.deepEqual(actual, expected);
            }); 
        }
    });
});

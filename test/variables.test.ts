import * as assert from 'assert';
import {TextEditor, TextDocument} from 'vscode';
import Helper from './helpers';
import {Doc, Param} from '../src/doc';
import Variable from '../src/block/Variable';

suite("Variable tests", () => {
    let editor:TextEditor;
    let document:TextDocument;
    let testPositions:any = {};

    let map = Helper.getFixtureMap('variables.php.json');

    suiteSetup(function(done) {
        Helper.loadFixture('variables.php', (edit:TextEditor, doc:TextDocument) => {
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
            let variable = new Variable(testPositions[testData.key], editor);
            assert.equal(variable.test(), true, test.name);
        });

        test("Parse Test: "+ testData.name, () => {
            let variable = new Variable(testPositions[testData.key], editor);
            assert.ok(variable.parse(), test.name);
        });

        test("Type Test: "+ testData.name, () => {
            Helper.setConfig(testData.config);
            let variable = new Variable(testPositions[testData.key], editor);
            let actual:Doc = variable.parse();
            let expected:Doc = new Doc('Undocumented variable');
            if (testData.result.var === undefined) {
                expected.var = undefined;
            }
            expected.fromObject(actual);
            expected.fromObject(testData.result);
            expected.template = Helper.getConfig().get('variableTemplate');
            assert.deepEqual(actual, expected);

            if (testData.doc !== undefined) {
                assert.equal(actual.build().value, testData.doc, test.name);
            }
        });
    });
});

import * as assert from 'assert';
import {TextEditor, TextDocument} from 'vscode';
import Helper from './helpers';
import Property from '../src/block/property';
import {Doc, Param} from '../src/doc';
import { DocType } from '../src/DocType';

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
        if (testData.name === undefined) {
            testData.name = testData.key;
        }
        test("Match Test: "+ testData.name, () => {
            let prop = new Property(testPositions[testData.key], editor);
            assert.equal(prop.test(), true, test.name);
        });

        test("Parse Test: "+ testData.name, () => {
            let prop = new Property(testPositions[testData.key], editor);
            assert.ok(prop.parse(), test.name);
        });

        test("Type Test: "+ testData.name, () => {
            Helper.setConfig(testData.config);
            let prop = new Property(testPositions[testData.key], editor);
            let actual:Doc = prop.parse();
            let expected:Doc = new Doc(DocType.property, 'Undocumented property');
            if (testData.result.var === undefined) {
                expected.var = undefined;
            }
            expected.fromObject(actual);
            expected.fromObject(testData.result);
            expected.template = Helper.getConfig().get('propertyTemplate');
            assert.deepEqual(actual, expected);
        });
    });
});

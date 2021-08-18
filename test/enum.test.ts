import * as assert from 'assert';
import {TextEditor, TextDocument} from 'vscode';
import Helper from './helpers';
import {Doc, Param} from '../src/doc';
import { DocType } from '../src/DocType';
import EnumBlock from '../src/block/EnumBlock';

suite("Enum tests", () => {
    let editor:TextEditor;
    let document:TextDocument;
    let testPositions:any = {};

    let map = Helper.getFixtureMap('enums.php.json');

    suiteSetup(function(done) {
        Helper.loadFixture('enums.php', (edit:TextEditor, doc:TextDocument) => {
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
            let block = new EnumBlock(testPositions[testData.key], editor);
            assert.equal(block.test(), true, test.name);
        });

        test("Parse Test: "+ testData.name, () => {
            let block = new EnumBlock(testPositions[testData.key], editor);
            assert.ok(block.parse(), test.name);
        });

        if (testData.result) {
            test("Type Test: "+ testData.name, () => {
                Helper.setConfig(testData.config);
                let block = new EnumBlock(testPositions[testData.key], editor);
                let actual:Doc = block.parse();
                let expected:Doc = new Doc(DocType.enum, 'Undocumented enum');
                expected.fromObject(testData.result);
                expected.template = Helper.getConfig().get('classTemplate');
                assert.deepEqual(actual, expected);
            }); 
        }
    });
});

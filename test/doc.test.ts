import * as assert from 'assert';
import {SnippetString} from 'vscode';
import Helper from './helpers';
import {Doc, Param} from '../src/doc';
import Config from '../src/util/config';

suite("Snippet build tests", () => {
    let map = Helper.getFixtureMap('doc.json');

    map.forEach(testData => {
        if (testData.name === undefined) {
            testData.name = testData.key;
        }
        test("Snippet test: "+ testData.name, () => {
            let doc = new Doc();
            let empty = false;
            if (testData.config != undefined) {
                Helper.setConfig(testData.config);
            } else {
                Config.instance.load();
            }
            if (testData.input != undefined) {
                doc.fromObject(testData.input);
            } else {
                empty = true;
            }
            if (Config.instance.get('template')) {
                doc.template = Config.instance.get('template');
            }
            assert.equal(doc.build(empty).value, testData.expected.join("\n"));
        });
    });
});

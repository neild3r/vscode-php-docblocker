import * as assert from 'assert';
import {TextEditor, TextDocument, CancellationTokenSource, CancellationToken, Position, ProviderResult, CompletionItem} from 'vscode';
import Helper from './helpers';
import Completions from '../src/completions';

suite("Completion tests", () => {
    let editor:TextEditor;
    let document:TextDocument;
    let testPositions:any = {};
    let completions = new Completions();

    let map = Helper.getFixtureMap('completions.php.json');

    suiteSetup(function(done) {
        Helper.loadFixture('completions.php', (edit:TextEditor, doc:TextDocument) => {
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
        test("Completion: " + testData.name, () => {
            let pos:Position = testPositions[testData.key];
            let result:any = completions.provideCompletionItems(
                document,
                document.lineAt(pos.line+1).range.end,
                new CancellationTokenSource().token
            );

            let matched:Array<string> = [];
            result.forEach(data => {
                matched.push(data.insertText.value);
            });
            let actual = matched.join("\n");
            let expected = testData.result.join("\n");

            assert.deepEqual(actual, expected);
        });
    });
});

import * as assert from 'assert';
import TypeUtil from "../src/util/TypeUtil";
import { window, workspace, TextDocument, Position, TextEditor } from 'vscode';
import Helper from './helpers';
import FunctionBlock from '../src/block/function';

suite("TypeUtil tests: ", () => {
    let editor:TextEditor;
    let head:string;

    suiteSetup(function(done) {
        workspace.openTextDocument(Helper.fixturePath+'namespace.php').then(doc => {
            window.showTextDocument(doc).then(textEditor => {
                editor = textEditor;
                let block = new FunctionBlock(new Position(0, 0), editor);
                head = block.getClassHead();
                done();
            }, error => {
                console.log(error);
            })
        }, error => {
            console.log(error);
        });
    });

    test("Ensure typehint is not mismatched", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('Example', head), 'Example');
    });

    test("Fully qualify typehint from namespace", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('FilterInterface', head), '\\App\\Test\\Model\\FilterInterface');
    });

    test("Fully qualify typehint from namespace use with alias", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('BaseExample', head), '\\App\\Test\\Model\\Example');
    });

    test("With default settings the integer type formatted is integer", () => {
        let type = new TypeUtil;
        assert.equal(type.getFormattedTypeByName('int'), 'integer');
    });

    test("With default settings the boolean type formatted is boolean", () => {
        let type = new TypeUtil;
        assert.equal(type.getFormattedTypeByName('bool'), 'boolean');
    });

    test('With special settings the integer type formatted is int', () => {
        let type = new TypeUtil;
        Helper.setConfig({useShortNames: true});
        assert.equal(type.getFormattedTypeByName('int'), 'int');
    })

    test('With special settings the boolean type formatted is bool', () => {
        let type = new TypeUtil;
        Helper.setConfig({useShortNames: true});
        assert.equal(type.getFormattedTypeByName('bool'), 'bool');
    })

    test("Unknown types won't be touched", () => {
        let type = new TypeUtil;
        assert.equal(type.getFormattedTypeByName('helloWorld'), 'helloWorld');
    });

});

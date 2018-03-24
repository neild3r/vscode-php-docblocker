import * as assert from 'assert';
import TypeUtil from "../src/util/TypeUtil";
import { window, workspace, TextDocument } from 'vscode';
import Helper from './helpers';

suite("TypeUtil tests: ", () => {
    let textDocument:TextDocument;

    suiteSetup(function(done) {
        workspace.openTextDocument(Helper.fixturePath+'namespace.php').then(doc => {
            textDocument = doc;
            done();
        }, error => {
            console.log(error);
        });
    });


    test("Fully qualify typehint from namespace", () => {
        let type = new TypeUtil;
        type.qualifyClassNames = true;
        assert.equal(type.getFullyQualifiedType('FilterInterface', textDocument), 'App\\Test\\Model\\FilterInterface');
    });

    test("Fully qualify typehint from namespace use with alias", () => {
        let type = new TypeUtil;
        type.qualifyClassNames = true;
        assert.equal(type.getFullyQualifiedType('BaseExample', textDocument), 'App\\Test\\Model\\Example');
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
        type.useShortNames = true;
        assert.equal(type.getFormattedTypeByName('int'), 'int');
    })

    test('With special settings the boolean type formatted is bool', () => {
        let type = new TypeUtil;
        type.useShortNames = true;
        assert.equal(type.getFormattedTypeByName('bool'), 'bool');
    })

    test("Unknown types won't be touched", () => {
        let type = new TypeUtil;
        assert.equal(type.getFormattedTypeByName('helloWorld'), 'helloWorld');
    });

});

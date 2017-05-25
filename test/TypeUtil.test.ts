import * as assert from 'assert';
import TypeUtil from "../src/util/TypeUtil";
import { workspace } from "vscode";

suite("TypeUtil tests: ", () => {

    test("With default settings the integer type formatted is integer", () => {
        TypeUtil.instance.useShortNames = false;
        assert.equal(TypeUtil.instance.getFormattedTypeByName('int'), 'integer');
    });

    test("With default settings the boolean type formatted is boolean", () => {
        TypeUtil.instance.useShortNames = false;
        assert.equal(TypeUtil.instance.getFormattedTypeByName('bool'), 'boolean');
    });

    test('With special settings the integer type formatted is int', () => {
        TypeUtil.instance.useShortNames = true;
        assert.equal(TypeUtil.instance.getFormattedTypeByName('int'), 'int');
    })

    test('With special settings the boolean type formatted is bool', () => {
        TypeUtil.instance.useShortNames = true;
        assert.equal(TypeUtil.instance.getFormattedTypeByName('bool'), 'bool');
    })

    test("Unknown types won't be touched", () => {
        assert.equal(TypeUtil.instance.getFormattedTypeByName('helloWorld'), 'helloWorld');
    });

});
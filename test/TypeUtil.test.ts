import * as assert from 'assert';
import TypeUtil from "../src/util/TypeUtil";
import { workspace } from "vscode";

suite("TypeUtil tests", () => {

    test("With default settings the integer type formatted is integer", () => {
        workspace.getConfiguration().update('php-docblocker.useShortNames', false);
        TypeUtil.clearCache();
        assert.equal(TypeUtil.getFormattedTypeByName('int'), 'integer');
    });

    test("With default settings the boolean type formatted is boolean", () => {
        workspace.getConfiguration().update('php-docblocker.useShortNames', false);
        TypeUtil.clearCache();
        assert.equal(TypeUtil.getFormattedTypeByName('bool'), 'boolean');
    });

    test('With special settings the integer type formatted is int', () => {
        workspace.getConfiguration().update('php-docblocker.useShortNames', true);
        TypeUtil.clearCache();
        assert.equal(TypeUtil.getFormattedTypeByName('int'), 'int');
    })

    test('With special settings the boolean type formatted is bool', () => {
        workspace.getConfiguration().update('php-docblocker.useShortNames', true);
        TypeUtil.clearCache();
        assert.equal(TypeUtil.getFormattedTypeByName('bool'), 'bool');
    })

    test("Unknown types won't be touched", () => {
        assert.equal(TypeUtil.getFormattedTypeByName('helloWorld'), 'helloWorld');
    });

});
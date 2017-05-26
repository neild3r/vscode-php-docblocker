import * as assert from 'assert';
import TypeUtil from "../src/util/TypeUtil";

suite("TypeUtil tests: ", () => {

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
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

    test("Test the classes returned from use is correct", () => {
        let type = new TypeUtil;
        assert.deepEqual(type.getClassesFromUse('ClassA'), { 'ClassA': 'ClassA' });
        assert.deepEqual(type.getClassesFromUse('ClassB as B'), { 'B': 'ClassB' });
        assert.deepEqual(type.getClassesFromUse('ClassA, namespace\\ClassB as B'), { 'ClassA': 'ClassA', 'B': 'namespace\\ClassB' });
        assert.deepEqual(type.getClassesFromUse('namespace\\{ ClassA, ClassB as B }'), { 'ClassA': 'namespace\\ClassA', 'B': 'namespace\\ClassB' });
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

    test("Fully qualify typehint from namespace with prefix", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('StreamHandler', head), '\\Monolog\\Handler\\StreamHandler');
    });

    test("Fully qualify typehint from namespace use with alias", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('BaseExample', head), '\\App\\Test\\Model\\Example');
    });

    test("Fully qualify typehint from namespace use with _", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('ExampleInterface', head), '\\App\\Example\\ExampleInterface');
    });

    test("Fully qualify typehint from namespace use with bracket", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('ClassA', head), '\\some\\namespace\\ClassA');
    });

    test("Fully qualify typehint from namespace use with bracket+alias", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('ClassB_alias', head), '\\some\\namespace\\ClassB');
    });

    test("Fully qualify typehint from namespace use with comma", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('ClassD', head), '\\some\\namespace\\ClassD');
    });

    test("Fully qualify typehint from namespace use with comma+alias", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('ClassE_alias', head), '\\some\\namespace\\ClassE');
    });

    test("Fully qualify typehint from namespace use const", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('myconst', head), 'myconst');
    });

    test("Fully qualify typehint from namespace use function", () => {
        let type = new TypeUtil;
        Helper.setConfig({qualifyClassNames: true});
        assert.equal(type.getFullyQualifiedType('myfunction', head), 'myfunction');
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

    test("Undefined type uses config", () => {
        let type = new TypeUtil;
        Helper.setConfig({defaultType: 'mixed'});
        assert.equal(type.getDefaultType(), 'mixed');
    });
});

suite("TypeUtil issue test: ", () => {
    let editor:TextEditor;

    suiteSetup(function(done) {
        workspace.openTextDocument(Helper.fixturePath+'namespace-issue.php').then(doc => {
            window.showTextDocument(doc).then(textEditor => {
                editor = textEditor;
                done();
            }, error => {
                console.log(error);
            })
        }, error => {
            console.log(error);
        });
    });

    test("Ensure class head does not fail if there isn't one", () => {
        let block = new FunctionBlock(new Position(0, 0), editor);
        let head = block.getClassHead();

        assert.equal(head, null);
    });
});

import * as assert from 'assert';
import * as vscode from 'vscode';
import Function from '../src/block/function';

suite("Function tests", () => {

    let tests = [
        {
            line: "    public function getName()",
            match: true
        },
        {
            line: "    function __construct()",
            match: true
        },
        {
            line: "    function __construct() { ",
            match: true
        },
        {
            line: "    function __construct(){",
            match: true
        },
        {
            line: "    function __construct($edible, $color = \"green\")",
            match: true
        },
        {
            line: "   abstract public function getName();",
            match: true
        },
        {
            line: "   abstract static public function getName();",
            match: true
        },
        {
            line: "   static abstract protected function getName();",
            match: true
        },
        {
            line: "   abstract protected static function getName();",
            match: true
        },
        {
            line: "final private static function getName()",
            match: true
        },
        {
            line: "final public function getName()",
            match: true
        },
    ];

    tests.forEach(arg => {
        test("Line matches " + arg.line, () => {
            let func = new Function(arg.line);
            let res = assert.equal(arg.match, func.test());
        });
    });
});

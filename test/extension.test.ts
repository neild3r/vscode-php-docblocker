import * as assert from 'assert';
import * as vscode from 'vscode';
import Function from '../src/block/function';

suite("Function tests", () => {

    let tests = [
        {
            line: "    public function getName()\n    {",
            match: true
        },
        {
            line: "    function __construct()\n    {",
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
            line: "    function __construct($edible, $color = \"green\")\n    {",
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
            line: "final private static function getName()\n{",
            match: true
        },
        {
            line: "final public function getName()\n{",
            match: true
        },
        {
            line: "public function getName('\n$var,\n$var2,\n$var3,\n) {",
            match: true
        },
        {
            line: "protected $var = [];",
            match: false
        },
        {
            line: "protected $var = array();",
            match: false
        },
        {
            line: "protected $var = ['test', 'test2'];",
            match: false
        },
        {
            line: "protected $var = [\n    'test',\n    'test2'\n];",
            match: false
        }
    ];

    tests.forEach(arg => {
        test("Line " + (arg.match ? "matches " : "doesn't match ")+ arg.line.split("\n")[0], () => {
            let func = new Function();
            func.setSigniture(arg.line);
            let res = assert.equal(arg.match, func.test());
        });
    });
});

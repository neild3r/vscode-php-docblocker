<?php

abstract class Test
{
    ////=> public
    public $public;

    ////=> protected
    protected $protected;

    ////=> static
    protected static $static;

    ////=> static-alternate
    static protected $staticAlt;

    ////=> default-string
    protected $defaultString = 'string';

    ////=> default-string-alternate
    public $defaultStringAlternate = "string";

    ////=> default-bool
    public $defaultBool = false;

    ////=> default-bool-alternate
    public $defaultBoolAlternate = TRUE;

    ////=> default-array
    public $defaultArray = array();

    ////=> default-array-alternate
    public $defaultArrayAlternate = [];

    ////=> multiline
    public $multiline = [
        'key' => 'value',
        'key2' => 'value2'
    ];

    ////=> multiline-alternate
    public $multilineAlternate = array(
        'value',
        'value2'
    );
}

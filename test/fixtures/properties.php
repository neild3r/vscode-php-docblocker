<?php

abstract class Test
{
    ////=> public
    public $public;

    ////=> protected
    protected $protected;

    ////=> static
    static $static;

    ////=> protected-static
    protected static $static;

    ////=> static-alternate
    static protected $staticAlt;

    ////=> ignore-case
    STatiC ProtecteD $ignoreCase;

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

    ////=> default-float
    public $defaultFloat = -124124.50;


    ////=> default-int
    public $defaultInt = -214221;


    ////=> default-null
    public $defaultNull = null;

    ////=> specify-type
    protected array $specifyType;

    ////=> union-types
    protected array|string $unionTypes;

    ////=> string-with-null
    protected ?string $stringWithNull;

    ////=> string-default-null
    protected string $stringDefaultNull = null;

    ////=> syntax-error
    protected syntax error string $stringDefaultNull = null;

    ////=> auto-ignore-property-type
    protected string|int $autoIgnorePropertyType;

    ////=> auto-ignore-property-type-mixed
    protected $autoIgnorePropertyTypeMixed;

    ////=> auto-ignore-property-type-withtype
    protected $autoIgnorePropertyTypeWithtype;

    ////=> default-message-blank
    protected $default_message_blank;

    ////=> default-message-name
    protected $default_message_name;

    ////=> default-message-undocumented
    protected $default_message_undocumented;

}

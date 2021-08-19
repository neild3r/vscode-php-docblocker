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
    protected static $staticProtected;

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

    ////=> typed-string
    public string $typedString;

    ////=> typed-int
    public int $typedInt;

    ////=> typed-interface
    public DateTimeInterface $typedInterface;

    ////=> typed-namespace
    public \App\Type\Test $typedNamespace;

    ////=> typed-string-default
    public string $typedStringDefault = 'test';

    ////=> typed-int-default
    public int $typedIntDefault = 42;

    ////=> typed-string-nullable
    public ?string $typedStringNullable;

    ////=> typed-interface-nullable
    public ?DateTimeInterface $typedInterfaceNullable;

    ////=> typed-namespace-nullable
    public ?\App\Type\Test $typedNamespaceNullable;

    ////=> readonly
    public readonly string $readonly;

    ////=> default-message-blank
    protected $default_message_blank;

    ////=> default-message-name
    protected $default_message_name;

    ////=> default-message-undocumented
    protected $default_message_undocumented;
    
    ////=> union-type-simple
    public string|array $unionTypeSimple;

    ////=> union-type-namespace
    public string|\DateTimeInterface $unionTypeNamespace;

    ////=> union-type-full-namespace
    public string|\App\Type\Test $unionTypeFullNamespace;

    ////=> union-type-nullable
    public string|array|null $unionTypeNullable;
}

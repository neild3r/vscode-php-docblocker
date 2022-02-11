<?php

abstract class Test
{
    ////=> simple
    public function test()
    {
    }

    ////=> simple-static
    public static function test2()
    {
    }

    ////=> constructor-no-vis
    function __construct()
    {
    }

    ////=> abstract-simple
    abstract public function getName();

    ////=> abstract-static
    abstract static public function getStaticName();

    ////=> abstract-static-alt
    static abstract protected function getNameStatic();


    ////=> final-static
    final private static function getFinalPrivateName()
    {
    }

    ////=> final
    final public function getFinalName()
    {
    }

    ////=> params
    public function getParams($var, $var2, $var3)
    {
    }

    ////=> params-complex
    final protected static function getComplexParams(&$var, Hint $var2, $var3 = false)
    {
    }

    ////=> multiline
    public function getMultiline(
        $var,
        $var2,
        $var3
    ) {
    }

    ////=> multiline-complex
    final static public function getComplexMultiline(
        TypeHint $var,
        &$var2,
        $var3 = "default"
    ) {
    }

    ////=> nullable-return-type
    public function nullableReturnType(): ?string
    {
    }

    ////=> nullable-args
    public function nullableArgs(?TypeHint $var, ?\Type2 $var2, ?string $var3)
    {
    }

    ////=> param-types
    public function getParamTypes(
        TypeHint $hint,
        $boolean = true,
        $string = 'single quotes',
        $string2 = "double quotes",
        $int = 42141513,
        $float = 109.50,
        $array = [],
        $array2 = array()
    ) {
    }

    ////=> array-params
    public function arrayParams($var = array('a', array()), $var2 = array())
    {
    }

    ////=> param-namespace
    public function paramNamespaced(\TypeHint $hint, $test)
    {
    }

    ////=> param-namespace-full
    public function paramNamespacedFull(App\Model\TypeHint $hint, $test)
    {
    }

    ////=> param-default-null
    public function paramDefaultNull(int $arg = null)
    {
    }

    ////=> param-mixed-default-null
    public function paramMixedDefaultNull(mixed $arg = null)
    {
    }

    ////=> args
    public function dotArgs(...$args) {
    }

    ////=> args-typed
    public function dotArgsTyped(int ...$args) {
    }

    ////=> args-typed-long
    public function dotArgsTypedLong(int ...$args) {
    }

    ////=> php7-return
    public function getPHP7Return(): TypeHint {
    }

    ////=> php7-return-snake
    public function getPHP7ReturnSnake(): Type_Hint3 {
    }

    ////=> php7-return-alt
    public function getPHP7ReturnAlt():float
    {
    }

    ////=> php7-return-param
    public function getPHP7ReturnParam(float $param) :int
    {
    }

    ////=> php7-return-param-long
    public function getPHP7ReturnParamLong(float $param) :int
    {
    }

    ////=> php7-return-multiline
    public function getPHP7ReturnMultiline(
        float $param,
        bool $boolean = false
    ) : int {
    }

    ////=> php7-return-multiline-long
    public function getPHP7ReturnMultilineLong(
        float $param,
        bool $boolean = false
    ) : int {
    }

    ////=> php7-return-namespace
    public function getPHP7ReturnNamespace():\TypeHint
    {
    }

    ////=> php7-return-namespace-full
    public function getPHP7ReturnNamespaceFull():App\Model\TypeHint
    {
    }

    ////=> php8-return-union-types
    public function getPHP8ReturnUnionTypes():int|bool|\TypeHint|App\Model\TypeHint
    {
    }

    ////=> php8-return-union-types-with-short-name
    public function getPHP8ReturnUnionTypesShortName():int|bool|\TypeHint|App\Model\TypeHint
    {
    }

    ////=> php8-param-union-types
    public function getPHP8ParamUnionTypes(int|bool|\TypeHint|App\Model\TypeHint $arg, string|\Closure ...$args)
    {
    }

    ////=> php8-constructor-promotion
    function __construct($arg1, protected int $arg2, private ?int $arg3 = 1, public string $arg4 = 'var')
    {
    }

    ////=> trailing-comma
    public function trailingComma(int $var, string $var2,)
    {
    }

    ////=> trailing-comma-multi
    public function trailingCommaMulit(
        int $var,
        Class_Name $var2,
    ) {
    }

    ////=> php81-intersection-types
    function intersection_types(Iterator&\Countable $var)
    {
    }

    ////=> php81-union-intersection-types-fault-tolerant
    function union_intersection_types_fault_tolerant(Iterator&\Countable|Aaa||&|&Bbb &$var)
    {
    }

    ////=> function-reference
    public function &someFunction()
    {
    }

    ////=> is
    public function isSomething()
    {
    }

    ////=> is-void
    public function isotope()
    {
    }

    ////=> is-only
    public function is()
    {
    }

    ////=> has
    public function hasValue()
    {
    }

    ////=> has-void
    public function hashed()
    {
    }

    ////=> has-only
    public function has()
    {
    }

    ////=> can
    public function canValue()
    {
    }

    ////=> can-void
    public function cancel()
    {
    }

    ////=> can-only
    public function can()
    {
    }

    ////=> should
    public function shouldDoSomething()
    {
    }

    ////=> should-void
    public function shouldasdf()
    {
    }

    ////=> should-only
    public function should()
    {
    }

    ////=> debug-info
    public function __debugInfo()
    {
    }

    ////=> wakeup
    public function __wakeup()
    {
    }

    ////=> sleep
    public function __sleep()
    {
    }

    ////=> isset
    public function __isset($name)
    {
    }

    ////=> unset
    public function __unset($name)
    {
    }

    ////=> set
    public function __set($name, $value)
    {
    }

    ////=> to-string
    public function __toString()
    {
    }
}

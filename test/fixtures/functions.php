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
}

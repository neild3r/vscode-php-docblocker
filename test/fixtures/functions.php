<?php

abstract class Test
{
    ////=> Simple public
    public function test()
    {
    }

    ////=> Simple public static
    public static function test2()
    {
    }

    ////=> Constructor with no visibility
    function __construct()
    {
    }

    ////=> Abstract method simple
    abstract public function getName();

    ////=> Abstract method static
    abstract static public function getStaticName();

    ////=> Abstract method static alternate
    static abstract protected function getNameStatic();


    ////=> Final static method
    final private static function getFinalPrivateName()
    {
    }

    ////=> Final method
    final public function getFinalName()
    {
    }

    ////=> Final Multiline
    public function getMultilineName(
        $var,
        $var2,
        $var3
    ) {
    }
}

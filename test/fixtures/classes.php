<?php

////=> simple
class SimpleClass
{

}


////=> interface
interface SimpleInterface
{

}

////=> trait
trait SimpleTrait
{

}

////=> final
final class FinalClass
{

}

////=> abstract
abstract class AbstractClass
{

}

////=> extends
class SubClass extends ParentClass
{

}

////=> implements
class ImplementedClass implements ClassInterface
{

}

////=> extends-implements
class ImplementedSubClass extends ImplementedParentClass implements ClassInterface
{

}

////=> multiline
abstract class Multiline implements
    ImplementedClass1,
    App\Model\ImplementedClass2,
    \ImplementedClass3
{

}

////=> complex
abstract class Complex extends MultilineParent implements
    ImplementedClass1,
    ImplementedClass2
{

}

////=> extends-namespace
class SubClass extends \ParentClass
{

}

////=> implements-namespace
class ImplementedClass implements \ClassInterface
{

}

////=> extends-implements-namespace
class ImplementedSubClass extends App\Model\ImplementedParentClass implements App\Model\ClassInterface
{

}

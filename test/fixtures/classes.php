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

////=> default-message-blank
class default_message_blank{}

////=> default-message-name
class default_message_name{}

////=> default-message-undocumented
class default_message_undocumented{}

////=> case-insensitive-with-space
CLaSS 
    case_insensitive_with_space
{}

<?php

////=> enum
enum SimpleEnum1
{
}

////=> enum-with-type
enum SimpleEnum2: int
{
}

////=> enum-with-implements
enum SimpleEnum3 implements \ArrayAccess
{
}

////=> enum-with-type-implements
enum SimpleEnum4: string implements \ArrayAccess
{
}

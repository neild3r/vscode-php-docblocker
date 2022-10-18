<?php

////=> doc
$var = 1;

////=> float1
$var = .3;

////=> float2
$var = 0.3;

////=> float3
$var = .1_000_1;

////=> int1
$var = 3;

////=> int2
$var = 03;

////=> int3
$var = 1_000_000;

////=> bool1
$var = true;

////=> bool2
$var = !0;

////=> bool3
$var = !'test';

////=> stdclass
$var = new stdClass;

////=> object
$var = new class {};

////=> string1
$var = 'string';

////=> string2
$var = "string";

////=> string3
$var = <<<EOF
string
EOF;

////=> closure
$var = function () {};

////=> closure-fn
$var = fn () => 123;

////=> array1
$var = [1,2,3];

////=> array2
$var = [];

////=> array3
$var = array(
    1
);

////=> array4
$var = [
    1
];

////=> type-casting-string
$var = (string)1;

////=> type-casting-float1
$var = (float)1;

////=> type-casting-float2
$var = (real)1;

////=> type-casting-float3
$var = (double)1;

////=> type-casting-null
$var = (unset)1;

////=> mixed1
$var = test();

////=> mixed2
$var = null;
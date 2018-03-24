# PHP DocBlocker

[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/neilbrayfield.php-docblocker.svg)](https://marketplace.visualstudio.com/items?itemName=neilbrayfield.php-docblocker) [![Installs](https://vsmarketplacebadge.apphb.com/installs/neilbrayfield.php-docblocker.svg)](https://marketplace.visualstudio.com/items?itemName=neilbrayfield.php-docblocker) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/neilbrayfield.php-docblocker.svg)](https://marketplace.visualstudio.com/items?itemName=neilbrayfield.php-docblocker) [![Build status](https://travis-ci.org/neild3r/vscode-php-docblocker.svg?branch=master)](https://travis-ci.org/neild3r/vscode-php-docblocker) [![Coverage status](https://coveralls.io/repos/github/neild3r/vscode-php-docblocker/badge.svg)](https://coveralls.io/github/neild3r/vscode-php-docblocker)

Basic PHP DocBlocking extension.

We now have a set of unit tests and some full coverage on the parsing of signatures as well as continuous integration. This should ensure the extension remains stable as development progresses.

## Features

* Completion snippet after `/**` above a class, function, class property
* Continuation of DocBlock when pressing enter when in a DocBlock
* Completion of DocBlock tags such as `@param`, `@return`, `@throws`
* Inferring of param and return types from signatures

## Requirements

This extension has no dependencies.

## Extension Settings

This extension contributes the following settings:

* `php-docblocker.gap`: set to `false` to disable the gap between the description and tags
* `php-docblocker.returnGap`: set to `true` to add a gap between the param and return tags
* `php-docblocker.extra`: an array of extra tags to add to each DocBlock (These can include tabstops and snippet variables)
* `php-docblocker.useShortNames`: Whether we should use short type names. e.g. bool or boolean
* `php-docblocker.qualifyClassNames`: When adding type hints for class names search namespace use statements and qualify the class 
* `php-docblocker.author`: An object containing your default author tag settings

## Supported DocBlock tags

Please see below for a list of supported tags and their snippets. These tags are available within a DocBlock
and can be triggered by typing @ then another characted (Provided your vscode settings allow).

| Tag             | Snippet                                 |
|-----------------|-----------------------------------------|
| @api            | @api                                    |
| @abstract       | @abstract                               |
| @author         | @author ${1:{{name}}} <${2:{{email}}}>  |
| @category       | @category ${1:description}              |
| @copyright      | @copyright ${1:2018} ${2:Name}          |
| @deprecated     | @deprecated ${1:version}                |
| @example        | @example ${1:location} ${2:description} |
| @filesource     | @filesource                             |
| @final          | @final                                  |
| @group          | @group ${1:group}                       |
| @global         | @global                                 |
| @ignore         | @ignore ${1:description}                |
| @inheritDoc     | @inheritDoc                             |
| @internal       | @internal ${1:description}              |
| @license        | @license ${1:MIT}                       |
| @link           | @link ${1:http://url.com}               |
| @method         | @method ${1:mixed} ${2:methodName()}    |
| @package        | @package ${1:category}                  |
| @param          | @param ${1:mixed} $${2:name}            |
| @property       | @property ${1:mixed} $${2:name}         |
| @property-read  | @property-read ${1:mixed} $${2:name}    |
| @property-write | @property-write ${1:mixed} $${2:name}   |
| @return         | @return ${1:mixed}                      |
| @see            | @see ${1:http://url.com}                |
| @since          | @since ${1:1.0.0}                       |
| @source         | @source ${1:location} ${2:description}  |
| @static         | @static                                 |
| @subpackage     | @subpackage ${1:category}               |
| @throws         | @throws ${1:Exception}                  |
| @todo           | @todo ${1:Something}                    |
| @uses           | @uses ${1:MyClass::function} ${2:Name}  |
| @var            | @var ${1:mixed}                         |
| @version        | @version ${1:1.0.0}                     |

## Future development

It probably wouldn't be too much work to expand this to work with multiple languages. If this is something you are interested in, please pop over to github and add your feedback to the issue [neild3r/vscode-php-docblocker#17](https://github.com/neild3r/vscode-php-docblocker/issues/17).

Please also feel free to suggest new configuration options, I appreciate at this time the extension is mostly set up for my own DocBlock style requirements but more options could be added for other use cases.

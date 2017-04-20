# PHP DocBlocker

[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/neilbrayfield.php-docblocker.svg)](https://marketplace.visualstudio.com/items?itemName=neilbrayfield.php-docblocker) [![Installs](https://vsmarketplacebadge.apphb.com/installs/neilbrayfield.php-docblocker.svg)](https://marketplace.visualstudio.com/items?itemName=neilbrayfield.php-docblocker) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/neilbrayfield.php-docblocker.svg)](https://marketplace.visualstudio.com/items?itemName=neilbrayfield.php-docblocker) [![Build status](https://travis-ci.org/neild3r/vscode-php-docblocker.svg?branch=master)](https://travis-ci.org/neild3r/vscode-php-docblocker) [![Coverage status](https://coveralls.io/repos/github/neild3r/vscode-php-docblocker/badge.svg)](https://coveralls.io/github/neild3r/vscode-php-docblocker)

Basic PHP DocBlocking extension.

We now have a set of unit tests and some full coverage on the parsing of signitures as well as continuous integration. This should ensure the extension remains stable as development progresses.

## Features

* Completion snippet after `/**` above a class, function, class property
* Continuation of DocBlock when pressing enter when in a DocBlock
* Completion of DocBlock tags such as `@param`, `@return`, `@throws`
* Inferring of param and return types from signitures

## Requirements

This extension has no dependencies.

## Extension Settings

This extension contributes the following settings:

* `php-docblocker.gap`: set to `false` to disable the gap between the description and tags
* `php-docblocker.extra`: an array of extra tags to add to each DocBlock

## Future development

It probably wouldn't be too much work to expand this to work with multiple languages. If this is something you are interested in, please pop over to github and add your feedback to the issue [neild3r/vscode-php-docblocker#17](https://github.com/neild3r/vscode-php-docblocker/issues/17).

Please also feel free to suggest new configuration options, I appreciate at this time the extension is mostly set up for my own DocBlock style requirements but more options could be added for other use cases.

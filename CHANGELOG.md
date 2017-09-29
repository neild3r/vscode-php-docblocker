# Change Log

All notable changes to the "php-docblocker" extension will be documented in this file.

## [1.3.0] - 2017-09-29
- Add basic HHVM/Hack support
- Change @method snippet to not include a $
- Fix issue when using a referenced function

## [1.2.0] - 2017-05-26
- Add support for PHP7.1 nullable types
- Add config option to allow enforcing short named return types. Thanks @jens1o

## [1.1.0] - 2017-05-20
- Add extra snippets. Thanks @jens1o

## [1.0.0] - 2017-04-20
- Add support for ...$args
- Support PHP7 return types
- Infer boolean return type for methods that start is or has
- Add more @ tags from the PHPDoc documentation
- Fix issue with function typehints using namespaces

## [0.4.2] - 2017-03-31
- Fix travis not getting the right status code back when tests fail
- Fix issue where completion @ tags weren't matching properly

## [0.4.1] - 2017-03-29
- Fix for issue causing built in php intellisense to be broken
- Add code coverage to CI and more unit tests to get full code coverage

## [0.4.0] - 2017-03-17
- Add Inferring of types in properties
- Add Inferring of types using function param defaults
- Fix issue where function parameters passed by reference fail to parse

## [0.3.3] - 2017-03-16
- Fix matching of multiline class properties
- Fix the falling back to a simple block
- Fix issue with multiline arguments with type hints
- Fix `@param` completion spitting out `@var`
- Fix Interface class not triggering
- Refactor unit tests and add more checks and a more comprehensive realworld test

## [0.3.2] - 2017-03-15
- Fixed overflow of function capture meaning it was being applied to properties

## [0.3.1] - 2017-03-15
- Fixed regression in functions without params not triggering

## [0.3.0] - 2017-03-15
- Added unit tests for function signatures and continuous integration
- Added `@package` to completions
- Fixed issue where functions weren't detected in abstract/interface methods
- Fixed support for multiline function signatures

## [0.2.0] - 2017-03-13
- Refactored for potential unit testing
- Switched to use a completion snippet for the main docblock
- Fix bug with function that has no params

## [0.1.1] - 2017-03-12
- Updated readme and display name

## 0.1.0 - 2017-03-12
- Initial release

[Unreleased]: https://github.com/neild3r/vscode-php-docblocker/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/neild3r/vscode-php-docblocker/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/neild3r/vscode-php-docblocker/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/neild3r/vscode-php-docblocker/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.4.2...v1.0.0
[0.4.2]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.3.3...v0.4.0
[0.3.3]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.1.1...v0.2.0
[0.2.0]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.1.0...v0.1.1

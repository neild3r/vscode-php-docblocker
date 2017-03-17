# Change Log

All notable changes to the "php-docblocker" extension will be documented in this file.

## [0.4.0] - 2017-03-17
- Add Inferring of types in properties
- Add Inferring of types using function param defaults

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

[Unreleased]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.3.3...HEAD
[0.3.3]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.1.1...v0.2.0
[0.2.0]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/neild3r/vscode-php-docblocker/compare/v0.1.0...v0.1.1

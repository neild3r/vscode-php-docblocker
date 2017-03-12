# PHP DocBlocker README

Basic PHP DocBlocking extension. This extension was hastily written to cover the temporary gap in a more comprehensive DocBlocking plugin
that covers multiple languages.

## Features

* Tab completion after /** above a class, function, class property
* Continuation of DocBlock when pressing enter when in a DocBlock
* Completion of DocBlock tags such as @param, @return, @throws

## Requirements

This extension has no dependencies.

## Extension Settings

This extension contributes the following settings:

* `php-docblocker.gap`: set to `false` to disable the gap between the description and tags
* `php-docblocker.extra`: an array of extra tags to add to each DocBlock

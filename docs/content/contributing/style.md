# Style Guide

## Source files 

### File name

File names must be PascalCase and the extension must be .js

### File encoding

Source files are encoded in UTF-8.


## Source file structure

### License or copyright information

All files must start with the standard comment including copyright and license information.

### Source code folders

#### bootstrap

Main initialization script will be appended at the end of the minified source file.

#### core

Core classes that must be loaded first

#### criterias

Criteria UI controls.

#### imports

External import js code will be added at the beginning of the minified source file.

#### locales

Translation files, each file must be named using the locale code (en, fr, es, ...), Will be loaded toward the end of the minified source file.

#### modules

Application modules classes, will be loaded by the main application. Class names must finish with `Module`

#### reporting

Reporting module classes

#### templates

Theme classes, Will be loaded toward the end of the minified source file. 
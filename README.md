# FS History

Gives you history of files opened by NodeJS.

Works by wrapping `open` and `openSync` methods in the fs
module. Dirty, I know, but sometimes useful.

## API

The module exposes one `init` function which initialises the
history. Optional argument: list of methods to wrap in the fs
module. `init` returns the `drain` function.

`drain` gives you list of files read since the last `init` or `drain`
call. Clears the internal list of files read.

`init` can be called multiple times creating multiple independent
drains.

## Usage:

    var history = require("fs-history");
    var fs = require("fs");

    var drain = history();

    // … read some files here …

    var file_paths = drain();

## Copying

MIT License, see [COPYING](COPYING)
# FS History

Gives you history of files read by node.

Works by wrapping `open` and `openSync` methods in the fs
module. Dirty, I know.

## API

The module exposes the `init` function which initialises the
history. Optional argument: list of methods to wrap in the fs
module. `init` returns the `drain` function.

`drain` gives you list of files read since the last `init` or `drain`
call. Clears the internal list of files read.

`init` can be called multiple times creating multiple independent
drains.

## Usage:

    var fs = require("fs");
    var drain = history();

    // … read some files here …

    var file_paths = drain();

## Copying

MIT License.
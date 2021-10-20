# Permcon

__Permission Converter__ - A simple utility module to convert file-system
permission from symbolic to octal notation and vice versa. For example,
`rw-rw-r--` to `664` or `743` to `rwxr---wx`. It also has a __cli__, incase you
find it useful.  The library is fully tested with __100%__ test coverage. 

Example Usages:
-----

```javascript
const { isOctal, isSymbolic, analyze, convert } = require("permcon");

isOctal("764") // true
isOctal("0764") // true

isSymbolic("rwxrw-r--") // true
isSymbolic("lrwxrw-r--") // true
isSymbolic("rwxrw-r--") // true

convert("drwxr---wx") // 743
convert("rwxr---wx") // 743

// or the other way around
convert("743") // rwxr---wx

analyze("drwxr---wx")
/*
{
  fileType: 'Directory',
  symbolic: 'rwxr---wx',
  octal: '743',
  owner: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: false },
  other: { read: false, write: true, execute: true }
}
*/
```

CLI
----

##### Help text
```
A simple utility to convert file-system permission from symbolic to octal
notation and vice versa.

Usages: permcon [-a] permission-string or number

Options
-------
1. -a : Analyze the permission and print details.
2. --help: Shows help text
```
##### Examples
```bash
❯ permcon rwxr---wx    
743

❯ permcon 743      
rwxr---wx

❯ permcon drwxr---wx -a                                 
# or

❯ node src/script.js -a drwxrw-r--

file type: Directory
symbolic: rwxrw-r--
octal: 764
-----------------
owner: read, write, execute
group: read, write
other: read
```

If you find a bug then feel free to open an issue or create a pull request :)

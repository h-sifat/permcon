# Permcon

__Permission Converter__ - A simple utility module to convert file-system
permission from symbolic to octal notation and vice versa. For example,
`rw-rw-r--` to `664` or `0743` to `rwxr---wx`. It also has a __cli__, incase you
find it useful.  The library is fully tested with __100%__ test coverage. 

Example Usages:
-----

```javascript
const { isOctal, isSymbolic, analyze, convert } = require("permcon");

isOctal("764") // true
isOctal("0764") // true

isSymbolic("rwxrw-r--") // true
isSymbolic("lrwxrw-r--") // true
isSymbolic("rwSrw-r--") // true

convert("drwxr---wx") // 0743
convert("rwxr---wx") // 0743

// or the other way around
convert("743") // rwxr---wx

analyze("drwxr---wx")
/*
{
  fileType: 'Directory',
  symbolic: 'rwxr---wx',
  octal: '0743',
  owner: { read: true, write: true, execute: true },
  group: { read: true, write: false, execute: false },
  other: { read: false, write: true, execute: true }
  suid: false,
  sgid: false,
  sticky_bit: false
}
*/
```

CLI
----
Install the application globally: `npm i -g permcon`

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
0743

❯ permcon 743      
rwxr---wx

❯ permcon drwxr---wx -a                                 
# or

❯ permcon -a drwxrw-r--

file type: Directory
symbolic: rwxrw-r--
octal: 0764
-----------------
owner: read, write, execute
group: read, write
other: read
-----------------
special permissions: None
```

If you find a bug then feel free to open an issue or create a pull request :)

#!/usr/bin/env node

const { convert, analyze } = require("./index");

const [permStr, hasAnalyzeOption] = (function processArgs() {
  const args = process.argv.slice(2).map((a) => a.trim());
  if (!args.length) {
    console.error(
      `Permission Argument is missing.\nSee help: "permcon --help"`
    );
    process.exit(1);
  } else if (args.length > 2) {
    console.error(`Too many arguments.`);
    process.exit(1);
  }

  if (args.length === 1) {
    if (args[0] === "--help") {
      const helpText = `A simple utility to convert file-system permission from
symbolic to octal notation and vice versa.\n
Usages: permcon [-a] permission-string or number\n
Options
-------
1. -a : Analyze the permission and print details.
2. --help: Shows help text`;

      console.log(helpText);
      process.exit();
    } else return [args[0], false];
  }

  if (!args.includes("-a")) {
    console.error(`Invalid option. Did you mean "-a"?`);
    process.exit(1);
  }

  return [args[args[0] === "-a" ? 1 : 0], true];
})();

try {
  if (hasAnalyzeOption) {
    console.log(formatResult(analyze(permStr)));
  } else console.log(convert(permStr));
} catch (ex) {
  console.error(ex.message);
  process.exit(1);
}

function formatResult(analysis) {
  const { fileType, symbolic, octal, owner, group, other } = analysis;
  const result = `
file type: ${fileType}
symbolic: \x1b[32m${symbolic}\x1b[0m
octal: \x1b[32m${octal}\x1b[0m
-----------------
\x1b[32mowner:\x1b[0m ${getGroupPermissionString(owner)}
\x1b[31mgroup:\x1b[0m ${getGroupPermissionString(group)}
\x1b[33mother:\x1b[0m ${getGroupPermissionString(other)}`;
  return result;
}

function getGroupPermissionString(permObj) {
  let permissions = [];
  Object.keys(permObj).forEach((key) => {
    if (permObj[key]) permissions.push(key);
  });

  return permissions.join(", ");
}

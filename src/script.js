#!/usr/bin/env node

const { convert, analyze, SPECIAL_PERMISSION_NAMES } = require("./index");

const [permStr, hasAnalyzeOption] = (function processArgs() {
  const args = process.argv.slice(2).map((a) => a.trim());
  if (!args.length) {
    console.error(
      chalk(
        `Permission Argument is missing.\nSee help: "permcon --help"`,
        "red"
      )
    );
    process.exit(1);
  } else if (args.length > 2) {
    console.error(chalk(`Too many arguments.`, "red"));
    process.exit(1);
  }
  if (args.length === 1) {
    if (args[0] === "--help") {
      // Lazy load the help text
      console.log(require("./helpText"));
      process.exit();
    } else return [args[0], false];
  }

  if (!args.includes("-a")) {
    console.error(chalk(`Invalid option. Did you mean "-a"?`, "red"));
    process.exit(1);
  }

  return [args[args[0] === "-a" ? 1 : 0], true];
})();

try {
  if (hasAnalyzeOption) {
    console.log(formatResult(analyze(permStr)));
  } else console.log(convert(permStr));
} catch (ex) {
  console.error(chalk(ex.message, "red"));
  process.exit(1);
}

function formatResult(analysis) {
  const {
    fileType,
    symbolic,
    octal,
    owner,
    group,
    other,
    ...specialPermissions
  } = analysis;

  const result = `
file type: ${fileType}
symbolic: ${chalk(symbolic, "green")}
octal: ${chalk(octal, "yellow")}
-----------------
${chalk("owner: ", "green") + getGroupPermissionString(owner)}
${chalk("group: ", "cyan") + getGroupPermissionString(group)}
${chalk("other: ", "yellow") + getGroupPermissionString(other)}
-----------------
${
  chalk("special permissions: ", "green") +
  formatSpecialPermissions(specialPermissions)
}`;
  return result;
}

function formatSpecialPermissions(specialPermissionObject) {
  const permissions = [];
  for (const permission of SPECIAL_PERMISSION_NAMES)
    if (specialPermissionObject[permission]) permissions.push(permission);
  return permissions.length
    ? permissions.map((p) => p.toUpperCase()).join(", ")
    : "None";
}

function getGroupPermissionString(permObj) {
  let permissions = [];
  Object.keys(permObj).forEach((key) => {
    if (permObj[key]) permissions.push(key);
  });

  return permissions.join(", ");
}

function chalk(string, color) {
  const colorValues = {
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
  };
  return `\x1b[${colorValues[color] || 0}m${string}\x1b[0m`;
}

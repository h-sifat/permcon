// Imports
const {
  NOTATION_TYPES,
  octalDigitToRWXTriplet,
  getNotationType,
  isOctal,
  isSymbolic,
} = require("./utils");
const toOctal = require("./toOctal");
const toSymbolic = require("./toSymbolic");

// Global Constants
const CONVERTER = {
  [NOTATION_TYPES.SYMBOLIC]: toOctal,
  [NOTATION_TYPES.OCTAL]: toSymbolic,
};

const FILE_TYPES = {
  "-": "Regular File",
  d: "Directory",
  l: "Symbolic Link",
  b: "Block Device",
  c: "Character Device",
  s: "Socket",
  p: "Named Pipe",
  0: "Unknown",
};

const SPECIAL_PERMISSION_NAMES = ["suid", "guid", "sticky_bit"];

function convert(permStr) {
  const notationType = getNotationType(permStr);
  return CONVERTER[notationType](permStr);
}

function analyze(permStr) {
  const notationType = getNotationType(permStr);

  const fileType = FILE_TYPES[permStr.length === 10 ? permStr.charAt(0) : 0];

  let [symbolicNotation, octalNotation] =
    notationType === NOTATION_TYPES.SYMBOLIC
      ? [permStr, CONVERTER[notationType](permStr)]
      : [CONVERTER[notationType](permStr), permStr];

  if (octalNotation.length === 3) octalNotation = "0" + octalNotation;

  const analysis = {
    fileType,
    symbolic: symbolicNotation,
    octal: octalNotation,
  };

  addGroupWisePermissions(analysis);

  const specialOctalPermNum = +octalNotation.charAt(0);
  addSpecialPermissions(
    analysis,
    SPECIAL_PERMISSION_NAMES,
    octalDigitToRWXTriplet(specialOctalPermNum)
  );

  return analysis;
}

function addSpecialPermissions(obj, permissionNames, permissionValues) {
  permissionNames.forEach((name, i) => (obj[name] = !!permissionValues[i]));
}

function addGroupWisePermissions(analysisObject) {
  const groupNames = ["owner", "group", "other"];
  groupNames.forEach((groupName, index) => {
    const permissionNumArr = octalDigitToRWXTriplet(
      analysisObject.octal.charAt(index + 1)
    );
    analysisObject[groupName] = {
      read: !!permissionNumArr[0],
      write: !!permissionNumArr[1],
      execute: !!permissionNumArr[2],
    };
  });
}

module.exports = {
  convert,
  analyze,
  isSymbolic,
  isOctal,
  SPECIAL_PERMISSION_NAMES,
};

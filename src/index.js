const SYMBOLIC = 1,
  OCTAL = 2;

const CONVERTER = {
  [SYMBOLIC]: toOctal,
  [OCTAL]: toSymbolic,
};

const SPECIAL_PERMISSION_NAMES = ["suid", "guid", "sticky_bit"];

function convert(permStr) {
  const notationType = getNotationType(permStr);
  return CONVERTER[notationType](permStr);
}

function analyze(permStr) {
  const notationType = getNotationType(permStr);
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

  const fileType = FILE_TYPES[permStr.length === 10 ? permStr.charAt(0) : 0];

  let [symbolicNotation, octalNotation] =
    notationType === SYMBOLIC
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
    octalDigitToTriplet(specialOctalPermNum)
  );

  return analysis;
}

// ======================== TO OCTAL ===========================================
function toOctal(symbolicStr) {
  const TRIPLET_LENGTH = 3;
  let octalPermissionString = "",
    specialDigit = 0;

  let i = +(symbolicStr.length === 10); // if length = 10; i = 1 else i = 0
  for (; i < symbolicStr.length; i += 3) {
    const result = processCharTriplet(
      symbolicStr.substr(i, TRIPLET_LENGTH), // triplet
      Math.floor(i / TRIPLET_LENGTH) // triplet index
    );
    octalPermissionString += result.octalValue;
    specialDigit += result.specialValue;
  }

  return specialDigit + octalPermissionString;
}

function processCharTriplet(triplet, tripletIndex) {
  const LAST_TRIPLET_CHAR_INDEX = 2;
  const specialPermValues = [4, 2, 1];
  const charToNum = {
    r: 4,
    w: 2,
    x: 1,
    s: 1,
    S: 0,
    t: 1,
    T: 0,
    "-": 0,
  };

  const octalValue = triplet
    .split("")
    .map((c) => charToNum[c])
    .reduce((a, c) => a + c);

  const specialValue = ["-", "x"].includes(triplet[LAST_TRIPLET_CHAR_INDEX])
    ? 0
    : specialPermValues[tripletIndex];

  return { octalValue, specialValue };
}
// ======================= END TO-OCTAL =======================================

// ======================= TO-SYMBOLIC =========================================
function toSymbolic(octalNotation) {
  let specialValueTriplet = [0, 0, 0];
  if (octalNotation.length === 4) {
    specialValueTriplet = octalDigitToTriplet(octalNotation.charAt(0));
    octalNotation = octalNotation.slice(1);
  }
  return octalNotation
    .split("")
    .map(Number)
    .map((n, i) => digitToCharTriplet(n, i, specialValueTriplet))
    .join("");
}

function digitToCharTriplet(octalDigit, digitIndex, specialValueTriplet) {
  octalDigit = Number(octalDigit);
  const LAST_INDEX = 2;
  const numToChar = {
    4: "r",
    2: "w",
    1: "x",
    0: "-",
  };
  const specialChars = ["s", "s", "t"];

  const triplet = octalDigitToTriplet(octalDigit).map((n) => numToChar[n]);
  if (specialValueTriplet[digitIndex])
    triplet[LAST_INDEX] =
      triplet[LAST_INDEX] === "x"
        ? specialChars[digitIndex]
        : specialChars[digitIndex].toUpperCase();

  return triplet.join("");
}
// ======================= END TO-SYMBOLIC =====================================

// ======================= UTILITIES ===========================================
function octalDigitToTriplet(n) {
  return Array.from([2, 1, 0], (v) => +(n & (1 << v)) && 1 << v);
}

function addSpecialPermissions(obj, permNamesArr, permValuesArr) {
  permNamesArr.forEach((name, i) => (obj[name] = !!permValuesArr[i]));
}

function addGroupWisePermissions(analysisObject) {
  const groupNames = ["owner", "group", "other"];
  groupNames.forEach((groupName, index) => {
    const permissionNumArr = octalDigitToTriplet(
      +analysisObject.octal.charAt(index + 1)
    );
    analysisObject[groupName] = {
      read: !!permissionNumArr[0],
      write: !!permissionNumArr[1],
      execute: !!permissionNumArr[2],
    };
  });
}

function getNotationType(permStr) {
  if (isSymbolic(permStr)) return SYMBOLIC;
  if (isOctal(permStr)) return OCTAL;
  throw new Error(`Invalid permission string: "${permStr}"`);
}

function isOctal(permStr) {
  const OCTAL_NOTATION_PATTERN = /^[0-7]{3,4}$/;
  return OCTAL_NOTATION_PATTERN.test(permStr);
}

function isSymbolic(permStr) {
  const SYMBOLIC_NOTATION_PATTERN =
    /^[bcdlps-]?[r-][w-][xsS-][r-][w-][xsS-][r-][w-][xtT-]$/;
  return SYMBOLIC_NOTATION_PATTERN.test(permStr);
}

module.exports = {
  convert,
  analyze,
  isSymbolic,
  isOctal,
  SPECIAL_PERMISSION_NAMES,
};

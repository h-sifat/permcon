const SYMBOLIC = 1,
  OCTAL = 2;

const CONVERTER = {
  [SYMBOLIC]: symbolicToOctalNotation,
  [OCTAL]: octalToSymbolicNotation,
};

const NOTATION_LENGTH = {
  [SYMBOLIC]: 9,
  [OCTAL]: 3,
};

function getNotationType(permStr) {
  if (isSymbolicNotation(permStr)) return SYMBOLIC;
  else if (isOctalNotation(permStr)) return OCTAL;
  else throw new Error(`Invalid permission string: "${permStr}"`);
}

function isOctalNotation(permStr) {
  const OCTAL_NOTATION_PATTERN = /^0?[0-7]{3}$/;
  return OCTAL_NOTATION_PATTERN.test(permStr);
}

function isSymbolicNotation(permStr) {
  const SYMBOLIC_NOTATION_PATTERN =
    /^[bcdlps-]?[r-][w-][x-][r-][w-][x-][r-][w-][x-]$/;
  return SYMBOLIC_NOTATION_PATTERN.test(permStr);
}

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

  if (permStr.length > NOTATION_LENGTH[notationType])
    permStr = permStr.slice(1);

  const [symbolicNotation, octalNotation] =
    notationType === SYMBOLIC
      ? [permStr, CONVERTER[notationType](permStr)]
      : [CONVERTER[notationType](permStr), permStr];

  return {
    fileType,
    symbolic: symbolicNotation,
    octal: octalNotation,
    owner: tripletToPermObj(symbolicNotation.slice(0, 3)),
    group: tripletToPermObj(symbolicNotation.slice(3, 6)),
    other: tripletToPermObj(symbolicNotation.slice(6, 9)),
  };
}

function symbolicToOctalNotation(symbolicStr) {
  let octalStr = "";
  let i = symbolicStr.length === 10 ? 1 : 0;
  for (; i < symbolicStr.length; i += 3)
    octalStr += symbolTripletToNum(symbolicStr.substr(i, 3));
  return octalStr;
}

function octalToSymbolicNotation(octalStr) {
  if (octalStr.length === 4) octalStr = octalStr.slice(1);
  return octalStr.split("").map(numToSymbolTriplet).join("");
}

function numToSymbolTriplet(num) {
  const numToChar = {
    4: "r",
    2: "w",
    1: "x",
  };

  let triplet = "";

  for (let i = 2; i > -1; i--) {
    const twoPowerI = Math.pow(2, i);
    if (num - twoPowerI > -1) {
      triplet += numToChar[twoPowerI];
      num -= twoPowerI;
    } else triplet += "-";
  }

  return triplet;
}

function symbolTripletToNum(triplet) {
  const charToNum = {
    r: 4,
    w: 2,
    x: 1,
    "-": 0,
  };
  return triplet
    .split("")
    .map((c) => charToNum[c])
    .reduce((a, c) => a + c);
}

function tripletToPermObj(triplet) {
  triplet = triplet.split("").map(isNotDash);
  return {
    read: triplet[0],
    write: triplet[1],
    execute: triplet[2],
  };
}

function isNotDash(char) {
  return char !== "-";
}

module.exports = {
  convert,
  analyze,
  isSymbolic: isSymbolicNotation,
  isOctal: isOctalNotation,
};

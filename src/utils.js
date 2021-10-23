const OCTAL_NOTATION_PATTERN = /^[0-7]{3,4}$/;

const SYMBOLIC_NOTATION_PATTERN =
  /^[bcdlps-]?[r-][w-][xsS-][r-][w-][xsS-][r-][w-][xtT-]$/;

const NOTATION_TYPES = {
  SYMBOLIC: 1,
  OCTAL: 2,
};

function octalDigitToRWXTriplet(digit) {
  digit = Number(digit);
  return Array.from([2, 1, 0], (v) => +(digit & (1 << v)) && 1 << v);
}

function getNotationType(permStr) {
  if (isSymbolic(permStr)) return NOTATION_TYPES.SYMBOLIC;
  if (isOctal(permStr)) return NOTATION_TYPES.OCTAL;
  throw new Error(`Invalid permission string: "${permStr}"`);
}

function isOctal(permStr) {
  return OCTAL_NOTATION_PATTERN.test(permStr);
}

function isSymbolic(permStr) {
  return SYMBOLIC_NOTATION_PATTERN.test(permStr);
}

module.exports = {
  NOTATION_TYPES,
  octalDigitToRWXTriplet,
  getNotationType,
  isOctal,
  isSymbolic,
};

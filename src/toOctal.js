const TRIPLET_LENGTH = 3;
const LAST_TRIPLET_CHAR_INDEX = 2;
const SPECIAL_PERMISSION_VALUES = [4, 2, 1];
const DIGIT_FOR_CHAR = {
  r: 4,
  w: 2,
  x: 1,
  s: 1,
  S: 0,
  t: 1,
  T: 0,
  "-": 0,
};

function toOctal(symbolicStr) {
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
  const octalValue = triplet
    .split("")
    .map((c) => DIGIT_FOR_CHAR[c])
    .reduce((a, c) => a + c);

  const specialValue = ["-", "x"].includes(triplet[LAST_TRIPLET_CHAR_INDEX])
    ? 0
    : SPECIAL_PERMISSION_VALUES[tripletIndex];

  return { octalValue, specialValue };
}

module.exports = toOctal;

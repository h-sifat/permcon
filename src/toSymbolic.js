const { octalDigitToRWXTriplet } = require("./utils");

const LAST_TRIPLET_INDEX = 2;
const CHAR_FOR_DIGIT = {
  4: "r",
  2: "w",
  1: "x",
  0: "-",
};
const SPECIAL_CHARS = ["s", "s", "t"];

function toSymbolic(octalNotation) {
  let specialValueTriplet = [0, 0, 0];
  if (octalNotation.length === 4) {
    specialValueTriplet = octalDigitToRWXTriplet(octalNotation.charAt(0));
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

  const triplet = octalDigitToRWXTriplet(octalDigit).map(
    (digit) => CHAR_FOR_DIGIT[digit]
  );
  if (specialValueTriplet[digitIndex])
    triplet[LAST_TRIPLET_INDEX] =
      triplet[LAST_TRIPLET_INDEX] === "x"
        ? SPECIAL_CHARS[digitIndex]
        : SPECIAL_CHARS[digitIndex].toUpperCase();

  return triplet.join("");
}

module.exports = toSymbolic;

const { isOctal, isSymbolic, analyze, convert } = require("../src");

describe("isOctal", () => {
  it("should return true for valid octal permission strings", () => {
    ["123", "0764"].forEach((val) => {
      expect(isOctal(val)).toBeTruthy();
    });
  });

  it("should return false for invalid octal permission strings", () => {
    ["23242", "8349", "23434"].forEach((val) => {
      expect(isOctal(val)).toBeFalsy();
    });
  });
});

describe("isSymbolic", () => {
  it("should return true for valid symbolic permission strings", () => {
    ["drw-rw-r--", "rwxr---wx", "rwxr-xr--"].forEach((val) => {
      expect(isSymbolic(val)).toBeTruthy();
    });
  });

  it("should return false for invalid symbolic permission strings", () => {
    ["rdrw-rw-r--", "frxr---wx", "rwar-xr--"].forEach((val) => {
      expect(isSymbolic(val)).toBeFalsy();
    });
  });
});

describe("convert", () => {
  it("should conver sym to octal and vice versa", () => {
    [
      ["rw-rw-r--", "0664"],
      ["rwxr---wx", "0743"],
      ["rwxr-xr--", "0754"],
    ].forEach(([s, o]) => {
      expect(convert(s)).toEqual(o);
      expect(convert(o)).toEqual(s);
    });
  });

  it("should ignore the 1st the character of a 10 char long string", () => {
    expect(convert("drw-rw-r--")).toEqual("0664");
  });

  it("should ignore the first 0 of a 4 char octal string", () => {
    expect(convert("0664")).toEqual("rw-rw-r--");
  });

  it("should throw an error if invalid string is passed", () => {
    expect(() => {
      convert("a;sdlfjasdf");
    }).toThrowError();
  });
});

describe("analyze", () => {
  const symbolicPermission = "drwsr---wT";
  const expectedResult = {
    fileType: "Directory",
    symbolic: symbolicPermission,
    octal: "5742",
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: false },
    other: { read: false, write: true, execute: false },
    suid: true,
    guid: false,
    sticky_bit: true,
  };

  it("should return the analyzed permission object", () => {
    expect(analyze(symbolicPermission)).toEqual(expectedResult);
  });
});

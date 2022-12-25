const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

const snafuNumbers = file.trim().split("\n");

const snafuDigitValue = (snafuDigit) =>
  ({
    "=": -2,
    "-": -1,
    0: 0,
    1: 1,
    2: 2,
  }[snafuDigit]);

const toSnafuDigit = (decimalValue) =>
  ({
    "-2": "=",
    "-1": "-",
    0: "0",
    1: "1",
    2: "2",
  }[decimalValue]);

const decodeSnafuNumber = (snafuNumber) =>
  snafuNumber
    .split("")
    .reverse()
    .reduce(
      (sum, digit, index) => sum + snafuDigitValue(digit) * 5 ** index,
      0
    );

const encodeSnafuNumber = (number) => {
  let numDigits = Math.ceil(Math.log(2 * number) / Math.log(5));
  let snafuNumber = "";
  for (let i = numDigits - 1; i >= 0; i--) {
    let digitValue = Math.round(number / 5 ** i);
    number -= digitValue * 5 ** i;
    snafuNumber += toSnafuDigit(digitValue);
  }
  return snafuNumber;
};

console.log(
  "Part 1:",
  encodeSnafuNumber(
    snafuNumbers.reduce((sum, snafuNumber) => {
      return sum + decodeSnafuNumber(snafuNumber);
    }, 0)
  )
);

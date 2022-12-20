const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

const DECRYPTION_KEY = 811589153;
const COORD_OFFSETS = [1000, 2000, 3000];

const numbers = file
  .trim()
  .split("\n")
  .map(Number)
  .map((number, originalIndex) => ({ number, originalIndex }));

// mod function, but normalized to give a result between 0 and m-1
const mod = (n, m) => ((n % m) + m) % m;

const mixOne = (numbers, originalIndex) => {
  // Find the index of the number with the given original index
  const indexToRemove = numbers.findIndex(
    (n) => n.originalIndex === originalIndex
  );

  // extract it
  const number = numbers.splice(indexToRemove, 1)[0];

  // figure out where to put it next
  const indexToInsert = mod(indexToRemove + number.number, numbers.length);

  // insert it in the new position
  numbers.splice(indexToInsert, 0, number);
};

const mix = (numbers, numTimes = 1) => {
  for (let n = 0; n < numTimes; n++)
    for (let i = 0; i < numbers.length; i++) mixOne(numbers, i);
  return numbers;
};

const extractCoordinates = (numbers) => {
  const indexNumberZero = numbers.findIndex(({ number }) => number === 0);
  return COORD_OFFSETS.reduce(
    (sum, offset) =>
      sum + numbers[mod(indexNumberZero + offset, numbers.length)].number,
    0
  );
};

const applyDecryptionKey = (numbers) =>
  numbers.map((number) => ({
    ...number,
    number: number.number * DECRYPTION_KEY,
  }));

const mixAndExtractCoordinates = (
  originalNumbers,
  numTimes = 1,
  decrypt = false
) =>
  extractCoordinates(
    mix([...(decrypt ? applyDecryptionKey(numbers) : numbers)], numTimes)
  );

console.log("Part 1:", mixAndExtractCoordinates(numbers));
console.log("Part 2:", mixAndExtractCoordinates(numbers, 10, true));

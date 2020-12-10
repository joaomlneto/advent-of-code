const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8');

console.log('filename                ', filename)

const numbers = file.split('\n')
  .filter(line => line.length > 0)
  .map(str => Number(str))
  .sort((a, b) => a - b)

function generateDiffs(numbers) {
  let diffs = []
  // add difference between outlet and lowest adapter
  diffs[0] = numbers[0]
  // add difference between adapters
  for(let i=1; i < numbers.length; i++) {
    diffs[i] = numbers[i] - numbers[i-1]
  }
  // add difference between largest adapter and device
  diffs[numbers.length] = 3
  return diffs
}

function countValues(array, value) {
  return array.filter(v => v === value).length
}


// PART 1

const diffs = generateDiffs(numbers)
const part1 = countValues(diffs, 1) * countValues(diffs, 3)
console.log('Part 1 result =', part1)


// PART 2

function countCombinations(numbers, cache = {}) {
  // check if we managed to connect to the device
  if (numbers.length == 1) {
    cache[numbers[0]] = 1
    return cache
  }

  const [number, ...remaining] = numbers

  // check if cached
  if (cache[number]) return cache

  let numCombinations = 0

  for (let i = 0; i < Math.min(remaining.length, 3); i++) {
    if (remaining[i] - number <= 3) {
      cache = countCombinations(numbers.slice(i+1), cache)
      numCombinations += cache[remaining[i]]
    }
  }

  cache[number] = numCombinations;
  return cache;
}

console.log("Part 2 result =", countCombinations([0, ...numbers, numbers[numbers.length-1] + 3])[0])

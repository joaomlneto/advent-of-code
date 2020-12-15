const fs = require('fs')

const filename = 'sample.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const startingNumbers = file
  .split('\n')[0]
  .split(',')
  .map(s => Number(s))

function getNthNumber(startingNumbers, numTurns) {
  // build initial memory
  // NOTE: If we use an oversized preallocated array, it runs faster :-)
  // In my machine, with a massive preallocated array, takes <2 seconds
  // But this prevents the massive space wastage and runs in <5 seconds
  let memory = new Map(startingNumbers.map((num, i) => [num, i]))
  let lastNumber = startingNumbers[startingNumbers.length - 1]

  for (let i = startingNumbers.length; i < numTurns; i++) {
    const thisIndex = i - 1
    const number = memory.has(lastNumber) ? thisIndex - memory.get(lastNumber) : 0
    memory.set(lastNumber, thisIndex)
    lastNumber = number
  }
  return lastNumber
}

console.log('Part 1 =', getNthNumber(startingNumbers, 2020))
console.log('Part 2 =', getNthNumber(startingNumbers, 30000000))

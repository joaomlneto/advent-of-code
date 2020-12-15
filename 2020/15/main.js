const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const INDEX_PART_1 = 2020
const INDEX_PART_2 = 30000000
const N = INDEX_PART_2

const startingNumbers = file
  .split('\n')[0]
  .split(',')
  .map(s => Number(s))

function getNthNumber(startingNumbers, numTurns) {
  // build initial memory
  let memory = Array(numTurns)
  console.log('memory size', memory.length)
  for (let i = 0; i < startingNumbers.length - 1; i++) {
    memory[startingNumbers[i]] = i
  }

  let lastNumber = startingNumbers[startingNumbers.length - 1]

  for (let i = startingNumbers.length; i < numTurns; i++) {
    const thisIndex = i - 1
    const number = memory[lastNumber] === undefined ? 0 : thisIndex - memory[lastNumber];
    memory[lastNumber] = thisIndex
    lastNumber = number

    // Show progress
    if (i % (Math.floor(numTurns / 100)) == 0) {
      console.log('Memory size =', Object.keys(memory).length)
      console.log('Progress: ', i / Math.floor(numTurns / 100), '%')
    }
  }
  return lastNumber
}

console.log('Part 1 =', getNthNumber(startingNumbers, INDEX_PART_1))
console.log('Part 2 =', getNthNumber(startingNumbers, INDEX_PART_2))

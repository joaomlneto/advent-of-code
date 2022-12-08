const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// parse input file
const elfs = file
    .split('\n\n') // split file into groups of lines (one for each elf)
    .map(elf => elf.split('\n') // for each of the elfs, convert the several lines into an array
        .filter(x => x) // remove empty lines
        .map(line => parseInt(line))) // map each line into an integer

// compute sums of calories for each elf
const sums = elfs.map(elf => elf.reduce((a, b) => a + b, 0))
// sort sums in descending order
sums.sort((a, b) => b - a)

console.log('Part 1:', sums[0])
console.log('Part 2:', sums[0] + sums[1] + sums[2])

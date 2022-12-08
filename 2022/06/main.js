const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// parse input file
const signal = file.split('')

const findFirstGroupAllUnique = (signal, n) => {
    for (let i = n; i < signal.length; i++) {
        if (new Set(signal.slice(i - n, i)).size === n) {
            return i
        }
    }
}

console.log('Part 1:', findFirstGroupAllUnique(signal, 4))
console.log('Part 2:', findFirstGroupAllUnique(signal, 14))

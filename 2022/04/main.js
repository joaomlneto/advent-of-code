const fs = require('fs')

const filename = 'sample.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// parse input file
const pairs = file.split('\n').filter(x => x)
    .map(line => line.split(',')
        .map(elf => elf.split('-').map(Number))
        .map(([from, to]) => ({ from, to })))

console.log('Part 1:', pairs.filter(([a, b]) => a.from <= b.from && b.to <= a.to || b.from <= a.from && a.to <= b.to).length)
console.log('Part 2:', pairs.filter(([a, b]) => a.from <= b.to && b.from <= a.to).length)



const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// parse input file
const lines = file.split('\n').filter(x => x)

const intersection = (a, b, c) => a.filter(x => b.includes(x) && (!c || c.includes(x)))

const priority = item => item === item.toUpperCase()
    ? item.charCodeAt(0) + 27 - 65 // A = 65
    : item.charCodeAt(0) + 1 - 97 // a = 97

console.log('Part 1:', lines
    .map(line => ({
        first: line.substring(0, Math.floor(line.length / 2)).split(''),
        second: line.substring(Math.floor(line.length / 2)).split('')
    }))
    .reduce((acc, rucksack) => acc + priority(intersection(rucksack.first, rucksack.second)[0]), 0))


console.log('Part 2:', lines
    .reduce((acc, elf, index) => {
        const chunkIndex = Math.floor(index / 3)
        if (!acc[chunkIndex]) acc[chunkIndex] = []
        acc[chunkIndex].push(elf.split(''))
        return acc
    }, [])
    .reduce((acc, group) => acc + priority(intersection(group[0], group[1], group[2])[0]), 0))

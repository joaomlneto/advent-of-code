const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const notes = file.split('\n')
    .map(line => ({
        signalPatterns: line.split(' | ')[0].split(' '),
        outputValue: line.split(' | ')[1].split(' ')
    }))

const easyDigits = [1, 4, 7, 8]
const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
const numberSegmentsLit = {0: 6, 1: 2, 2: 5, 3: 5, 4: 4, 5: 5, 6: 6, 7: 3, 8: 7, 9: 6}

const countEasyEntriesInOutput = (notes) => {
    const numSegmentsLitEasyNumbers = easyDigits.map(n => numberSegmentsLit[n])
    return notes.map(entry => entry.outputValue)
        .flat()
        .filter(n => numSegmentsLitEasyNumbers.includes(n.length))
        .length
}

// probably best to use a CSP solver, …
// if you're reading this, I'm terribly sorry. But hey! It works!
const unscramblePatterns = (patterns) => {
    const digitSegments = []
    const segmentMapping = {}
    // do the easy digits
    easyDigits.forEach(digit => digitSegments[digit] = patterns.filter(p => p.length === numberSegmentsLit[digit])[0])
    // check segment 'a': it is the one in digit 7, but not in digit 1
    segmentMapping['a'] = digitSegments[7].split('').filter(s => !digitSegments[1].includes(s))[0]
    // check digit 6: it has 6 segments, but does not contain all segments in digit 1
    digitSegments[6] = patterns.filter(p => p.length === 6 && !digitSegments[1].split('').every(s => p.includes(s)))[0]
    // check segment 'c': it is missing in digit 6
    segmentMapping['c'] = segments.filter(s => !digitSegments[6].includes(s))[0]
    // check segment 'f': it is in digit 1, but it's not segment c
    segmentMapping['f'] = digitSegments[1].split('').filter(s => s !== segmentMapping['c'])[0]
    // check digit 2: has 5 segments, but not segment f
    digitSegments[2] = patterns.filter(p => p.length === 5 && !p.split('').includes(segmentMapping['f']))[0]
    // check digit 3: has 5 segments, including segment c (and is different from 2)
    digitSegments[3] = patterns.filter(p => p.length === 5 && p.split('').includes(segmentMapping['c']) && p != digitSegments[2])[0]
    // check digit 5: has 5 segments, but is not digit 2 nor digit 3
    digitSegments[5] = patterns.filter(p => p.length === 5 && p != digitSegments[2] && p != digitSegments[3])[0]
    // check digit 9: has 6 segments, including all those from 4
    digitSegments[9] = patterns.filter(p => p.length === 6 && digitSegments[4].split('').every(s => p.includes(s)))[0]
    // check digit 0: it is the remaining digit
    digitSegments[0] = patterns.filter(p => p.length === 6 && p != digitSegments[6] && p != digitSegments[9])[0]
    // sort list of segments in each digit alphabetically
    return digitSegments.map((segments) => segments.split('').sort().join(''))
}

// given an output and the mapping of segments, get its digits
const unscrambleOutput = (output, mapping) => output.map(segments => mapping.indexOf(segments.split('').sort().join('')))

// given an entry, get the integer value of its output after unscrambling
const entryOutput = (entry) => parseInt(unscrambleOutput(entry.outputValue, unscramblePatterns(entry.signalPatterns)).join(''))

// given the list of notes, unscramble the outputs and sum their values
const sumOfOutputs = (notes) => notes.map(entry => entryOutput(entry)).reduce((a, b) => a + b, 0)

console.log('Part 1 =', countEasyEntriesInOutput(notes))
console.log('Part 2 =', sumOfOutputs(notes))
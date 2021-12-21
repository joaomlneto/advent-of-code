const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const vowels = ['a', 'e', 'i', 'o', 'u']
const unniceStrings = ['ab', 'cd', 'pq', 'xy']

const isVowel = char => vowels.includes(char)
const hasAtLeast3Vowels = str => str.split('').filter(isVowel).length >= 3
const hasRepeatedConsecutiveLetter = str => /(.)\1/.test(str)
const hasUnniceStrings = str => unniceStrings.some(unniceString => str.includes(unniceString))
const isNiceStringPart1 = str => hasAtLeast3Vowels(str) && hasRepeatedConsecutiveLetter(str) && !hasUnniceStrings(str)

const containsRepeatedPair = str =>
    str.length >= 4 && (str.slice(2).includes(str.slice(0, 2)) || containsRepeatedPair(str.slice(1)))
const containsRepeatingLetterWithOneLetterBetween = str =>
    str.length >= 3 && (str[0] === str[2] || containsRepeatingLetterWithOneLetterBetween(str.slice(1)))
const isNiceStringPart2 = str => containsRepeatedPair(str) && containsRepeatingLetterWithOneLetterBetween(str)

const strings = file.split('\n')

console.log('Part 1 =', strings.filter(isNiceStringPart1).length)
console.log('Part 2 =', strings.filter(isNiceStringPart2).length)

const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const [min, max] = file.trim().split('-').map(Number)

function findPasswords(min, max, validatorFunction) {
  let total = 0
  for (let i = min; i < max; i++)
    if (validatorFunction(i)) total++
  return total
}

function isValidPasswordPart1(n) {
  let hasAdjacentDigits = false
  const digits = '' + n
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] < digits[i-1]) return false
    if (digits[i] == digits[i-1]) hasAdjacentDigits = true
  }
  return hasAdjacentDigits
}

function isValidPasswordPart2(n) {
  let hasAdjacentDigits = false
  const digits = '' + n
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] < digits[i-1]) return false
    if (!hasAdjacentDigits && digits[i] == digits[i-1]) {
      hasAdjacentDigits =
        (i === 1 || digits[i-1] !== digits[i-2]) &&
        (i === digits.length - 1 || digits[i] !== digits[i+1])
    }
  }
  return hasAdjacentDigits
}

console.log('Part 1 =', findPasswords(min, max, isValidPasswordPart1))
console.log('Part 2 =', findPasswords(min, max, isValidPasswordPart2))

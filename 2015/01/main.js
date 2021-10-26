const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const input = file.trim().split('').map(c => (c == '(') ? 1 : -1)

function findBasementIndex(array) {
  let i = 0
  for (let sum = 0; sum >= 0; sum += array[i++]);
  return i
}

console.log('Part 1 =', input.reduce((a, b) => a + b))
console.log('Part 2 =', findBasementIndex(input))

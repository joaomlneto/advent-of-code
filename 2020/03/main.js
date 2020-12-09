const fs = require('fs')

function xor(a,b) {
  return ( a || b ) && !( a && b );
}

const file = fs.readFileSync('input.txt').toString('utf8');

const map = file.split('\n')
  .filter(line => line.length > 1)

console.log('Num trees (part 1) =', checkSlope(map, 3))

function checkSlope(map, numRight, numDown = 1) {
  let numTrees = 0;
  for (let row = 0; row < map.length; row += numDown) {
    const col = (row / numDown) * numRight % (map[0].length);
    if (map[row][col] == '#') numTrees++
  }
  return Number(numTrees);
}

const trees_1_1 = checkSlope(map, 1, 1)
const trees_3_1 = checkSlope(map, 3, 1)
const trees_5_1 = checkSlope(map, 5, 1)
const trees_7_1 = checkSlope(map, 7, 1)
const trees_1_2 = checkSlope(map, 1, 2)
const result = trees_1_1 * trees_3_1 * trees_5_1 * trees_7_1 * trees_1_2

console.log('Right 1, Down 1 =', trees_1_1)
console.log('Right 3, Down 1 =', trees_3_1)
console.log('Right 5, Down 1 =', trees_5_1)
console.log('Right 7, Down 1 =', trees_7_1)
console.log('Right 1, Down 2 =', trees_1_2)
console.log('Part 2 =', result)

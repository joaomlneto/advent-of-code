const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const componentMasses = file.trim().split('\n').map(value => Number(value))

function fuelRequirementPart1(mass) {
  return Math.floor(mass/3) - 2
}

function fuelRequirementPart2(mass) {
  let totalFuel = 0
  while (mass > 6) {
    mass = fuelRequirementPart1(mass)
    totalFuel += mass
  }
  return totalFuel
}

console.log('Part 1 =', componentMasses
  .map(fuelRequirementPart1)
  .reduce((a, b) => a + b, 0))

console.log('Part 2 =', componentMasses
.map(fuelRequirementPart2)
.reduce((a, b) => a + b, 0))

const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const orbits_list = file.trim().split('\n')
  .map(line => line.split(')'))
  .map(([orbits, object]) => ({
    object, orbits
  }))

const objects = {}
orbits_list.forEach(({object, orbits}) => objects[object] = orbits)

function objectOrbits(objects, object) {
  const subOrbits = []
  while (object !== 'COM') {
    object = objects[object]
    subOrbits.push(object)
  }
  return subOrbits
}

function findOrbitalTransfers(objects, objA, objB) {
  const orbitsA = objectOrbits(objects, objA).reverse()
  const orbitsB = objectOrbits(objects, objB).reverse()
  while(orbitsA[1] === orbitsB[1]) {
    orbitsA.shift()
    orbitsB.shift()
  }
  return [...orbitsA.reverse(), ...orbitsB.slice(1)]
}


console.log('Part 1 =', Object.keys(objects)
  .map(object => objectOrbits(objects, object).length)
  .reduce((a, b) => a + b))

console.log('Part 2 =', findOrbitalTransfers(objects, 'YOU', 'SAN').length - 1)

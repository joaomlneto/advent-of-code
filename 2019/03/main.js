const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const wires = file.trim().split('\n')
  .map(wire => wire.split(',')
    .map(instr => ({
      direction: instr.slice(0, 1),
      units: Number(instr.slice(1)),
    })))

const manhattanDistance = ([row, col]) => Math.abs(row) + Math.abs(col)
const setIntersection = (a, b) => new Set([...a].filter(x => b.has(x)))
const arraysAreEqual = (a, b) =>
  a.length === b.length && a.every((v, i) => v === b[i])

const move = {
  'U': ([row, col]) => [row - 1, col],
  'D': ([row, col]) => [row + 1, col],
  'L': ([row, col]) => [row, col - 1],
  'R': ([row, col]) => [row, col + 1],
}

function mapWire(wire) {
  const map = new Set()
  let pos = [0, 0]
  for (const instruction of wire)
    for (let i = 0; i < instruction.units; i++) {
      pos = move[instruction.direction](pos)
      map.add(pos.slice().toString())
    }
  return map
}

function findWireIntersections(wires) {
  return [...wires.map(mapWire).reduce(setIntersection)]
    .map(str => str.split(',').map(Number))
}

function wireDelay(wire, intersection) {
  let pos = [0, 0]
  let delay = 0
  for (const instruction of wire)
    for (let i = 0; i < instruction.units; i++) {
      pos = move[instruction.direction](pos)
      delay++
      if (arraysAreEqual(pos, intersection))
        return delay
    }
}

function intersectionDelay(wires, intersection) {
  return wires
    .map(wire => wireDelay(wire, intersection))
    .reduce((a, b) => a + b, 0)
}

const intersections = findWireIntersections(wires)
const manhattanDistances = intersections.map(manhattanDistance)
const intersectionDelays = intersections.map(i => intersectionDelay(wires, i))

console.log('Part 1 =', Math.min(...manhattanDistances))
console.log('Part 2 =', Math.min(...intersectionDelays))

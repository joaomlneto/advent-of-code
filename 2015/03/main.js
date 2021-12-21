const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const moves = file.split('')

const displacement = move => ({
    '>': {x:  1, y:  0},
    '<': {x: -1, y:  0},
    '^': {x:  0, y:  1},
    'v': {x:  0, y: -1},
}[move])
const startPosition = {x:0, y:0}
const addPositions = (a, b) => ({x: a.x + b.x, y: a.y + b.y})
const nextPosition = (position, move) => addPositions(position, displacement(move))
const keyOf = position => `${position.x},${position.y}`
const givePresent = (houses, position) =>
    houses[keyOf(position)] = 1 + houses[keyOf(position)] ? houses[keyOf(position)] : 0

const splitMoveListsEvenOdd = array =>
    array.reduce(([odd, even], move, i) =>
        i % 2 == 0 ? [[...odd, move], even] : [odd, [...even, move]],
        [[], []])

const initialHouses = () => ({[keyOf(startPosition)]: 1})

const doMoves = (moves, houses = initialHouses(), position = startPosition) =>
    moves.forEach(move => givePresent(houses, position = nextPosition(position, move))) || houses

const spedUpProcess = moves =>
    splitMoveListsEvenOdd(moves).reduce((houses, moves) => doMoves(moves, houses), initialHouses())

console.log('Part 1 =', Object.keys(doMoves(moves)).length)
console.log('Part 2 =', Object.keys(spedUpProcess(moves)).length)
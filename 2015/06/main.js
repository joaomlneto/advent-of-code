const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const toPositionObject = ([row, col]) => ({row, col})

const instructions = file.split('\n')
    .map(line => line.split(' '))
    .map(tokens => ({
        command: tokens.at(-4),
        from: toPositionObject(tokens.at(-3).split(',').map(Number)),
        to: toPositionObject(tokens.at(-1).split(',').map(Number))
    }))

const range = (from, to) => Array.from({length: to - from + 1}, (v, k) => k + from)
const createGrid = (n = 1000) => [...Array(n).keys()].map(_ => [...Array(n).keys()].fill(0))
const sumGrid = grid => grid.flat().reduce((a, b) => a + b, 0)

const applyCommandPart1 = (command, previous) => ({
    'on': 1,
    'off': 0,
    'toggle': (previous + 1) % 2,
}[command])

const applyCommandPart2 = (command, previous) => ({
    'on': previous + 1,
    'off': Math.max(previous - 1, 0),
    'toggle': previous + 2,
}[command])

const applyInstruction = (grid, instruction, commandExecutor) =>
    range(instruction.from.row, instruction.to.row).forEach(row =>
        range(instruction.from.col, instruction.to.col).forEach(col =>
            grid[row][col] = commandExecutor(instruction.command, grid[row][col])))

const applyInstructions = (instructions, commandExecutor, grid = createGrid()) =>
    instructions.forEach(instruction => applyInstruction(grid, instruction, commandExecutor)) || grid

console.log('Part 1 =', sumGrid(applyInstructions(instructions, applyCommandPart1)))
console.log('Part 2 =', sumGrid(applyInstructions(instructions, applyCommandPart2)))
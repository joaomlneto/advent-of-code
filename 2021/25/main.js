const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const DEBUG_PRINT = false

const EMPTY = '.'
const RIGHT = '>'
const DOWN  = 'v'

const printGrid = grid => DEBUG_PRINT ? grid.forEach(line => console.log(line.join(''))) : 0
const log = (...msg) => DEBUG_PRINT ? console.log(...msg) : 0

const copyGrid = grid => grid.map(row => row.slice())

const moveRight = grid => {
    let nextGrid = copyGrid(grid)
    let numChanges = 0
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const nextCol = (col+1) % grid[row].length
            if (grid[row][col] === RIGHT && grid[row][nextCol] === EMPTY) {
                nextGrid[row][col] = EMPTY
                nextGrid[row][nextCol] = RIGHT
                numChanges++
            }
        }
    }
    return {nextGrid, numChanges}
}

const moveDown = grid => {
    let nextGrid = copyGrid(grid)
    let numChanges = 0
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const nextRow = (row+1) % grid.length
            if (grid[row][col] === DOWN && grid[nextRow][col] === EMPTY) {
                nextGrid[row][col] = EMPTY
                nextGrid[nextRow][col] = DOWN
                numChanges++
            }
        }
    }
    return {nextGrid, numChanges}
}

const doStep = grid => {
    let numChanges = 0
    const rightResult = moveRight(grid)
    numChanges += rightResult.numChanges
    const downResult = moveDown(rightResult.nextGrid)
    numChanges += downResult.numChanges
    return {nextGrid: downResult.nextGrid, numChanges}
}

const doStepsUntilNoChanges = grid => {
    let numSteps = 0
    log('Initial grid:')
    printGrid(grid)
    while (true) {
        const {nextGrid, numChanges} = doStep(grid)
        grid = nextGrid
        numSteps++
        log('\n\nAfter', numSteps, 'steps: (numchanges', numChanges + ')')
        printGrid(grid)
        if (numChanges === 0) break;
    }
    return numSteps
}

const grid = file.split('\n').map(line => line.split(''))

console.log('Part 1 =', doStepsUntilNoChanges(grid))
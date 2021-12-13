const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const grid = file.split('\n').map(row => row.split('').map(n => parseInt(n)))

// pretty-prints grid
const printGrid = (grid) => grid.forEach(row => console.log(row.join('')))

// object that represents a position in the grid. (0,0) is top left.
const position = (row, col) => ({row, col})

// checks whether the energy level represents a flashing octopus
const isFlashingEnergy = (energy) => energy === 0

// checks if octopus on given position is flashing
const positionIsFlashing = (grid, pos) => isFlashingEnergy(grid[pos.row][pos.col])

// generates a list of all positions in the grid
const gridCoordinates = (grid) => grid.map((r, row) => r.map((_, col) => position(row, col))).flat()

// increments octopus energy level at a given position
const incrementEnergy = (grid, pos) => grid[pos.row][pos.col] = (grid[pos.row][pos.col] + 1) % 10

// increments all energy levels by 1 (sets to zero if energy > 9)
const incrementAllEnergyLevels = (grid) => grid.map(row => row.map(energy => (energy + 1) % 10))

// returns number of flashing octopi in the grid
const numFlashes = (grid) => grid.flat().filter(energy => isFlashingEnergy(energy)).length

// checks whether all octopus are synchronozed
const isSynchronizedFlash = (grid) => grid.flat().every(energy => isFlashingEnergy(energy))

const neighborOffsets =
    [-1, 0, 1].map(row => [-1, 0, 1].map(col => position(row, col))).flat()

// returns list of adjacent positions to the given coordinates
const adjacentPositions = (grid, pos) =>
    // generate all 9 positions centered on (row, col)
    [-1, 0, 1].map(row => [-1, 0, 1].map(col => position(row, col))).flat() // offset
        .map(offset => ({row: pos.row + offset.row, col: pos.col + offset.col})) // add pos to offset
        // remove the center position (we just want the neighbors)
        .filter(adjPos => adjPos.row !== pos.row || adjPos.col !== pos.col)
        // remove positions with invalid rows
        .filter(adjPos => adjPos.row >= 0 && adjPos.row < grid.length)
        // remove positions with invalid columns
        .filter(adjPos => adjPos.col >= 0 && adjPos.col < grid[pos.row].length)

// return list of positions that are currently flashing in the grid
const flashPositions = (grid) => gridCoordinates(grid).filter(pos => isFlashingEnergy(grid[pos.row][pos.col]))

// propagate existing flashes on the grid to the neighbors, and their neighbors, and their neighbors, …
const propagateFlashes = (grid) => {
    for (const notPropagated = flashPositions(grid); notPropagated.length > 0; ) {
        const flashPos = notPropagated.pop()
        // find adjacent positions that are not flashing
        const nonFlashingAdjacents = adjacentPositions(grid, flashPos).filter(adjPos => !positionIsFlashing(grid, adjPos))
        // increment their energy levels
        nonFlashingAdjacents.forEach(adjPos => incrementEnergy(grid, adjPos))
        // if they suddenly start flashing, mark them to be propagated later
        notPropagated.push(...nonFlashingAdjacents.filter(adjPos => positionIsFlashing(grid, adjPos)))
    }
    return grid
}

const nextStep = (grid) => propagateFlashes(incrementAllEnergyLevels(grid))

const countFlashesAfter100Steps = (grid) => {
    let totalFlashes = 0
    for (let i = 0; i < 100; i++) {
        grid = nextStep(grid)
        totalFlashes += numFlashes(grid)
    }
    return totalFlashes
}

const findFirstSynchronizationStep = (grid) => {
    for (let step = 1; ; step++)
        if (isSynchronizedFlash(grid = nextStep(grid)))
            return step
}

console.log('Part 1 =', countFlashesAfter100Steps(grid))
console.log('Part 2 =', findFirstSynchronizationStep(grid))
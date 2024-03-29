const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const heightmap = file.split('\n').map(line => line.split('').map(heightStr => parseInt(heightStr)))

// position object represents a position on the heightmap
const position = (row, col) => ({row, col})

// checks if given position is a low point (returns true if is lower than all adjacent positions, false otherwise)
const isLowPoint = (heightmap, r, c) =>
    adjacentPositions(heightmap, r, c).every(({row, col}) => heightmap[row][col] > heightmap[r][c])

// computes the risk level of a position
const riskLevel = (height) => height + 1

// returns the list of positions ({row, col}) that are low points
const lowPoints = (heightmap) =>
    // map all coordinates to their {row, col} positions
    heightmap.map((row, rowIndex) => row.map((value, colIndex) => position(rowIndex, colIndex)))
        // turn the 2D array into a 1D array
        .flat()
        // filter out those that are not low points
        .filter(({row, col}) => isLowPoint(heightmap, row, col))

// returns the sum of risk levels of all the low points
const sumOfLowPointRiskLevels = (heightmap) =>
    // given the list of low points, map them to their risk level
    lowPoints(heightmap).map(({row, col}) => riskLevel(heightmap[row][col]))
        // and compute their sum
        .reduce((a, b) => a + b, 0)

// returns the list of adjacent positions to a given position
const adjacentPositions = (heightmap, row, col) => [
    ...(row === 0 ? [] : [position(row - 1, col)]),
    ...(row === heightmap.length - 1 ? [] : [position(row + 1, col)]),
    ...(col === 0 ? [] : [position(row, col - 1)]),
    ...(col === heightmap[row].length - 1 ? [] : [position(row, col + 1)]),
]

// get the list of positions that are upstream (i.e. higher elevation) of the given position
const upstreamPositions = (heightmap, r, c) =>
    adjacentPositions(heightmap, r, c).filter(({row, col}) => heightmap[r][c] < heightmap[row][col])

// given an array of positions, remove duplicates
// we temporarily convert position objects to strings, and then just remove duplicates checking if they are the first
// occurrence of the position in the array (via indexof)
const filterDuplicatePositions = (positions) =>
    positions.map(({row, col}) => `${row},${col}`)
        .filter((positionString, index, otherPositionStrings) => otherPositionStrings.indexOf(positionString) === index)
        .map(positionString => ({row: positionString.split(',')[0], col: positionString.split(',')[1]}))

// compute the basin of a given position
// it is the position itself plus the set of positions that are upstream of it
const basin = (heightmap, row, col) => filterDuplicatePositions([
    ...(heightmap[row][col] === 9 ? [] : [position(row, col)]), // positions of height 9 are excluded
    ...upstreamPositions(heightmap, row, col).map(({row, col}) => basin(heightmap, row, col)).flat()
])

// get the sizes of all the basins (that flow to a low point)
const lowpointBasinSizes = (heightmap) => lowPoints(heightmap).map(({row, col}) => basin(heightmap, row, col).length)

const productThreeBiggestBasinSizes = (heightmap) =>
    lowpointBasinSizes(heightmap) // get the sizes of all low point basins
        .sort((a, b) => b - a) // sort them by length
        .slice(0, 3) // get the top 3
        .reduce((a, b) => a * b, 1) // get their product

console.log('Part 1 =', sumOfLowPointRiskLevels(heightmap))
console.log('Part 2 =', productThreeBiggestBasinSizes(heightmap))
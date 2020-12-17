const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// Returns the sum of arrays (s_i = v1_i + v2_i + v3_i + ...)
function sumArrays(...arrays) {
  const n = arrays.reduce((max, xs) => Math.max(max, xs.length), 0);
  const result = Array.from({ length: n });
  return result.map((_, i) =>
    arrays
      .map(xs => xs[i] || 0)
      .reduce((sum, x) => sum + x, 0));
}

const NUM_BOOT_CYCLES = 6
const ACTIVE = '#'
const INACTIVE = '.'

function isActive(x) {
  return x === ACTIVE
}

function isInactive(x) {
  return x === INACTIVE
}

// returns the given region indexed by a given array of coordinates
function getByCoordinate(region, [coord, ...rest]) {
  return (coord === undefined) ? region : getByCoordinate(region[coord], rest)
}

// Generates an array with relative neighbor coordinates.
// Neighbors are all positions that do not differ by more than 1 in at least
// one of the coordinates
function relNeighborCoordinates(dimensions) {
  let neighbors = [[-1], [0], [1]]

  for (let i = 1; i < dimensions; i++)
    neighbors = [
      ...neighbors.map(x => [-1, ...x]),
      ...neighbors.map(x => [ 0, ...x]),
      ...neighbors.map(x => [ 1, ...x]),
    ]

  return neighbors.filter(x => !x.every(coord => coord == 0))
}

// Returns the number of dimensions of a given region/map
function numDimensions(region) {
  return Array.isArray(region) ? numDimensions(region[0]) + 1 : 0
}

// Checks if a given coordinate exists in a given region
// Coordinates are specified as an array of integers.
// Each integer is a given coordinate along an axis
// [3, 7, 5] is a 3-dimensional coordinate, indicating position (3, 7, 5)
function isWithinBounds(region, [currentCoord, ...remainingCoords]) {
  if (numDimensions(region) === 0) return true
  return (currentCoord >= 0 &&
          currentCoord < region.length &&
          isWithinBounds(region[currentCoord], remainingCoords))
}

// returns the absolute coordinates of the neighbors of a given position
function getNeighborCoordinates(map, coords) {
  const neighbors = relNeighborCoordinates(numDimensions(map))
  return neighbors.map(delta => sumArrays(coords, delta))
    .filter(coords => isWithinBounds(map, coords))
}

// returns the cell values of the neighbors of a given position
function getNeighbors(map, coords) {
  return getNeighborCoordinates(map, coords)
    .map((neighborCoords) => getByCoordinate(map, neighborCoords))
}

// counts how many active neighbors a given position has
function numActiveNeighbors(map, coord) {
  return getNeighbors(map, coord).filter(isActive).length
}

// generate a region of the same dimensions as the provided region,
// but where all the cells are set to the specified value
function generateRegion(region, value) {
  return (numDimensions(region) === 0) ?
    value : region.map(subRegion => generateRegion(subRegion, value))
}

// expands a given N-dimensional region 1 unit in all directions.
function expandRegion(region) {
  if (numDimensions(region) === 1)
    return [INACTIVE, ...region, INACTIVE]

  const subRegions = region.map(subregion => expandRegion(subregion))

  return [
    generateRegion(subRegions[0], INACTIVE),
    ...subRegions,
    generateRegion(subRegions[0], INACTIVE),
  ]
}

// count the number of active cells within a given region
function countActive(region) {
  return (numDimensions(region) === 0) ? isActive(region) :
    region.reduce((sum, subregion) => sum + countActive(subregion), 0)
}

// evolve a given cell at a given coordinate
// returns the cell value at the next step
function evolveCell(map, coords) {
  const cell = getByCoordinate(map, coords)
  const numNeighbors = numActiveNeighbors(map, coords)

  if (isActive(cell))   return [2,3].includes(numNeighbors) ? ACTIVE : INACTIVE
  if (isInactive(cell)) return numNeighbors === 3           ? ACTIVE : INACTIVE
}

// evolve a given region, applying evolveCell to every cell
function evolveRegion(map, region = map, coords = []) {
  return (numDimensions(region) === 0) ? evolveCell(map, coords) :
    region.map((region, coord) => evolveRegion(map, region, [...coords, coord]))
}

function evolveMap(map) {
  return evolveRegion(expandRegion(map))
}

function numActiveAfterBootCycles(map) {
  for (let i = 0; i < NUM_BOOT_CYCLES; i++) {
    map = evolveMap(map)
  }
  return countActive(map)
}

// get the initial 2-dimensional region
const initialState = file
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => line.split(''))

// Get number of active in a 3D pocket dimension
console.log("Part 1 =", numActiveAfterBootCycles([initialState]))

// Get number of active in a 4D pocket dimension
console.log("Part 2 =", numActiveAfterBootCycles([[initialState]]))

// Runs in about 10 seconds in my computer for my input.
// A possible optimization:
// I'm expanding the map at every iteration (because active cells
// will start spreading far away from the central region). However,
// I do not need to expand towards a given direction if all the cells
// adjacent to that edge are INACTIVE.
// Reducing the size of the region to simulate directly affects runtime.

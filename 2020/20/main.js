const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const seaMonster = [
  "                  # ",
  "#    ##    ##    ###",
  " #  #  #  #  #  #   ",
].map(row => row.split(''))

const baseTiles = file
  .split('\n\n')
  .map(tile => tile.split('\n').filter(line => line.length > 0))
  .map(tile => ({
    id: Number(tile[0].match(/^Tile (\d+):/)[1]),
    image: tile.slice(1).map(row => row.split('')),
  }))
  .map(tile => ({
    ...tile,
    arrangements: getTileArrangements(tile),
  }))

// precompute which tiles can be adjacent to which and where
const tiles = baseTiles
  .map(tile => ({
    ...tile,
    adjacents: baseTiles
      .filter(otherTile =>
        otherTile.id != tile.id && tilesMayBeAdjacent(tile, otherTile))
      .map(tile => tile.id)
  }))
  .sort((a, b) => a.adjacents.length - b.adjacents.length)


function createSquareMatrix(n) {
  return Array.from({length:n}, () => new Array(n))
}

function print_tile(tile) {
  console.log('\nTile', tile.id)
  for (const row of tile.image) {
    console.log(row.join(''))
  }
}

function print_image(image) {
  for (const row of image) console.log(row.join(''))
}

function flipTileHorizontally(tile) {
  return {
    ...tile,
    image: image.map(row => row.slice().reverse())
  }
}

function flipImageVertically(tile) {
  return {
    ...tile,
    image: tile.image.slice().reverse()
  }
}

function rotateTile90Degrees(tile) {
  let newImage = []
  for (let i = 0; i < tile.image.length; i++) {
    newImage[i] = []
    for (let j = 0; j < tile.image[i].length; j++) {
      newImage[i][j] = tile.image[(tile.image[i].length - 1) - j][i]
    }
  }

  return {
    ...tile,
    image: newImage,
  }
}

function getAllTileRotations(tile) {
  let rotations = [tile]
  for (let i = 0; i < 3; i++)
    rotations.push(rotateTile90Degrees(rotations[rotations.length - 1]))
  return rotations
}

function getTileArrangements(tile) {
  return [
    ...getAllTileRotations(tile),
    ...getAllTileRotations(flipImageVertically(tile))
  ]
}

function tilesMatchHorizontally(leftTile, rightTile) {
  const leftImage = leftTile.image
  const rightImage = rightTile.image
  for (let i = 0; i < leftImage.length; i++) {
    if (leftImage[i][leftImage[i].length - 1] !== rightImage[i][0])
      return false
  }
  return true
}

function tilesMatchVertically(topTile, bottomTile) {
  const topImage = topTile.image
  const bottomImage = bottomTile.image
  for (let i = 0; i < bottomImage[0].length; i++) {
    if (topImage[topImage.length - 1][i] !== bottomImage[0][i])
      return false
  }
  return true
}

function tilesMayBeAdjacent(tile1, tile2) {
  for (const a1 of tile1.arrangements) {
    for (const a2 of tile2.arrangements) {
      if (tilesMatchHorizontally(a1, a2)) return true
    }
  }
  return false
}

function tileMatchesImageOnTheLeft(leftImage, tile) {
  for (const arrangement of tile.arrangements) {
    if (tilesMatchHorizontally({image: leftImage}, tile))
      return true
  }
  return false
}

function tileMatchesImageOnTheTop(topImage, tile) {
  for (const arrangement of tile.arrangements) {
    if (tilesMatchVertically({image: topImage}, tile))
      return true
  }
  return false
}

function searchSquareArrangement(tiles, arrangement, cellIndex = 0) {
  const numTotalTiles = arrangement.length * arrangement[0].length
  const line = Math.floor(cellIndex / arrangement.length)
  const column = cellIndex % arrangement.length

  if (cellIndex === numTotalTiles) return arrangement
  if (tiles.length < numTotalTiles - cellIndex) return false

  let possibleTiles = tiles

  if (line > 0) {
    const topTile = arrangement[line - 1][column]
    possibleTiles = possibleTiles
      .filter(tile => topTile.adjacents.includes(tile.id))
      .filter(tile => tileMatchesImageOnTheTop(topTile.image, tile))
  }

  if (column > 0) {
    const leftTile = arrangement[line][column - 1]
    possibleTiles = possibleTiles
      .filter(tile => leftTile.adjacents.includes(tile.id))
      .filter(tile => tileMatchesImageOnTheLeft(leftTile.image, tile))
  }

  for (const tile of possibleTiles) {
    arrangement[line][column] = tile
    const remainingTiles = tiles.filter(t => t.id != tile.id)
    const found = searchSquareArrangement(remainingTiles, arrangement, cellIndex + 1)
    if (found) return found
  }
}

function getCornerTiles(arrangement) {
  return [
    arrangement[0][0],
    arrangement[arrangement.length - 1][0],
    arrangement[0][arrangement[0].length - 1],
    arrangement[arrangement.length - 1][arrangement[arrangement.length - 1].length - 1],
  ]
}

function convertTilesIntoImage(arrangement) {
  const x = arrangement
    .map((row, i) => {
      const [firstRowImage, ...otherRowImages] = row.map(tile => tile.image)
      return firstRowImage.map((line, i) => [
        ...line.slice(1, -1),
        ...otherRowImages.map(image => image[i].slice(1, -1)).flat()
      ]).slice(1, -1)
    })
    .flat()
  // FIXME: Remove the rotate/flip.
  return rotateTile90Degrees(flipImageVertically({image:x})).image
}

function markSeaMonster(image, row, col) {
  for (let i = 0; i < seaMonster.length; i++) {
    for (let j = 0; j < seaMonster[i].length; j++) {
      if (seaMonster[i][j] === '#') image[row+i][col+j] = 'X'
    }
  }
  return image
}

function checkSeaMonster(image, row, col) {
  for (let i = 0; i < seaMonster.length; i++) {
    for (let j = 0; j < seaMonster[i].length; j++) {
      if (seaMonster[i][j] === '#' && image[row+i][col+j] !== '#') return false
    }
  }
  return true
}

function scanImageForSeaMonsters(image) {
  let seaMonsterCoordinates = []
  for (let row = 0; row < image.length - seaMonster.length + 1; row++) {
    for (let col = 0; col < image[row].length - seaMonster[0].length + 1; col++) {
      const x = checkSeaMonster(image, row, col)
      if (x) seaMonsterCoordinates.push([row, col])
    }
  }
  return seaMonsterCoordinates
}

function findAndMarkSeaMonsters(image) {
  const imageArrangements =
    getTileArrangements({image:image}).map(tile => tile.image)
  for (const image of imageArrangements) {
    const coordinates = scanImageForSeaMonsters(image)
    if (coordinates.length > 0) {
      coordinates.forEach(([row, col]) => markSeaMonster(image, row, col))
      return image
    }
  }
}


function getHabitatWaterRoughness(image) {
  return image.reduce((acc, row) =>
    acc + row.reduce((acc, cell) =>
      acc + ((cell === '#') ? 1 : 0),
      0),
    0)
}


const allTiles = tiles.map(tile => getTileArrangements(tile)).flat()
const initialArrangement = createSquareMatrix(Math.sqrt(tiles.length))
const arrangement = searchSquareArrangement(allTiles, initialArrangement)

console.log('Part 1 =', getCornerTiles(arrangement)
  .map(tile => tile.id)
  .reduce((a, b) => a * b, 1))

const image = convertTilesIntoImage(arrangement)
const markedImage = findAndMarkSeaMonsters(image)
console.log('Part 2 =', getHabitatWaterRoughness(markedImage))

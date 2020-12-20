const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const baseTiles = file
  .split('\n\n')
  .map(tile => tile.split('\n').filter(line => line.length > 0))
  .map(tile => ({
    id: Number(tile[0].match(/^Tile (\d+):/)[1]),
    image: tile.slice(1).map(row => row.split('')),
  }))
  // we pre-compute all the possible arrangements of the tile image
  .map(tile => ({
    ...tile,
    arrangements: getImageArrangements(tile.image),
  }))

// precompute which tiles can be adjacent to which and where
const tiles = baseTiles.map(tile => ({
  ...tile,
  adjacents: baseTiles
    .filter(otherTile =>
      otherTile.id != tile.id && tilesMayBeAdjacent(tile, otherTile))
    .map(tile => tile.id)
}))

console.log('num tiles:', tiles.length)
console.log('arrangement side length:', Math.sqrt(tiles.length))

function createSquareMatrix(n) {
  return Array.from({length:n}, () => new Array(n))
}

function print_tile(tile) {
  console.log('\nTile', tile.id)
  for (row of tile.image) {
    console.log(row.join(''))
  }
}

function print_image(image) {
  for (row of image) console.log(row.join(''))
}

function flipImageHorizontally(image) {
  return image.map(row => row.slice().reverse())
}

function flipImageVertically(image) {
  return image.slice().reverse()
}

function rotateImage90Degrees(image) {
  let newImage = []
  for (let i = 0; i < image.length; i++) {
    newImage[i] = []
    for (let j = 0; j < image[i].length; j++) {
      newImage[i][j] = image[(image[i].length - 1) - j][i]
    }
  }

  return newImage
}

function getAllImageRotations(image) {
  let rotations = [image]
  for (let i = 0; i < 3; i++)
    rotations.push(rotateImage90Degrees(rotations[rotations.length - 1]))
  return rotations
}

function getImageArrangements(image) {
  return [
    ...getAllImageRotations(image),
    ...getAllImageRotations(flipImageVertically(image))
  ]
}

function getTileArrangements(tile) {
  return tile.arrangements
    .map(image => ({
      ...tile,
      image,
    }))
}

function getAllArrangementsOfTiles(tiles) {
  return tiles.map(tile => getTileArrangements(tile)).flat()
}

function imagesMatchHorizontally(leftImage, rightImage) {
  for (let i = 0; i < leftImage.length; i++) {
    if (leftImage[i][leftImage[i].length - 1] !== rightImage[i][0])
      return false
  }
  return true
}

function imagesMatchVertically(topImage, bottomImage) {
  for (let i = 0; i < bottomImage[0].length; i++) {
    if (topImage[topImage.length - 1][i] !== bottomImage[0][i])
      return false
  }
  return true
}

function getHorizontallyMatchingTiles(imageToTheLeft, tiles) {
  return tiles.map(tile =>
    tile.arrangements
      .filter(tileImage => imagesMatchHorizontally(imageToTheLeft, tileImage))
      .map(image => ({
        ...tile,
        image,
      })))
    .flat()
}

function getVerticallyMatchingTiles(imageToTheTop, tiles) {
  return tiles.map(tile =>
    tile.arrangements
      .filter(tileImage => imagesMatchVertically(imageToTheTop, tileImage))
      .map(image => ({
        ...tile,
        image,
      })))
    .flat()
}

function tileMatchesTopImage(imageToTheTop, tile) {
  for (const arrangement of tile.arrangements) {
    if (imagesMatchVertically(imageToTheTop, arrangement)) return true
  }
  return false
}

function tileMatchesLeftImage(imageToTheLeft, tile) {
  for (const arrangement of tile.arrangements) {
    if (imagesMatchHorizontally(imageToTheLeft, arrangement)) return true
  }
  return false
}

function tilesMayBeAdjacent(tile1, tile2) {
  for (const a1 of tile1.arrangements) {
    for (const a2 of tile2.arrangements) {
      if (imagesMatchHorizontally(a1, a2)) return true
      if (imagesMatchVertically(a1, a2)) return true
    }
  }
  return false
}

function log(depth, ...msgs) {
 if (depth < 11) console.log(" |  ".repeat(depth), ...msgs)
}

function searchSquareArrangement(tiles, arrangement, cellIndex = 0) {
  const numTotalTiles = arrangement.length * arrangement[0].length
  const numRemainingSpaces = numTotalTiles - cellIndex

  const line = Math.floor(cellIndex / arrangement.length)
  const column = cellIndex % arrangement.length

  // console.log('numTotalTiles', numTotalTiles)
  // console.log('numRemainingTiles', tiles.length)
  // console.log('numRemainingSpaces', numRemainingSpaces)
  // console.log('current Tile index', cellIndex, line, column)

  if (numRemainingSpaces === 0) {
    console.log('HABEMUS ARRANGEMENT!')
    for (let row = 0; row < arrangement.length; row++) {
      console.log(arrangement[row].map(tile => tile.id))
    }
    throw new Error("Success!!");
  }

  if (tiles.length < numRemainingSpaces) {
    log(cellIndex, 'Not enough tiles')
    return
  }

  // compute which tiles can be placed in the current position
  let possibleTiles = tiles;
  if (line > 0) {
    const topTile = arrangement[line - 1][column]
    possibleTiles = possibleTiles.filter(tile => topTile.adjacents.includes(tile.id))
  }

  if (column > 0) {
    const leftTile = arrangement[line][column - 1]
    possibleTiles = possibleTiles.filter(tile => leftTile.adjacents.includes(tile.id))
  }

  if (possibleTiles.length > 2)
    log(cellIndex, 'Position', line, column, 'possibilities:', possibleTiles.length)
  for (const tile of possibleTiles) {
    arrangement[line][column] = tile
    const remainingTiles = tiles.filter(t => t.id != tile.id)
    searchSquareArrangement(remainingTiles, arrangement, cellIndex + 1)
  }
}

console.log(tiles.filter(tile => tile.adjacents.length < 4).map(tile => "TILE " + tile.id + " #Adjacents = " + tile.adjacents.length))

const side_length = Math.sqrt(tiles.length)
const arrangement = Array.from({length:side_length}, () => new Array(side_length))
searchSquareArrangement(getAllArrangementsOfTiles(tiles), arrangement)

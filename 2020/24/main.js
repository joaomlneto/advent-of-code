const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

class Tile {
  constructor(coordinates, isBlack = false) {
    this.coordinates = coordinates
    this.isBlack = isBlack
  }

  flip() {
    this.isBlack = !this.isBlack
  }

  neighborCoordinates() {
    return ['e', 'w', 'se', 'nw', 'sw', 'ne']
      .map(direction => move(this.coordinates, direction))
  }
}

class TileFloor {
  constructor(listOfDirectionsToFlippedTiles = [], referenceCoords = [0, 0]) {
    this.tiles = {}
    listOfDirectionsToFlippedTiles
      // follow directions to the flipped tile and get its coordinates
      .map(directions => directions
        .reduce((pos, dir) => move(pos, dir), referenceCoords))
      // now that we have their coordinates, flip the tiles
      .forEach(coordinates => this.getTile(coordinates).flip())
  }

  // get the tile with the specified coordinates
  getTile(coordinates) {
    if (!(coordinates in this.tiles))
      this.tiles[coordinates] = new Tile(coordinates)
    return this.tiles[coordinates]
  }

  // get the neighbor tiles of a given tile
  neighborsOf(tile) {
    return tile.neighborCoordinates()
      .map(coordinates => this.getTile(coordinates))
  }

  // get the number of black neighbors of a given tile
  numBlackNeighborsOf(tile) {
    return this.neighborsOf(tile).filter(neighbor => neighbor.isBlack).length
  }

  // get all the black tiles in the tile floor
  blackTiles() {
    return Object.keys(this.tiles)
      .map(coordinatesString => this.tiles[coordinatesString])
      .filter(tile => tile.isBlack)
  }

  // computes the next day color for a given tile
  nextTileColor(tile) {
    const numBlackNeighbors = this.numBlackNeighborsOf(tile)
    if (tile.isBlack) return [1, 2].includes(numBlackNeighbors)
    else return numBlackNeighbors === 2
  }

  // returns how the tile will be the following day
  evolveTile(tile) {
    return new Tile(tile.coordinates, this.nextTileColor(tile))
  }

  // flip all ties according to the living art exhibit rules
  performDailyFlip() {
    const nextDayTiles = {}
    // check all black tiles and all neighbors of black tiles
    this.blackTiles().forEach(blackTile => {
      nextDayTiles[blackTile.coordinates] = this.evolveTile(blackTile)
      this.neighborsOf(blackTile).forEach(neighborTile => {
        nextDayTiles[neighborTile.coordinates] = this.evolveTile(neighborTile)
      })
    })
    this.tiles = nextDayTiles
  }

  // evolves art exhibition by the specified number of days
  performDailyFlips(numDays) {
    for (let i = 0; i < numDays; i++)
      this.performDailyFlip()
  }
}

function parseInputLine(line) {
  let directions = []
  for (let i = 0; i < line.length; i++)
    if (line[i] === 's' || line[i] === 'n')
      directions = [...directions, (line[i] + line[++i])]
    else
      directions = [...directions, line[i]]
  return directions
}

function move([row, col], direction) {
  switch (direction) {
    case 'e': return [row, col + 1]
    case 'w': return [row, col - 1]
    case 'se': return [row + 1, (row % 2 === 0) ? col : col + 1]
    case 'nw': return [row - 1, (row % 2 === 0) ? col - 1 : col]
    case 'sw': return [row + 1, (row % 2 === 0) ? col - 1 : col]
    case 'ne': return [row - 1, (row % 2 === 0) ? col : col + 1]
  }
}

const listOfTileDirections = file
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => parseInputLine(line))

const tileFloor = new TileFloor(listOfTileDirections)
console.log('Part 1 =', tileFloor.blackTiles().length)
tileFloor.performDailyFlips(100)
console.log('Part 2 =', tileFloor.blackTiles().length)

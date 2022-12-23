const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

const Tiles = {
  Elf: "#",
  Ground: ".",
};

const Directions = {
  N: { row: -1, col: 0 },
  S: { row: 1, col: 0 },
  E: { row: 0, col: 1 },
  W: { row: 0, col: -1 },
  NE: { row: -1, col: 1 },
  NW: { row: -1, col: -1 },
  SE: { row: 1, col: 1 },
  SW: { row: 1, col: -1 },
};

class Position {
  constructor(coordinates) {
    this.set(coordinates);
  }

  add({ row, col }) {
    return new Position({ row: this.row + row, col: this.col + col });
  }

  set({ row, col }) {
    this.row = row;
    this.col = col;
  }

  equals({ row, col }) {
    return this.row === row && this.col === col;
  }

  toString() {
    return `(${this.row}, ${this.col})`;
  }

  adjacentPositions() {
    return Object.keys(Directions).map((direction) => this.adjacent(direction));
  }

  adjacent(direction) {
    return this.add(Directions[direction]);
  }

  move(direction) {
    this.set(this.adjacent(direction));
  }

  toString() {
    return `position(${this.row}, ${this.col})`;
  }

  key() {
    return `${this.row},${this.col}`;
  }
}

class Elf {
  constructor(grove, position) {
    this.grove = grove;
    this.position = position;
  }

  toString() {
    return `Elf(${this.position})`;
  }

  directionContainsElf(direction) {
    return this.grove.elfInPosition(this.position.adjacent(direction));
  }

  directionsContainElves(directions) {
    return directions.some((direction) => this.directionContainsElf(direction));
  }

  hasAdjacentElves() {
    return this.directionsContainElves(Object.keys(Directions));
  }

  proposeDirectionToMove(listOfDirections) {
    // if there are no adjacent elves, don't move
    if (!this.hasAdjacentElves()) {
      return null;
    }
    // try to move
    for (const { directionToMove, directionsToExplore } of listOfDirections) {
      if (!this.directionsContainElves(directionsToExplore)) {
        return directionToMove;
      }
    }
    return null; // No move possible
  }

  moveTo(targetPosition) {
    this.grove.setTile(this.position, Tiles.Ground);
    this.grove.setTile(targetPosition, Tiles.Elf);
    this.position.set(targetPosition);
  }
}

class Grove {
  constructor(tiles) {
    this.tiles = tiles.map((row) => [...row]);
    this.rowOffset = 0;
    this.colOffset = 0;
    this.elves = tiles.flatMap((r, row) =>
      r
        .map(
          (tile, col) =>
            this.elfInPosition({ row, col }) &&
            new Elf(this, new Position({ row, col }))
        )
        .filter((tile) => tile)
    );
    this.listOfDirections = [
      { directionToMove: "N", directionsToExplore: ["N", "NE", "NW"] },
      { directionToMove: "S", directionsToExplore: ["S", "SE", "SW"] },
      { directionToMove: "W", directionsToExplore: ["W", "NW", "SW"] },
      { directionToMove: "E", directionsToExplore: ["E", "NE", "SE"] },
    ];
    this.elvesMovedLastRound = false;
  }

  expandGridIfNecessary({ row, col }) {
    while (row + this.rowOffset < 0) {
      this.tiles.unshift(Array(this.tiles[0].length).fill(Tiles.Ground));
      this.rowOffset++;
    }

    while (col + this.colOffset < 0) {
      this.tiles.forEach((row) => row.unshift(Tiles.Ground));
      this.colOffset++;
    }

    while (row + this.rowOffset >= this.tiles.length) {
      this.tiles.push(Array(this.tiles[0].length).fill(Tiles.Ground));
    }

    while (col + this.colOffset >= this.tiles[0].length) {
      this.tiles.forEach((row) => row.push(Tiles.Ground));
    }
  }

  getTile({ row, col }) {
    this.expandGridIfNecessary({ row, col });
    return this.tiles[row + this.rowOffset][col + this.colOffset];
  }

  setTile({ row, col }, tile) {
    this.expandGridIfNecessary({ row, col });
    this.tiles[row + this.rowOffset][col + this.colOffset] = tile;
  }

  elfInPosition({ row, col }) {
    return this.getTile({ row, col }) === Tiles.Elf;
  }

  doRound() {
    this.elvesMovedLastRound = false;
    const proposedPositions = new Proxy(
      {},
      { get: (obj, key) => (obj[key] ??= { position: undefined, elves: [] }) }
    );

    // Make all elves propose positions to move to
    this.elves
      .map((elf) => ({
        elf,
        proposedDirection: elf.proposeDirectionToMove(this.listOfDirections),
      }))
      .filter(({ proposedDirection }) => proposedDirection)
      .forEach(({ elf, proposedDirection }) => {
        const proposedPosition = elf.position.adjacent(proposedDirection);
        proposedPositions[proposedPosition.key()].position = proposedPosition;
        proposedPositions[proposedPosition.key()].elves.push(elf);
      });

    // Move all elves to their proposed positions, if no other elf proposed to move to the same position
    for (const { position, elves } of Object.values(proposedPositions))
      if (elves.length === 1)
        elves.forEach((elf) => {
          elf.moveTo(position);
          this.elvesMovedLastRound = true;
        });

    // Rotate list of directions
    this.listOfDirections.push(this.listOfDirections.shift());
  }

  boundingBox() {
    return this.elves.reduce(
      ({ minRow, maxRow, minCol, maxCol }, { position }) => ({
        minRow: Math.min(minRow, position.row),
        maxRow: Math.max(maxRow, position.row),
        minCol: Math.min(minCol, position.col),
        maxCol: Math.max(maxCol, position.col),
      }),
      {
        minRow: Infinity,
        maxRow: -Infinity,
        minCol: Infinity,
        maxCol: -Infinity,
      }
    );
  }

  groundTilesInBoundingBoxAfterNumRounds(numRounds) {
    for (let i = 0; i < numRounds; i++) this.doRound();
    const { minRow, maxRow, minCol, maxCol } = this.boundingBox();
    return (maxRow - minRow + 1) * (maxCol - minCol + 1) - this.elves.length;
  }

  numRoundsUntilElvesStopMoving() {
    let numRounds = 0;
    do {
      this.doRound();
      numRounds++;
    } while (this.elvesMovedLastRound);
    return numRounds;
  }
}

const tiles = file
  .trim()
  .split("\n")
  .map((row) => row.split(""));

console.log(
  "Part 1:",
  new Grove(tiles).groundTilesInBoundingBoxAfterNumRounds(10)
);

console.log("Part 2:", new Grove(tiles).numRoundsUntilElvesStopMoving());

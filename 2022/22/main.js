const fs = require("fs");
const readline = require("readline");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

// mod function, but normalized to give a result between 0 and m-1
const mod = (n, m) => ((n % m) + m) % m;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const Directions = {
  North: "^",
  South: "v",
  East: ">",
  West: "<",
};

const Turns = {
  Left: "L",
  Right: "R",
};

const Tiles = {
  Open: ".",
  Wall: "#",
  Invalid: " ",
};

const clockwiseDirectionSequence = [
  Directions.East,
  Directions.South,
  Directions.West,
  Directions.North,
];

const nextDirection = (direction, turn) =>
  clockwiseDirectionSequence[
    mod(
      clockwiseDirectionSequence.indexOf(direction) +
        (turn === Turns.Left ? -1 : 1),
      clockwiseDirectionSequence.length
    )
  ];

const directionToVector = (direction) =>
  ({
    [Directions.North]: { row: -1, col: 0 },
    [Directions.South]: { row: 1, col: 0 },
    [Directions.East]: { row: 0, col: 1 },
    [Directions.West]: { row: 0, col: -1 },
  }[direction]);

class Map {
  constructor(
    tiles,
    position = { row: 0, col: tiles[0].indexOf(".") },
    direction = Directions.East
  ) {
    this.tiles = tiles;
    this.position = position;
    this.direction = direction;
  }

  getTile({ row, col } = this.position) {
    return this.tiles[row][col] ?? Tiles.Invalid;
  }

  print() {
    console.clear();
    const tiles = this.tiles.map((row) => [...row]);
    tiles[this.position.row][this.position.col] = this.direction;
    console.log(tiles.map((row) => row.join("")).join("\n"));
    console.log("Position:", this.position, ", Direction:", this.direction);
  }

  numRows() {
    return tiles.length;
  }

  numCols() {
    return tiles[0].length;
  }

  // add a position and a vector together, and wrap around the map
  addPositions(a, b) {
    return {
      row: mod(a.row + b.row, this.numRows()),
      col: mod(a.col + b.col, this.numCols()),
    };
  }

  // get the position of the tile immediately in front of us
  positionImmediatelyInFront(
    position = this.position,
    direction = this.direction
  ) {
    return this.addPositions(position, directionToVector(direction));
  }

  // get the position of the next tile in front of us, including wrapping around the map
  nextValidPositionInFront(
    position = this.position,
    direction = this.direction
  ) {
    const directionVector = directionToVector(direction);
    let nextPosition = this.positionImmediatelyInFront(position, direction);
    while (this.getTile(nextPosition) === Tiles.Invalid) {
      nextPosition = this.positionImmediatelyInFront(nextPosition, direction);
    }
    return nextPosition;
  }

  // check whether we can walk into the tile in front of us
  canMoveForward(position = this.position, direction = this.direction) {
    return (
      this.getTile(this.nextValidPositionInFront(position, direction)) !==
      Tiles.Wall
    );
  }

  moveForward(numTiles = 1) {
    for (let i = 0; i < numTiles && this.canMoveForward(); i++) {
      this.position = this.nextValidPositionInFront();
    }
  }

  turn(turn) {
    this.direction = nextDirection(this.direction, turn);
  }

  getPassword() {
    return (
      1000 * (this.position.row + 1) +
      4 * (this.position.col + 1) +
      clockwiseDirectionSequence.indexOf(this.direction)
    );
  }

  executePath(path) {
    for (let i = 0; i < path.length; i++) {
      const command = path[i];
      if (command === Turns.Left || command === Turns.Right) {
        this.turn(command);
      } else {
        this.moveForward(command);
      }
    }
    return this.getPassword();
  }
}

const [mapString, pathString] = file.split("\n\n");

const tiles = mapString.split("\n").map((x) => x.split(""));

const path = pathString
  .match(/[a-zA-Z]+|[0-9]+/g)
  .map((x) => (isNaN(x) ? x : parseInt(x)));

console.log("Part 1:", new Map(tiles).executePath(path));

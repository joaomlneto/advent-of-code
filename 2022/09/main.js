const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

const directionToVector = (direction) =>
  ({
    U: { x: 0, y: -1 },
    D: { x: 0, y: +1 },
    R: { x: +1, y: 0 },
    L: { x: -1, y: 0 },
  }[direction]);

// compute list of adjacent coordinates including diagonals and self
const adjacent = ({ x, y }) => [
  { x: x - 1, y: y - 1 },
  { x: x - 1, y: y },
  { x: x - 1, y: y + 1 },
  { x: x, y: y - 1 },
  { x: x, y: y },
  { x: x, y: y + 1 },
  { x: x + 1, y: y - 1 },
  { x: x + 1, y: y },
  { x: x + 1, y: y + 1 },
];

// check if two coordinates are adjacent
const areAdjacent = (a, b) =>
  adjacent(a).find((c) => c.x === b.x && c.y === b.y);

const moveTail = (head, tail) =>
  areAdjacent(tail, head)
    ? tail
    : {
        x: tail.x + (head.x === tail.x ? 0 : head.x > tail.x ? 1 : -1),
        y: tail.y + (head.y === tail.y ? 0 : head.y > tail.y ? 1 : -1),
      };

const NUM_KNOTS = 10;

// parse input file
const motions = file
  .split("\n")
  .filter((x) => x)
  .map((row) => row.split(" "))
  .map(([direction, distance]) => ({
    direction,
    vector: directionToVector(direction),
    distance: Number(distance),
  }));

let knotPositions = Array(NUM_KNOTS).fill({ x: 0, y: 0 });
const knotPaths = [...Array(NUM_KNOTS).keys()].map(() => new Set());

motions.forEach((motion) => {
  for (let i = 0; i < motion.distance; i++) {
    // move the head
    knotPositions[0] = {
      x: knotPositions[0].x + motion.vector.x,
      y: knotPositions[0].y + motion.vector.y,
    };
    // move the remaining knots
    for (let j = 1; j < NUM_KNOTS; j++) {
      knotPositions[j] = moveTail(knotPositions[j - 1], knotPositions[j]);
      knotPaths[j].add(`${knotPositions[j].x},${knotPositions[j].y}`);
    }
  }
});

console.log("Part 1:", knotPaths[1].size);
console.log("Part 2:", knotPaths[9].size);

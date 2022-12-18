const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

const coordinates = file
  .trim()
  .split("\n")
  .map((line) => line.split(","))
  .map(([x, y, z]) => ({ x: Number(x), y: Number(y), z: Number(z) }));

// unique string key for a given position
const positionKey = ({ x, y, z }) => `${x},${y},${z}`;

const areAdjacent = (a, b) =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z) === 1;

// set of all rock positions
const rockPositions = new Set(coordinates.map(positionKey));
// check if a position is that of a rock
const isRock = (pos) => rockPositions.has(positionKey(pos));

console.log(
  "Part 1:",
  coordinates.reduce(
    (acc, a) => acc + 6 - coordinates.filter((b) => areAdjacent(a, b)).length,
    0
  )
);

// compute bounding box of all coordinates
const boundingBox = coordinates.reduce((acc, { x, y, z }) => ({
  x: { min: Math.min(acc.x.min ?? x, x), max: Math.max(acc.x.max ?? x, x) },
  y: { min: Math.min(acc.y.min ?? y, y), max: Math.max(acc.y.max ?? y, y) },
  z: { min: Math.min(acc.z.min ?? z, z), max: Math.max(acc.z.max ?? z, z) },
}));

// check if a position is out of bounds
const isOutOfBounds = ({ x, y, z }) =>
  x < boundingBox.x.min ||
  x > boundingBox.x.max ||
  y < boundingBox.y.min ||
  y > boundingBox.y.max ||
  z < boundingBox.z.min ||
  z > boundingBox.z.max;

// return the set of all neighbor positions of a given position
const neighbors = ({ x, y, z }) => [
  { x: x - 1, y, z },
  { x, y: y - 1, z },
  { x, y, z: z - 1 },
  { x: x + 1, y, z },
  { x, y: y + 1, z },
  { x, y, z: z + 1 },
];

// cache of whether a given position is exterior or not
const exteriorCache = {};

// check if a given position is exterior
const isExterior = (position) => {
  const pocketPositions = new Set();
  const queue = [position];
  let isExterior = false;

  // check if at least of the positions is exterior...
  while (queue.length > 0) {
    const p = queue.shift();
    const k = positionKey(p);

    // check if already computed
    if (Object.hasOwn(exteriorCache, k)) {
      isExterior = exteriorCache[k];
      break;
    }

    // check if out of bounds
    if (isOutOfBounds(p)) {
      isExterior = true;
      break;
    }

    // queue air neighbors
    neighbors(p)
      .filter((p) => !pocketPositions.has(positionKey(p)) && !isRock(p))
      .forEach((p) => {
        pocketPositions.add(positionKey(p));
        queue.push(p);
      });
  }

  // cache the result
  pocketPositions.forEach((p) => (exteriorCache[p] = isExterior));

  return isExterior;
};

console.log(
  "Part 2:",
  coordinates.flatMap((p) => neighbors(p).filter(isExterior)).length
);

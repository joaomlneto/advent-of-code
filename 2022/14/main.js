const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

const ROCK_TILE = "#";
const EMPTY_TILE = ".";
const SAND_TILE = "o";

const sandHole = { x: 500, y: 0 };

// parse input file
const rockPaths = file
  .trim()
  .split("\n")
  .map((line) =>
    line
      .split(" -> ")
      .map((coordStr) => coordStr.split(",").map(Number))
      .map(([x, y]) => ({ x, y }))
  );

// compute the bounding box
const boundingBox = rockPaths.flat().reduce(
  (acc, { x, y }) => ({
    xMin: Math.min(acc.xMin, x),
    xMax: Math.max(acc.xMax, x),
    yMin: Math.min(acc.yMin, y),
    yMax: Math.max(acc.yMax, y),
  }),
  { xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity }
);

const expandGridHorizontallyIfRequired = (grid, { x, y }) => {
  // position out of bounds to the left
  while (x < grid.xOffset) {
    grid.cells.forEach((row) => row.unshift(EMPTY_TILE));
    grid.xOffset--;
  }
  // position out of bounds to the right
  while (x >= grid.xOffset + grid.cells[0].length) {
    grid.cells.forEach((row) => row.push(EMPTY_TILE));
  }
};

const getCell = (grid, { x, y }) => {
  // reached the floor
  if (y === grid.floorHeight) return ROCK_TILE;
  expandGridHorizontallyIfRequired(grid, { x, y });
  return grid.cells[y][x - grid.xOffset];
};

const setCell = (grid, x, y, v) => {
  expandGridHorizontallyIfRequired(grid, { x, y });
  grid.cells[y][x - grid.xOffset] = v;
};

// the cave scan
const grid = {
  xOffset: boundingBox.xMin - 1,
  numGrains: 0,
  endlessVoidHeight: boundingBox.yMax + 1, // part 1
  floorHeight: boundingBox.yMax + 2, // part 2
  cells: Array(boundingBox.yMax + 2)
    .fill(0)
    .map((x) =>
      Array(boundingBox.xMax - boundingBox.xMin + 1).fill(EMPTY_TILE)
    ),
};

// populate grid with rocks
rockPaths.forEach((path) => {
  // for each pair of consecutive coordinates
  for (let i = 1; i < path.length; i++) {
    // draw line between them
    //console.log("draw line between ", path[i - 1], path[i]);
    const xMin = Math.min(path[i - 1].x, path[i].x);
    const xMax = Math.max(path[i - 1].x, path[i].x);
    const yMin = Math.min(path[i - 1].y, path[i].y);
    const yMax = Math.max(path[i - 1].y, path[i].y);
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        setCell(grid, x, y, ROCK_TILE);
      }
    }
  }
});

const getNextPositions = ({ x, y }) => [
  { x, y: y + 1 },
  { x: x - 1, y: y + 1 },
  { x: x + 1, y: y + 1 },
];

const canDropFurther = (grid, pos) =>
  getNextPositions(pos).some((p) => getCell(grid, p) === EMPTY_TILE);

const dropGrainOfSand = (grid, endlessVoid = true) => {
  let pos = { ...sandHole };

  // check if sandhole is covered
  if (getCell(grid, pos) === SAND_TILE) {
    return false;
  }

  // drop grain of sand until it can't move
  while (canDropFurther(grid, pos)) {
    for (const nextPos of getNextPositions(pos)) {
      if (getCell(grid, nextPos) === EMPTY_TILE) {
        pos = nextPos;
        break;
      }
    }
  }

  const isInEndlessVoid = ({ y }) =>
    endlessVoid && y === grid.endlessVoidHeight;

  // draw grain of sand unless it's in the endless void
  if (!isInEndlessVoid(pos)) setCell(grid, pos.x, pos.y, SAND_TILE);

  // check if we reached the endless void - if not, return true, otherwise false
  return !isInEndlessVoid(pos);
};

let fillWithSand = (grid, endlessVoid = true) => {
  while (dropGrainOfSand(grid, endlessVoid)) grid.numGrains++;
};

fillWithSand(grid);
console.log("Part 1:", grid.numGrains);

fillWithSand(grid, false);
console.log("Part 2:", grid.numGrains);

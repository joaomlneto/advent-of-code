const fs = require("fs");

const filename = "sample.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

const ROCK_CELL = "#";
const EMPTY_CELL = ".";
const PUSH_LEFT = "<";
const PUSH_RIGHT = ">";
const PLAY_AREA_WIDTH = 7;
const EMPTY_ROW = Array(PLAY_AREA_WIDTH).fill(EMPTY_CELL);

const rocks = ["####", ".#.\n###\n.#.", "..#\n..#\n###", "#\n#\n#\n#", "##\n##"]
  // convert into 2D array of characters
  .map((rockStr) =>
    rockStr
      .split("\n")
      .reverse()
      .map((line) => line.split(""))
      // attach the coordinates to each cell
      .flatMap((r, row) => r.map((cell, col) => ({ cell, row, col })))
      // filter empty ones ('.')
      .filter(({ cell, row, col }) => cell === "#")
      // extract coordinates of nonempty cells
      .map(({ row, col }) => ({ row, col }))
  )
  .map((coords, id) => ({
    id,
    coords,
    height: coords.reduce((max, { row }) => Math.max(max, row), 0) + 1,
  }));

// parse input file into a list of valves
const jetPattern = file.trim().split("");

let nextJet = (playArea) => {
  playArea.jetPatternOffset = playArea.jetPatternOffset % jetPattern.length;
  return jetPattern[playArea.jetPatternOffset++];
};

let nextRock = (playArea) => {
  playArea.rockOffset = playArea.rockOffset % rocks.length;
  return rocks[playArea.rockOffset++];
};

const makePlayArea = () => ({
  cells: [],
  rockTowerHeight: 0,
  rockOffset: 0,
  jetPatternOffset: 0,
});

const expandPlayArea = (playArea, numRows) => {
  while (playArea.cells.length <= numRows)
    playArea.cells.unshift(EMPTY_ROW.slice());
};

const get = (playArea, row, col) => {
  expandPlayArea(playArea, row);
  return playArea.cells[playArea.cells.length - row - 1][col];
};

const set = (playArea, row, col, value) => {
  expandPlayArea(playArea, row);
  playArea.cells[playArea.cells.length - row - 1][col] = value;
};

const drawRock = (playArea, rock, row, col) =>
  rock.coords.forEach(({ row: r, col: c }) =>
    set(playArea, row + r, col + c, ROCK_CELL)
  );

const canRockBePlaced = (playArea, rock, row, col) =>
  rock.coords.every(
    ({ row: r, col: c }) =>
      col + c >= 0 &&
      col + c < PLAY_AREA_WIDTH &&
      row + r >= 0 &&
      get(playArea, row + r, col + c) === EMPTY_CELL
  );

const dropRock = (playArea, rock = nextRock(playArea)) => {
  let row = playArea.rockTowerHeight + 3;
  let col = 2;

  while (true) {
    // push rock by jet
    const colDiff = nextJet(playArea) === PUSH_LEFT ? -1 : 1;
    if (canRockBePlaced(playArea, rock, row, col + colDiff)) {
      col += colDiff;
    }
    // drop rock if possible
    if (canRockBePlaced(playArea, rock, row - 1, col)) row--;
    else break;
  }

  drawRock(playArea, rock, row, col);
  playArea.rockTowerHeight = Math.max(
    playArea.rockTowerHeight,
    row + rock.height
  );

  // return the coordinates where the piece was placed
  return { rock, row, col };
};

const computeRecurrenceInterval = (playArea = makePlayArea()) => {
  const cache = {};
  for (let i = 0; ; i++) {
    const { rock, col } = dropRock(playArea);
    const key = JSON.stringify({
      r: rock.id,
      c: col,
      j: playArea.jetPatternOffset,
    });
    // check if we have seen this state before
    if (cache[key]) {
      return {
        period: i - cache[key].i,
        heightDiff: playArea.rockTowerHeight - cache[key].h,
      };
    }
    cache[key] = { i, h: playArea.rockTowerHeight };
  }
};

// compute recurrence interval to speed up the simulation
const recurrence = computeRecurrenceInterval();

const dropRocks = (numRocks) => {
  const playArea = makePlayArea();

  // shortcut simulation using recurrence interval
  const numRecurrences = Math.floor(numRocks / recurrence.period);
  numRocks = numRocks - numRecurrences * recurrence.period;

  for (let i = 0; i < numRocks; i++) dropRock(playArea);

  return recurrence.heightDiff * numRecurrences + playArea.rockTowerHeight;
};

console.log("Part 1:", dropRocks(2022));
console.log("Part 2:", dropRocks(1000000000000));

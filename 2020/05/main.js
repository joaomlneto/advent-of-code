const fs = require('fs')

function decodeBoardingPassRow(seatString) {
  const N = 7;
  const rowString = seatString.slice(0, N); // get the first N chars
  let minRow = 0;
  let maxRow = 2 ** N - 1;

  for (let i = 0; i < rowString.length; i++) {
    const c = String(rowString.charAt(i))
    if      (c == 'F') maxRow -= 2 ** (N - i - 1)
    else if (c == 'B') minRow += 2 ** (N - i - 1)
  }

  if (minRow != maxRow) {
    console.error('SOMETHING WEIRD HAPPENED');
  }

  return minRow;
}

function decodeBoardingPassColumn(seatString) {
  const N = 3
  const colString = seatString.slice(0 - N) // get the last N chars
  let minCol = 0;
  let maxCol = 2 ** N - 1;

  for (let i = 0; i < colString.length; i++) {
    const c = String(colString.charAt(i))
    if      (c == 'L') maxCol -= 2 ** (N - i - 1)
    else if (c == 'R') minCol += 2 ** (N - i - 1)
  }

  if (minCol != maxCol) {
    console.error('SOMETHING WEIRD HAPPENED');
  }

  return minCol;
}

function getSeatID(row, column) {
  return row * 8 + column
}

const file = fs.readFileSync('input.txt').toString('utf8');

const boardingPasses = file.split('\n')
  .filter(line => line.length == 10)
  .map(seat => {
    const row = decodeBoardingPassRow(seat)
    const column = decodeBoardingPassColumn(seat)
    return {
      seat,
      row,
      column,
      seatID: getSeatID(row, column),
    }
  })
  // sort by seat ID, descending (for part 1)
  .sort((a, b) => (a.seatID < b.seatID) ? 1 : (b.seatID < a.seatID ? -1 : 0))



// PART 1

console.log('Highest Seat ID:', boardingPasses[0])



// PART 2

const filledSeats = Array(128).fill().map(()=>Array(8).fill(false))
for (boardingPass of boardingPasses) {
  filledSeats[boardingPass.row][boardingPass.column] = true
}

// tweak me
const numRowsToIgnoreOnFront = 12;
const numRowsToIgnoreOnBack = 5;

for (let row = numRowsToIgnoreOnFront; row < filledSeats.length - numRowsToIgnoreOnBack; row++) {
  for (let column = 0; column < filledSeats[0].length; column++) {
    if (!filledSeats[row][column]) {
      console.log('missing', row, column, '    seat ID:', getSeatID(row, column))
    }
  }
}

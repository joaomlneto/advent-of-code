const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const SEAT_OCCUPIED = '#'
const SEAT_EMPTY = 'L'

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1], /*seat*/ [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
]

function seatIsEmpty(seat) {
  return seat === SEAT_EMPTY
}

function seatIsOccupied(seat) {
  return seat === SEAT_OCCUPIED
}

function isSeat(seat) {
  return seatIsEmpty(seat) || seatIsOccupied(seat)
}

function print_seats(seats) {
  for (let i = 0; i < seats.length; i++)
    console.log(seats[i].join(''))
}

function seats_changed(before, after) {
  for (let i = 0; i < before.length; i++) {
    for (let j = 0; j < before[0].length; j++) {
      if (before[i][j] !== after[i][j])
        return true
    }
  }
  return false
}

function isWithinBounds(seats, [row, col]) {
  return (
    row >= 0 && row < seats.length &&
    col >= 0 && col < seats[row].length
  )
}

function countOccupiedPositions(seats, positions) {
  return positions
    .filter(([row, col]) => isWithinBounds(seats, [row, col]))
    .map(([row, col]) => seats[row][col])
    .filter(seatIsOccupied)
    .length
}

function evolveUntilEquilibrium(seats, evolvePolicy) {
  let newSeats = seats.slice()
  let oldSeats
  do {
    oldSeats = newSeats
    newSeats = evolve_seats(oldSeats, evolvePolicy)
  } while (seats_changed(oldSeats, newSeats))
  return newSeats
}

function countOccupied(seats) {
  return seats.flat().filter(seatIsOccupied).length
}

function evolve_seats(seats, evolvePolicy) {
  let seatsAfter = []
  for (let row = 0; row < seats.length; row++) {
    seatsAfter[row] = []
    for (let col = 0; col < seats[0].length; col++) {
      if (isSeat(seats[row][col])) {
        seatsAfter[row][col] = evolvePolicy(seats, [row, col])
      } else {
        seatsAfter[row][col] = seats[row][col]
      }
    }
  }
  //print_seats(seatsAfter)
  return seatsAfter
}



// PART 1

function countOccupiedAdjacents(seats, [row, col]) {
  const positions = directions.map(([dr, dc]) => [row + dr, col + dc])
  return countOccupiedPositions(seats, positions)
}

function evolve_policy_1(seats, [row, col]) {
  const numOccupied = countOccupiedAdjacents(seats, [row, col])
  const seat = seats[row][col]

  if (seatIsEmpty(seat) && numOccupied == 0) return SEAT_OCCUPIED
  if (seatIsOccupied(seat) && numOccupied >= 4) return SEAT_EMPTY
  return seat
}



// PART 2 START

function getVisiblePosition(seats, [row, col], [dr, dc]) {
  do {
    row += dr
    col += dc
  } while (isWithinBounds(seats, [row, col]) && !isSeat(seats[row][col]))
  return [row, col]
}

function countOccupiedVisible(seats, [row, col]) {
  const positions = directions
    .map(([dr, dc]) => getVisiblePosition(seats, [row, col], [dr, dc]))
  return countOccupiedPositions(seats, positions)
}

function evolve_policy_2(seats, [row, col]) {
  const numOccupied = countOccupiedVisible(seats, [row, col])
  const seat = seats[row][col]

  if (seatIsEmpty(seat) && numOccupied == 0) return SEAT_OCCUPIED
  if (seatIsOccupied(seat) && numOccupied >= 5) return SEAT_EMPTY
  return seat
}



// I/O

const seats = file.split('\n')
  .filter(line => line.length > 0) // disregard trailing \n
  .map(line => line.split('')) // convert string to array of chars

const finalSeatsPartOne = evolveUntilEquilibrium(seats, evolve_policy_1)
console.log('Part 1 =', countOccupied(finalSeatsPartOne))

const finalSeatsPartTwo = evolveUntilEquilibrium(seats, evolve_policy_2)
console.log('Part 2 =', countOccupied(finalSeatsPartTwo))

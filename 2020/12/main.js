const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const instructions = file.split('\n')
  .filter(line => line.length > 0) // disregard trailing \n
  .map(line => ({
    action: String(line.substring(0, 1)),
    value: Number(line.substring(1)),
  }))

const ship = {
  position: {
    lat: 0,
    lon: 0,
  },
  direction: 'E',
  waypoint: {
    lat: 1,
    lon: 10,
  }
}

function mod(value, modulo) {
  return (value + modulo) % modulo
}

function executeInstructions(initialShip, instructions, instructionHandler) {
  return instructions.reduce(
    (ship, instruction) => instructionHandler(ship, instruction),
    initialShip)
}

function getShipManhattanDisplacement(ship) {
  return Math.abs(ship.position.lat) + Math.abs(ship.position.lon)
}



// PART 1

function updateShipDirection(ship, {action, value}) {
  const directions = ['E', 'S', 'W', 'N']
  const curr = directions.indexOf(ship.direction)
  const N = directions.length
  switch (action) {
    case 'R': return directions[mod(curr + (value / 90), N)]
    case 'L': return directions[mod(curr - (value / 90), N)]
    default:  return ship.direction
  }
}

function updateShipPosition(ship, {action, value}) {
  switch (action) {
    case 'N': return { ...ship.position, lat: ship.position.lat + value}
    case 'S': return { ...ship.position, lat: ship.position.lat - value}
    case 'E': return { ...ship.position, lon: ship.position.lon + value}
    case 'W': return { ...ship.position, lon: ship.position.lon - value}
    case 'F': return updateShipPosition(ship, {action: ship.direction, value})
    default: return ship.position
  }
}

function handlerPart1(ship, instruction) {
  return {
    ...ship,
    position: updateShipPosition(ship, instruction),
    direction: updateShipDirection(ship, instruction),
  }
}

const shipPart1 = executeInstructions(ship, instructions, handlerPart1)
console.log('Part 1 =', getShipManhattanDisplacement(shipPart1))



// PART 2

function rotateWaypointLeft(waypoint, value) {
  for (let i = 0; i < value; i += 90)
    waypoint = {
      lat: waypoint.lon,
      lon: -waypoint.lat,
    }
  return waypoint
}

function rotateWaypointRight(waypoint, value) {
  for (let i = 0; i < value; i += 90)
    waypoint = {
      lat: -waypoint.lon,
      lon: waypoint.lat,
    }
  return waypoint
}

function updateWaypoint(waypoint, {action, value}) {
  switch (action) {
    case 'N': return { ...waypoint, lat: waypoint.lat + value}
    case 'S': return { ...waypoint, lat: waypoint.lat - value}
    case 'E': return { ...waypoint, lon: waypoint.lon + value}
    case 'W': return { ...waypoint, lon: waypoint.lon - value}
    case 'R': return rotateWaypointRight(waypoint, value)
    case 'L': return rotateWaypointLeft(waypoint, value)
    default : return waypoint
  }
}

function moveShipTowardsWaypoint(ship, {action, value}) {
  if (action == 'F') {
    return {
      lat: ship.position.lat + value * ship.waypoint.lat,
      lon: ship.position.lon + value * ship.waypoint.lon,
    }
  }
  return ship.position
}

function handlerPart2(ship, instruction) {
  return {
    ...ship,
    position: moveShipTowardsWaypoint(ship, instruction),
    waypoint: updateWaypoint(ship.waypoint, instruction),
  }
}

const shipPart2 = executeInstructions(ship, instructions, handlerPart2)
console.log('Part 2 =', getShipManhattanDisplacement(shipPart2))

const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const input = file.split('\n')
  .filter(line => line.length > 0) // disregard trailing \n

const schedule = {
  departureTime: Number(input[0]),
  buses: input[1].split(','),
}



// PART 1

function getBusNextDepartureTime(time, bus) {
  return Math.floor((time + bus - 1) / bus) * bus
}

const nextBus = schedule.buses
  // ignore buses out of service
  .filter(str => str !== 'x')
  .map(bus => Number(bus))
  // get the next departure time of a given bus
  .map(bus => ({
    bus: bus,
    time: getBusNextDepartureTime(schedule.departureTime, bus),
  }))
  // choose the bus with the lowest departure time
  .reduce((a, b) => a.time < b.time ? a : b)

console.log('Part 1 =', nextBus.bus * (nextBus.time - schedule.departureTime))



// PART 2

function gcd(a, b) {
  if (!b) return b === 0 ? a : NaN
  return gcd(b, a % b)
}

function lcm(a, b) {
  return a * b / gcd(a, b)
}

function busDepartsAtTime(time, {number, offset}) {
  return ((time - offset) % number == 0)
}

function findFirstCommonDepartureTime(bus1, bus2) {
  for (let time = bus1.offset; ; time += bus1.number) {
    if (busDepartsAtTime(time, bus2)) return time
  }
}

function combineBuses(bus1, bus2) {
  return {
    number: lcm(bus1.number, bus2.number),
    offset: findFirstCommonDepartureTime(bus1, bus2)
  }
}

const combinedBus = schedule.buses
  // map each bus to its arrival period and offset
  // and ignore the 'x', since they are wildcards
  .map((bus, index) => ({
    number: bus === 'x' ? 0 : Number(bus),
    offset: index,
  }))
  .filter(bus => bus.number !== 0)
  // combine their periods and offsets in pairs
  .reduce((b1, b2) => combineBuses(b1, b2), {number: 1, offset: 0})

console.log('Part 2 =', combinedBus.number - combinedBus.offset)

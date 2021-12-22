const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

/**
 * Warning: sadness below
 * My solution requires 8GB of memory and takes 200 seconds to run
 * The way to go is to "merge" regions of cuboids - find where they intersect and split them accordingly.
 * This solution generates the whole cuboid space (albeit in a smart way by using ranges), and will never be usable.
 * But it works.
 */

const coordinates = (x, y, z) => ({x, y, z})

const parseCoordinates = str =>
    coordinates(...str.split(',')
        .map(s => s.split('=')[1].split('..').map(Number))
        .map(([from, to]) => ({ from, to })))

const steps = file.split('\n')
    .map(line => line.split(' '))
    .map(([command, coords]) => ({command, coordinates: parseCoordinates(coords)}))

const rangesIntersect = (a, b) => (a.from >= b.from && a.from <= b.to) || (a.to >= b.from && a.to <= b.to)
const volumeIntersects = (a, b) => rangesIntersect(a.x, b.x) && rangesIntersect(a.y, b.y) && rangesIntersect(a.z, b.z)

const reduceToTargetRange = ({from, to}, target) => ({
    from: Math.max(Math.min(from, target.to), target.from),
    to:   Math.max(Math.min(to,   target.to), target.from),
})

const intersection = (coord, target) => ({
    x: reduceToTargetRange(coord.x, target.x),
    y: reduceToTargetRange(coord.y, target.y),
    z: reduceToTargetRange(coord.z, target.z),
})

const initArea = ({
    x: {from: -50, to: 50},
    y: {from: -50, to: 50},
    z: {from: -50, to: 50},
})

const reduceStepsToInitArea = steps =>
    steps.filter(step => volumeIntersects(step.coordinates, initArea))
        .map(({command, coordinates}) => ({command, coordinates: intersection(coordinates, initArea)}))

const removeDuplicates = array => [...new Set(array)]
const sortAsc = (a, b) => a - b
const getSetOfCoordinateValues = steps => ({
    x: removeDuplicates(steps.map(({coordinates}) => [coordinates.x.from, coordinates.x.to + 1]).flat()).sort(sortAsc),
    y: removeDuplicates(steps.map(({coordinates}) => [coordinates.y.from, coordinates.y.to + 1]).flat()).sort(sortAsc),
    z: removeDuplicates(steps.map(({coordinates}) => [coordinates.z.from, coordinates.z.to + 1]).flat()).sort(sortAsc),
})

const rangesAffectedByStep = ({coordinates}, ranges) => ({
    x: ranges.x.filter(x => x >= coordinates.x.from && x <= coordinates.x.to),
    y: ranges.y.filter(y => y >= coordinates.y.from && y <= coordinates.y.to),
    z: ranges.z.filter(z => z >= coordinates.z.from && z <= coordinates.z.to),
})

const applyStep = (step, ranges, regions) => {
    const stepRanges = rangesAffectedByStep(step, ranges)
    for (const x of stepRanges.x) {
        if (!(x in regions)) regions[x] = {}
        for (const y of stepRanges.y) {
            if (!(y in regions[x])) regions[x][y] = new Set()
            for (const z of stepRanges.z) {
                step.command === 'on' ? regions[x][y].add(z) : regions[x][y].delete(z)
            }
            if (regions[x][y].size === 0) delete regions[x][y]
        }
        if (Object.keys(regions[x]).length === 0) delete regions[x]
    }
}

const applySteps = (steps, ranges, litRegions) => {
    const start = performance.now()
    const result = steps.forEach((step, i) => applyStep(step, ranges, litRegions)) || litRegions
    const time = performance.now() - start
    console.log('Steps applied in', time, 'ms')
    return result
}


const regionVolume = (region, ranges) => {
    const xlen = ranges.x[ranges.x.indexOf(region.x) + 1] - region.x
    const ylen = ranges.y[ranges.y.indexOf(region.y) + 1] - region.y
    const zlen = ranges.z[ranges.z.indexOf(region.z) + 1] - region.z
    return xlen * ylen * zlen
}

const volumeOfLitRegions = (map, ranges) => {
    const start = performance.now()
    let volumeSum = 0
    for (const x in map) {
        for (const y in map[x]) {
            for (const z of map[x][y]) {
                volumeSum += regionVolume({x: parseInt(x), y: parseInt(y), z}, ranges)
            }
        }
    }
    const time = performance.now() - start
    console.log('Volume computed in', time, 'ms')
    return volumeSum
}

const numCuboidsLitAfterSteps = (steps, ranges = getSetOfCoordinateValues(steps), litRegions = {}) =>
    volumeOfLitRegions(applySteps(steps, ranges, litRegions), ranges)

console.log('Part 1 =', numCuboidsLitAfterSteps(reduceStepsToInitArea(steps)))
console.log('Part 2 =', numCuboidsLitAfterSteps(steps))
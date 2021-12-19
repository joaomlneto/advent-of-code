const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

/**
 * This is quite a slow solution.
 *
 * I ended up creating the whole 3D map from scanner readings. This approach makes it quite slow to merge
 * large regions with a large number of beacons. On my laptop, it takes around 3 minutes to run on my input.
 *
 * The optimal approach is to:
 * (1) Just know which scanners overlap which scanners (don't merge them!) and compute their offsets
 * (2) Get their offsets relative to any other scanner (by applying the necessary transformations through the graph of
 *     overlapping scanners
 */
const enableLogging = false // set to true to enable logging to see progress
const log = (...arr) => enableLogging && console.log(...arr)

const flipX   = beacons => beacons.map(({x, y, z}) => ({x:  x, y: -y, z: -z}))
const flipY   = beacons => beacons.map(({x, y, z}) => ({x: -x, y:  y, z: -z}))
const flipZ   = beacons => beacons.map(({x, y, z}) => ({x: -x, y: -y, z:  z}))
const rotateX = beacons => beacons.map(({x, y, z}) => ({x:  x, y: -z, z:  y}))
const rotateY = beacons => beacons.map(({x, y, z}) => ({x:  z, y:  y, z: -x}))
const rotateZ = beacons => beacons.map(({x, y, z}) => ({x: -y, y:  x, z:  z}))
const possibleFlipsOf = beacons => [beacons, flipX(beacons), flipY(beacons), flipZ(beacons)]
const possibleRotationsOf = beacons => [
    beacons,
    rotateX(beacons),
    rotateY(beacons),
    rotateZ(beacons),
    rotateY(rotateX(beacons)),
    rotateZ(rotateX(beacons))
]
// return the 24 possible orientations of beacons seen from scanner
const possibleOrientationsOf = beacons => possibleFlipsOf(beacons).map(beacons => possibleRotationsOf(beacons)).flat()

// add two {x, y, z} coordinates
const add3d = (a, b) => ({x: a.x + b.x, y: a.y + b.y, z: a.z + b.z})
// subtract two {x, y, z} coordinates
const sub3d = (a, b) => ({x: a.x - b.x, y: a.y - b.y, z: a.z - b.z})
// return list of beacons with all beacons offset by some {x, y, z}
const offsetBeacons = (beacons, {x, y, z}) => beacons.map(b => ({x: b.x + x, y: b.y + y, z: b.z + z}))
// check whether the two beacons are equal (same position)
const beaconsAreEqual = (a, b) => a.x === b.x && a.y === b.y && a.z === b.z
// check if a beacon is included in a list
const beaconInList = (beacon, beacons) => beacons.some(otherBeacon => beaconsAreEqual(beacon, otherBeacon))
// get the beacons in a that are also in b
const intersectingBeacons = (a, b) => a.filter(beacon => beaconInList(beacon, b))
// returns the union of two lists of beacons
const mergeBeaconList = (a, b) => [...a, ...b.filter(beacon => !beaconInList(beacon, a))]
// returns the manhattan distance between two {x, y, z} coordinates
const manhattanDistance = (a, b) => Math.abs(b.x - a.x) + Math.abs(b.y - a.y) + Math.abs(b.z - a.z)

// check whether two scanners may overlap (by checking all the possible orientations)
// if so, return the relative offset of scanner B compared to scanner A, and the merged list of beacons
const scannersOverlap = (a, b) => {
    const orientation = a.orientations[0]
    for (const otherOrientation of b.orientations) {
        for (const scanner of orientation) {
            for (const otherScanner of otherOrientation) {
                const offset = sub3d(scanner, otherScanner)
                const offsetList = offsetBeacons(otherOrientation, offset)
                const intersections = intersectingBeacons(orientation, offsetList)
                if (intersections.length >= 12)
                    return { offset, beacons: mergeBeaconList(orientation, offsetList) }
            }
        }
    }
}

// create a global scanner object, composed by the information from all scanners
const createMap = scanners => {
    for (const scanner of scanners) { scanner.id = [scanner.id]} // debug
    while (scanners.length > 1) {
        log('\nRemaining:', scanners.map(s => '('+s.id+')').join(' '))

        // pick Scanner A: scanner with least amount of beacons (scanner[0])
        scanners.sort((a, b) => a.beacons.length - b.beacons.length) // (small optimization)

        // find Scanner B: a distinct scanner whose field of view intersects Scanner A
        let mergedIndex // index of Scanner B on 'scanners' array
        let updatedBeaconsList; // merged list of beacons (from merging B into A)
        let offset; // offset of scanner B relative to scanner A
        for (const [index, scanner] of scanners.slice(1).entries()) {
            const result = scannersOverlap(scanners[0], scanner)
            if (result) {
                offset = result.offset
                mergedIndex = index + 1
                updatedBeaconsList = result.beacons
                break
            }
        }

        log('merging overlapping scanner', scanners[mergedIndex].id.join('+'), 'into', scanners[0].id.join('+'))

        // merge the mergeable scanner into the main scanner
        const scanner = scanners.splice(mergedIndex, 1)[0]
        scanners[0].id = [...scanners[0].id, ...scanner.id] // debug
        scanners[0].beacons = updatedBeaconsList
        scanners[0].orientations = possibleOrientationsOf(updatedBeaconsList)
        scanners[0].scannerPositions = [
            ...scanners[0].scannerPositions,
            ...scanner.scannerPositions.map(position => add3d(position, offset))
        ]
    }
    return scanners[0]
}

// returns the largest distance from a list of {x, y, z} coordinates
const largestDistance = coordinates =>
    coordinates.map((coordinate, i) => // take the coordinates of every sensor
        coordinates.slice(0, i).concat(coordinates.slice(i+1)).map(otherCoordinate => // and that of every other sensor
            manhattanDistance(coordinate, otherCoordinate))) // and get their manhattan distance
        .flat() // make it 1-dimensional array
        .reduce((max, distance) => Math.max(max, distance), 0) // and compute the maximum



// parse input and return a list of scanner objects
const scanners = file.split('\n\n').map(section => section.split('\n')).map(([scannerStr, ...coordsStr]) => {
    const id = parseInt(scannerStr.split(' ')[2])
    const beacons = coordsStr.map(str => str.split(',').map(x => parseInt(x))).map(([x, y, z]) => ({x, y, z}))
    const orientations = possibleOrientationsOf(beacons) // precompute list of beacons in all 24 orientations
    const scannerPositions = [{x:0, y:0, z:0}]
    return { id, beacons, orientations, scannerPositions }
})

const map = createMap(scanners)
console.log('Part 1 =', map.beacons.length)
console.log('Part 2 =', largestDistance(map.scannerPositions))
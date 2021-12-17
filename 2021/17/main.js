const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// parse input
const [x, y] = file.substr("target area: ".length).split(', ')
    .map(str => str.substr(2).split('..').map(n => parseInt(n)))
    .map(([min, max]) => ({min, max}))
const area = {x, y}

// returns the max height achieved given the initial velocity vector
const maxHeight = v0y => (v0y + 1) * v0y / 2

// given the initial vertical velocity, return the array of y coordinates the projectile will go through
const yPositions = (area, vy, dy = 0) => dy > area.y.min ? [dy, ...yPositions(area, vy - 1, dy + vy)] : [dy]

// returns whether the given velocity vector will make the projectile be within the target area after integer seconds
const yVelocityWillIntersectArea = (area, v0) => yPositions(area, v0.y).some(y => y >= area.y.min && y <= area.y.max)

// given the initial horizontal velocity, get the x coordinate after t seconds
const xPosition = (v0x, t) => v0x < t ? xPosition(v0x, v0x) : t * (v0x + (v0x - (t-1))) / 2

// check if the given position intersects the area
const isInArea = ({x, y}, area) => area.x.min <= x && x <= area.x.max && area.y.min <= y && y <= area.y.max

// return the list of {x, y} positions the projectile goes through
const projectilePositions = (area, v0) => yPositions(area, v0.y).map((y, i) => ({x: xPosition(v0.x, i), y}))

// check whether the projectil with initial velocity v0 will eventually hit the target area
const projectileHitsArea = (area, v0) => projectilePositions(area, v0).some(position => isInArea(position, area))

// check how high we can go and still intersect the target area
const maxAchievableHeightThatIntersectsArea = area =>
    // return the maximum height achieved by the best initial vertical velocity vector. but how do we find it?
    // possible vy ∈ [0 .. -area.min.y] (otherwise they will overshoot the region when going down)
    maxHeight([...Array(-area.y.min+1).keys()]
        // we want to find the greatest one, because it will reach the maximum height -- so, reverse the array
        .reverse()
        // find the first one that actually intersects the area
        .find(vy => yVelocityWillIntersectArea(area, {y: vy})))

const numVelocityVectorsThatIntersectArea = area =>
    // generate array of x values [0 .. area.x.max]
    [...Array(area.x.max + 1).keys()].map(x =>
        // generate array of y values [area.y.min, -area.y.min]
        [...Array(2 * -area.y.min).keys()].map(y => y + area.y.min).map(y =>
            // check if the velocity vector {x, y} will intersect the area
            projectileHitsArea(area, {x, y}))
            .filter(x => x) // consider only those that intersect the area (i.e. returned true)
    ).flat().length // return their number

console.log('Part 1 =', maxAchievableHeightThatIntersectsArea(area))
console.log('Part 2 =', numVelocityVectorsThatIntersectArea(area))
const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const depthReadings = file.split('\n').map(x => parseInt(x, 10))

function computeNumDepthIncreasesOfWindow(depthReadings, windowSize) {
    var numDepthIncreases = 0;
    for (var i = windowSize; i < depthReadings.length; i++)
        if (depthReadings[i] > depthReadings[i-windowSize])
            numDepthIncreases++;
    return numDepthIncreases;
}

console.log('Part 1 =', computeNumDepthIncreasesOfWindow(depthReadings, 1))
console.log('Part 2 =', computeNumDepthIncreasesOfWindow(depthReadings, 3))
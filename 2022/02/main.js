const fs = require('fs')

const filename = 'sample.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// parse input file
const rounds = file
    .split('\n')
    .filter(x => x)
    .map(line => line.split(' '))
    .map(([opponent, player]) => ({player, opponent}))

const letterIndex = str => str.charCodeAt(0) - 'A'.charCodeAt(0)
const letterIndexToChar = num => String.fromCharCode(num + 'A'.charCodeAt(0))

// mod function, but normalized to give a result between 0 and m-1
const mod = (n, m) => (n % m + m) % m;

// compute the shape score of a given round: 1 for rock, 2 for paper, 3 for scissors
const shapeScore = round => letterIndex(round) + 1

// compute the outcome score of a given round: 6 for a win, 3 for a draw, 0 for a loss
const outcomeScore = (player, opponent) => {
    switch (mod(letterIndex(player) - letterIndex(opponent), 3)) {
        case 0: return 3 // draw
        case 1: return 6 // loss
        case 2: return 0 // win
    }
}

const computeScore = (rounds, playerPick) => rounds
    .map(({player, opponent}) => ({opponent, player: playerPick(player, opponent)}))
    .reduce((acc, {opponent, player}) => acc + shapeScore(player) + outcomeScore(player, opponent), 0)

const pickPartOne = playerPick => String.fromCharCode(playerPick.charCodeAt(0) - 23)
const pickPartTwo = (opponent, player) => letterIndexToChar(mod(letterIndex(opponent) + letterIndex(player), 3))

console.log('Part 1:', computeScore(rounds, pickPartOne))
console.log('Part 2:', computeScore(rounds, pickPartTwo))

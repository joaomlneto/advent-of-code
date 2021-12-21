const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const startingPositions = file.split('\n').map(line => parseInt(line.at(-1)))

const NUM_PLAYERS = 2
const NUM_POSITIONS = 10

const nextPosition = (position, roll) => (position - 1 + roll) % NUM_POSITIONS + 1
const nextPlayer = player => (player + 1) % NUM_PLAYERS

class DeterministicDie {
    numRolls = 0
    roll = (n = 3) => this.numRolls++ % 100 + 1 + (n > 1 ? this.roll(n-1) : 0)
}

class DiracDie {
    roll = (n = 3) => n > 1 ? this.roll(n-1).map(n => [1, 2, 3].map(m => n + m)).flat() : [1, 2, 3]
}

const playDeterministic = positions => {
    const die = new DeterministicDie()
    let scores = [...Array(NUM_PLAYERS).keys()].fill(0)
    let currentPlayer = 0
    while (!scores.some(score => score >= 1000)) {
        positions[currentPlayer] = nextPosition(positions[currentPlayer], die.roll())
        scores[currentPlayer] += positions[currentPlayer]
        currentPlayer = nextPlayer(currentPlayer)
    }
    return Math.min(...scores) * die.numRolls
}

const evolvePositions = (positions, currentPlayer, roll) =>
    currentPlayer === 0
        ? [nextPosition(positions[0], roll), positions[1]]
        : [positions[0], nextPosition(positions[1], roll)]

const evolveScores = (scores, currentPlayer, positions) =>
    currentPlayer === 0
        ? [scores[0] + positions[currentPlayer], scores[1]]
        : [scores[0], scores[1] + positions[currentPlayer]]

const sumNumberOfVictories = (a, b) => ([a[0] + b[0], a[1] + b[1]])

const playDirac = (positions, die = new DiracDie(), currentPlayer = 0, scores = [0, 0], cache = {}) => {
    // generate a unique identifier for this state. two games are in the same state if:
    //   (a) current player is the same
    //   (b) players are in the same positions
    //   (c) players have the same score
    const id = currentPlayer + ',' + positions.join() + ',' + scores.join()

    // if we already computed the result for this state before, we don't need to recompute it again (just look it up!)
    if (cache[id]) return cache[id]

    const maxScore = Math.max(...scores)

    // if this is the first time we are seeing this, we have to do the heavy-lifting!
    // (1) cache the result, whatever it may be
    // (2) check if there is some player with a score >= 21
    //   if there is, return [1, 0] if player 0 won, [0, 1] if player 1 won
    //   otherwise, roll the die and play the game in every generated timeline
    return cache[id] = scores.some(score => score >= 21)
        ? scores.map(score => score === maxScore ? 1 : 0)
        : die.roll().map(roll => {
            const newPositions = evolvePositions(positions, currentPlayer, roll)
            const newScores = evolveScores(scores, currentPlayer, newPositions)
            return playDirac(newPositions, die, nextPlayer(currentPlayer), newScores, cache)
        }).reduce(sumNumberOfVictories, [0, 0])
}

console.log('Part 1 =', playDeterministic(startingPositions.slice()))
console.log('Part 2 =', Math.max(...playDirac(startingPositions.slice())))

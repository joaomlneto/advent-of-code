const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

/**
 * SOLUTION IS SLOW!
 * It takes ~25 seconds to run for sample.txt
 * Need to do further debugging to see what's wrong with it… shouldn't take too much tinkering!
 */
// print information up to N levels on the search tree
const MAXDEBUGDEPTH = 0

const EMPTY = '.'
const ROW_CORRIDOR = 1
const TOPMOST_HOUSE_ROW = 2
const NON_HOUSE_ROWS = 3 // 2 above, 1 below are not house rows

const amphipodNames = ['A', 'B', 'C', 'D']
const corridorStopPositions = [1, 2, 4, 6, 8, 10, 11]
const amphipodHouseCol = amphipod => ({A:3, B:5, C:7, D:9}[amphipod])
const moveUnitCost = amphipod => ({A:1, B:10, C:100, D:1000}[amphipod])
const isAmphipodName = name => amphipodNames.includes(name)

class House {
    constructor(diagram, name) {
        this.diagram = diagram
        this.name = name
        this.col = amphipodHouseCol(this.name)
        this.generatePositionsList()
        this.outermostPosition = new Position(2, this.col)
    }

    generatePositionsList() {
        this.positions = [...Array(this.diagram.grid.length - NON_HOUSE_ROWS).keys()]
            .map(row => new Position(row + TOPMOST_HOUSE_ROW, this.col))
            .reverse()
    }

    innermostVacantPosition() {
        return this.positions.find(({row, col}) => this.diagram.grid[row][col] === EMPTY)
    }

    getOutermostPosition() {
        return this.outermostPosition
    }

    hasNoStrangers() {
        return this.positions.every(({row, col}) =>
            this.diagram.grid[row][col] === this.name ||this.diagram.grid[row][col] === EMPTY)
    }

    isComplete() {
        return this.positions.every(({row, col}) => this.diagram.grid[row][col] === this.name)
    }

    toString() {
        return "HOUSE " + this.name + " POSITIONS: " + JSON.stringify(this.positions)
    }
}

class Position {
    constructor(row, col) {
        this.row = row
        this.col = col
    }

    equals(otherPosition) {
        return this.row === otherPosition.row && this.col === otherPosition.col
    }

    distanceTo(otherPosition) {
        const numRows = this.row - ROW_CORRIDOR + otherPosition.row - ROW_CORRIDOR
        const numCols = Math.abs(this.col - otherPosition.col)
        return numRows + numCols
    }
}

class Move {
    constructor(amphipod, to) {
        this.amphipod = amphipod
        this.from = new Position(amphipod.position.row, amphipod.position.col)
        this.to = to
        this.distance = this.from.distanceTo(this.to)
        this.cost = this.distance * moveUnitCost(this.amphipod.name) // g(move)
        //this.computeHeuristicDelta()
        this.remainingCostAfterMove = this.computeRemainingCostAfterMove() // h(move)
    }

    computeRemainingCostAfterMove() {
        this.amphipod.diagram.applyMove(this)
        const remainingCostAfterMove = this.amphipod.diagram.remainingCost
        this.amphipod.diagram.undoMove(this)
        return remainingCostAfterMove
    }

    computeHeuristicDelta() {
        this.amphipod.position = this.to
        const after = this.amphipod.minimumMovementCostToGetHome()
        this.amphipod.position = this.from
        const before = this.amphipod.minimumMovementCostToGetHome()
        this.heuristicDelta = after - before
    }

    toString() {
        return "MOVE AMPHIPOD " + this.amphipod.name + " AT " + JSON.stringify(this.from) + " TO " + JSON.stringify(this.to)
    }
}

class Amphipod {
    constructor(diagram, name, position) {
        this.diagram = diagram
        this.name = name
        this.position = position
    }

    ownHouse() {
        return this.diagram.houses[this.name]
    }

    ownHousePositions() {
        return this.ownHouse().positions
    }

    availableDestinations() {
        // check if amphipod is snug inside his own house. if so, stay warm and dont move.
        if (this.isComfyInOwnHouse()) return []

        // check if we are inside some other house but are blocked and can't get out
        // it is enough to check the position just above ours
        if (this.position.row > 1 && this.diagram.grid[this.position.row-1][this.position.col] != EMPTY)
            return []

        // check if we can move into our house.
        // the pathway to its entrance must be clear and the house must be free of strangers
        // if yes, go into the innermost empty position.
        if (this.canMoveIntoOwnHouse()) return [this.ownHouse().innermostVacantPosition()]

        // are we inside a house that is not ours and cant go to our house yet? can go to the corridor!
        if (this.position.row > 1) {
            return corridorStopPositions
                .filter(to => this.diagram.isCorridorFree(this.position.col, to))
                .map(col => new Position(1, col))
        }

        // we are in the corridor and can't go to our house. nothing to do.
        return []
    }

    availableMoves() {
        const result = this.availableDestinations().map(destination => new Move(this, destination))
        return result
    }

    canMoveToCorridorColumn(targetCol) {
        // don't consider amphipod's own position
        const fromCol = this.position.col + (this.position.col < targetCol ? 1 : - 1)
        return this.diagram.isCorridorFree(fromCol, targetCol)
    }

    // check if we can move into our house: pathway to house must be clear and house must have no strangers inside
    canMoveIntoOwnHouse() {
        return this.canMoveToCorridorColumn(this.ownHouse().col) && this.ownHouse().hasNoStrangers()
    }

    isComfyInOwnHouse() {
        return this.isInOwnHouse() && this.ownHouse().hasNoStrangers()
    }

    isInOwnHouse() {
        return this.ownHouse().positions.some(housePosition => this.position.equals(housePosition))
    }

    toString() {
        return `Amphipod(name=${this.name}, position=(${this.position.row},${this.position.col}), inHouse=${this.isInOwnHouse()})`
    }

    minimumMovementCostToGetHome() {
        if (this.isInOwnHouse()) return 0
        //return this.position.distanceTo(this.diagram.houses[this.name].outermostPosition) // why is this slower?
        const numRows = this.position.row - ROW_CORRIDOR + this.ownHouse().getOutermostPosition().row - ROW_CORRIDOR
        const numCols = Math.abs(this.position.col - this.ownHouse().getOutermostPosition().col)
        return (numRows + numCols) * moveUnitCost(this.name)
    }
}

class Diagram {
    constructor(grid) {
        this.grid = grid
        this.initializeMetadataStructures()
    }

    initializeMetadataStructures() {
        this.generateAmphipodPositions()
        this.generateHousePositions()
        this.computeRemainingCost()
    }

    generateAmphipodPositions() {
        this.amphipods = {}
        amphipodNames.forEach(name => this.amphipods[name] = [])
        this.grid.forEach((r, row) => r.forEach((name, col) => {
            if (isAmphipodName(name))
                this.amphipods[name].push(new Amphipod(this, name, new Position(row, col)))
        }))
    }

    generateHousePositions() {
        this.houses = {}
        amphipodNames.forEach(name => this.houses[name] = new House(this, name))
    }

    computeRemainingCost() {
        this.remainingCost = Object.keys(this.amphipods)
            .map(name => this.amphipods[name].map(amphipod => amphipod.minimumMovementCostToGetHome()))
            .flat()
            .reduce((a, b) => a + b, 0)
    }

    unfold() {
        this.grid = [
            ...this.grid.slice(0, 3),
            "  #D#C#B#A#".split(''),
            "  #D#B#A#C#".split(''),
            ...this.grid.slice(3),
        ]
        this.initializeMetadataStructures()
    }

    cellAt(position) {
        return this.grid[position.row][position.col]
    }

    isCorridorFree(from, to) {
        return (from > to)
            ? this.isCorridorFree(to, from)
            : this.grid[1].slice(from, to + 1).every(cell => cell === EMPTY)
    }

    // get all the available amphipod movements on the grid, sorted by their cost + expectedCost
    availableMoves() {
        return Object.values(this.amphipods).flat().map(amphipod => amphipod.availableMoves())
            .flat()
            .sort((a, b) =>
                (a.cost + a.remainingCostAfterMove) - (b.cost + a.remainingCostAfterMove))
    }

    applyMove({amphipod, from, to}) {
        this.grid[from.row][from.col] = EMPTY
        this.grid[to.row][to.col] = amphipod.name
        this.remainingCost -= amphipod.minimumMovementCostToGetHome()
        amphipod.position.row = to.row
        amphipod.position.col = to.col
        this.remainingCost += amphipod.minimumMovementCostToGetHome()
    }

    undoMove({amphipod, from, to}) {
        this.grid[from.row][from.col] = amphipod.name
        this.grid[to.row][to.col] = EMPTY
        this.remainingCost -= amphipod.minimumMovementCostToGetHome()
        amphipod.position.row = from.row
        amphipod.position.col = from.col
        this.remainingCost += amphipod.minimumMovementCostToGetHome()
    }

    print(prefix = '') {
        this.grid.forEach(line => console.log(prefix + line.join('')))
        console.log('Heuristic: ' + this.remainingCost)
        Object.keys(this.houses).forEach(name => console.log('houses[' + name + "]: " + this.houses[name].toString()))
        Object.keys(this.amphipods).forEach(name => this.amphipods[name].forEach(amphipod => console.log(amphipod.toString())))
    }

    isSolved() {
        return Object.values(this.houses).every(house => house.isComplete())
    }

    findMinCostMoves(cutoff = Infinity, depth = 0) {
        const prefix = "|  ".repeat(depth + 1)

        const moves = this.availableMoves()

        if (depth < MAXDEBUGDEPTH) {
            moves.forEach(move => console.log(prefix +
                'MOVE: ', move.toString(), move.cost, move.remainingCostAfterMove))
        }

        if (moves.length === 0 && this.isSolved()) return {cost: 0, moves: []}

        let best = {cost: Infinity, moves: []}

        moves.forEach((move, index) => {
            if (depth < MAXDEBUGDEPTH)
                console.log(prefix + 'remaining moves: ' + (moves.length - index), 'best so far', Math.min(best.cost, cutoff))

            if (move.cost + move.remainingCostAfterMove >= cutoff) return
            if (move.cost + move.remainingCostAfterMove >= best.cost) return

            this.applyMove(move)
            const result = this.findMinCostMoves(best.cost, depth + 1)
            this.undoMove(move)

            if (result.cost + move.cost < best.cost) {
                best.cost = result.cost + move.cost
                best.moves = [move, ...result.moves]
            }
        })

        return best
    }
}

const startGrid = file.split('\n').map(line => line.split(''))
const diagram = new Diagram(startGrid)

console.log('Part 1 =', diagram.findMinCostMoves().cost)
diagram.unfold()
console.log('Part 2 =', diagram.findMinCostMoves().cost)

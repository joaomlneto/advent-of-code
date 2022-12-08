const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// parse input file
const map = file.split('\n')
    .filter(x => x)
    .map(row => row.split(''))

//console.log(map)

const rows = Array.from(Array(map.length).keys())
const cols = Array.from(Array(map[0].length).keys())
const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

const isVisibleThroughDirection = (map, row, col, dr, dc) => {
    let r = row + dr
    let c = col + dc
    while (r >= 0 && r < map.length && c >= 0 && c < map[0].length) {
        if (map[row][col] <= map[r][c]) return false
        r += dr
        c += dc
    }
    return true
}

const isVisible = (map, row, col) => {
    for (const [dr, dc] of directions) {
        if (isVisibleThroughDirection(map, row, col, dr, dc)) return true
    }
}

const scenicScoreInDirection = (map, row, col, dr, dc) => {
    let r = row + dr
    let c = col + dc
    let score = 0
    while (r >= 0 && r < map.length && c >= 0 && c < map[0].length) {
        if (map[row][col] <= map[r][c]) {
            score++
            break
        }
        r += dr
        c += dc
        score++
    }
    return score
}

const scenicScore = (map, row, col) => {
    let score = 1
    for (const [dr, dc] of directions) {
        score *= scenicScoreInDirection(map, row, col, dr, dc)
    }
    return score
}

console.log('Part 1:', rows
    .map(row => cols.filter(col => isVisible(map, row, col)).length)
    .reduce((a, b) => a + b))

console.log('Part 2:', Math.max(...rows.flatMap(row => cols.map(col => scenicScore(map, row, col)))))


const row = 3
const col = 2
console.log('scenic score:', scenicScore(map, row, col))

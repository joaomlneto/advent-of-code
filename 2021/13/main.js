const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const [dotsString, instructionsString] = file.split('\n\n')

const EMPTY = ' ' // Changed from '.' for easier visualization
const DOT = '█' // Changed from '#' for easier visualization

const dots = dotsString.split('\n')
    .map(coordStr => coordStr.split(',').map(n => parseInt(n)))
    .map(([x, y]) => ({x, y}))

const instructions = instructionsString.split('\n')
    .map(str => str.split(' ')[2].split('='))
    .map(([direction, offset]) => ({direction, offset}))

// creates a paper with specified dimensions
const createPaper = ({x, y}) => Array.from(Array(y), () => new Array(x).fill(EMPTY))

// pretty-prints the paper to stdout
const printPaper = (paper) => console.log(paper.map(row => row.join('')).join('\n'))

// marks the coordinates on the given sheet of paper
const markDotOnPaper = (paper, {x, y}) => paper[y][x] = DOT

// marks all the dots on a sheet of paper
const markDotsOnPaper = (paper, dots) => dots.forEach(dot => markDotOnPaper(paper, dot))

// counts the number of dots visible on a sheet of paper
const countDots = (paper) => paper.flat().filter(x => x === DOT).length

// merges overlapping pieces of paper into a single piece of paper
const mergePapers = (a, b) => {
    for (let i = 0; i < a.length; i++)
        for (let j = 0; j < a[i].length; j++)
            if (b[i][j] == DOT) a[i][j] = DOT
    return a
}

// returns the required paper dimensions to be able to mark all the dots
const paperDimensions = (dots) => ({
    x: Math.max(...dots.map(dot => dot.x)) + 1,
    y: Math.max(...dots.map(dot => dot.y)) + 1
})

const createPaperFromDots = (dots) => {
    const paper = createPaper(paperDimensions(dots))
    markDotsOnPaper(paper, dots)
    return paper
}

// splits sheet of paper at specified Y-value
// returns the two pieces: the top half and the bottom half mirrored in the Y-axis
const splitY = (paper, offset) => [
    paper.slice(0, offset),       // top half
    paper.slice(offset).reverse() // bottom half reversed
]

// splits sheet of paper at specified X-value
// returns the two pieces: the left half and the right half mirrored in the Y-axis
const splitX = (paper, offset) => [
    paper.map(row => row.slice(0, offset)),       // left half
    paper.map(row => row.slice(offset).reverse()) // right half reversed
]

// folds the paper in the X axis at the given offset
const foldX = (paper, offset) => mergePapers(...splitX(paper, offset))

// folds the paper in the Y axis at the given offset
const foldY = (paper, offset) => mergePapers(...splitY(paper, offset))

// applies a given instruction to a piece of paper
const applyInstruction = (paper, instruction) =>
    instruction.direction == 'x' ? foldX(paper, instruction.offset) : foldY(paper, instruction.offset)

// applies a list of instructions sequentially to a piece of paper
const applyInstructions = (paper, instructions) =>
    instructions.reduce((paper, instr) => applyInstruction(paper, instr), paper)

const paper = createPaperFromDots(dots)
console.log('Part 1 =', countDots(applyInstruction(paper, instructions[0])))
console.log('Part 2:')
printPaper(applyInstructions(paper, instructions))

const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// parse input file
const instructions = file.split('\n')
    .filter(x => x)
    .map(row => row.split(' '))

const NUM_ROWS = 6
const NUM_COLS = 40

// simulation state
let x = 1;
let ip = 0;
let crt = [...Array(NUM_ROWS)].map(() => [...Array(NUM_COLS)].map(() => ' '));
let sumInterestingSignalStrengths = 0;

// common machine state changes for both instructions
const processInstructionEffects = (numCycles, effect) => {
    // Part 1: sum interesting signal strengths
    const cycle = Math.ceil(ip/20)*20;
    // check if we are crossing an interesting cycle boundary
    if (cycle % 40 !== 0 && Math.floor((ip + numCycles) / 20) > Math.floor(ip / 20)) {
        sumInterestingSignalStrengths += cycle * x
    }

    // Part 2: draw on the CRT
    for (let i = 0; i < numCycles; i++) {
        const rowIndex = Math.floor(ip / NUM_COLS) % NUM_ROWS
        const colIndex = ip % NUM_COLS
        const spritePixelPositions = [-1, 0, 1].map(n => ip % NUM_COLS + n)
        crt[rowIndex][colIndex] = spritePixelPositions.includes(x) ? '█' : '.';
        ip++;
    }

    // apply the effect of the instruction
    if (effect) effect();
}

instructions.forEach(instruction => {
    switch(instruction[0]) {
        case 'noop':
            processInstructionEffects(1)
            break;
        case 'addx':
            processInstructionEffects(2, () => x += Number(instruction[1]))
            break;
    }
})

console.log('Part 1:', sumInterestingSignalStrengths)
console.log('Part 2:\n' + crt.map(row => row.join('')).join('\n'))

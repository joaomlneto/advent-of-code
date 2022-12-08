const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// parse input file
const [stacksString, stepsString] = file.split('\n\n')
    .map(part => part.split('\n').filter(x => x))

// get an array of stacks from the first part of the input file
const numRows = stacksString.length - 1
const numStacks = Number(stacksString.at(-1).split(' ').at(-1))
const stacks = Array.from({length: numStacks}, () => [])

for (let row = numRows - 1; row >= 0; row--) {
    for (let col = 0; col < numStacks; col++) {
        const colIndex = col * 4 + 1
        if (stacksString[row][colIndex] && stacksString[row][colIndex] != ' ') {
            //console.log(row, col, stacksString[row][colIndex])
            stacks[col].push(stacksString[row][colIndex])
        }
    }
}

// get an array of steps from the second part of the input file
const steps = stepsString
    .map(str => str.split(' ').filter(x => !isNaN(x)))
    .map(([amount, from, to]) => ({amount: Number(amount), from: Number(from) - 1, to: Number(to) - 1}))

const crateMover9000Step = (stacks, {amount, from, to}) => {
    for (let i = 0; i < amount; i++) {
        stacks[to].push(stacks[from].pop())
    }
}

const crateMover9001Step = (stacks, {amount, from, to}) => {
    const tmp = []
    for (let i = 0; i < amount; i++) {
        tmp.push(stacks[from].pop())
    }
    for (let i = 0; i < amount; i++) {
        stacks[to].push(tmp.pop())
    }
}

const performStepsAndGetTopCrates = (stacks, steps, crane) => {
    steps.forEach(step => {
        crane(stacks, step)
    })
    return stacks.map(stack => stack.pop()).join('')
}

const copyStacks = stacks => stacks.map(stack => [...stack])

console.log('Part 1:', performStepsAndGetTopCrates(copyStacks(stacks), steps, crateMover9000Step))
console.log('Part 2:', performStepsAndGetTopCrates(copyStacks(stacks), steps, crateMover9001Step))

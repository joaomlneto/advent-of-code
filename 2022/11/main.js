const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// parse input file
const monkeys = file.split('\n\n')
    .filter(x => x)
    .map(x => x.split('\n'))
    .map(x => ({
        items: x[1].split(':')[1].split(',').map(x => Number(x.trim())),
        operator: x[2].split(':')[1].split('=')[1].trim().split(" ")[1],
        operand: x[2].split(':')[1].split('=')[1].trim().split(" ")[2],
        test: {
            modulo: Number(x[3].split(' ').at(-1)),
            monkeyIfTrue: Number(x[4].split(' ').at(-1)),
            monkeyIfFalse: Number(x[5].split(' ').at(-1)),
        },
        itemsInspected: 0,
    }))

// Keep worry manageable! (part 2 hint)
const worryModulo = monkeys.map(monkey => monkey.test.modulo).reduce((a, b) => a * b)

const operatorFn = (operator) => ({
    '+': (a, b) => a + b,
    '*': (a, b) => a * b,
}[operator])

const applyOperator = (old, operator, op2) => operatorFn(operator)(old, (op2 === 'old' ? old : Number(op2)))

const doRound = (monkeys, worryDecays = true) => {
    monkeys.forEach(monkey => {
        const { items, operator, operand, test } = monkey
        while (items.length > 0) {
            // pick item
            const item = items.shift()
            monkey.itemsInspected++

            // multiply worry level according to monkey operation
            let newWorryLevel = applyOperator(item, operator, operand) % worryModulo

            // if worry decays (part 1), do integer division by 3
            if (worryDecays) newWorryLevel = Math.floor(newWorryLevel / 3)

            // throw at the target monkey
            let targetMonkey = newWorryLevel % test.modulo === 0 ? test.monkeyIfTrue : test.monkeyIfFalse
            monkeys[targetMonkey].items.push(newWorryLevel)
        }
    })
}
const monkeyBusinessLevel = monkeys => monkeys
    .map(monkey => monkey.itemsInspected)
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((a, b) => a * b)

const simulate = (initialMonkeys, numRounds, worryDecays = true) => {
    const monkeys = JSON.parse(JSON.stringify(initialMonkeys)) // deep copy initial state
    for (let i = 0; i < numRounds; i++) doRound(monkeys, worryDecays)
    return monkeyBusinessLevel(monkeys)
}

console.log('Part 1:', simulate(monkeys, 20))
console.log('Part 2:', simulate(monkeys, 10000, false))

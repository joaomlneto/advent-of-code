const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

/**
 * Parse the input into shiny objects:
 * e.g.: 'add x 12' becomes {op: 'add', args: ['x', 12]}
 */
const instructions = file.split('\n')
    .map(line => line.split(' '))
    .map(([op, ...args], i) => ({
        op,
        args: args.map(arg => isNaN(arg) ? arg : Number(arg))
    }))

/**
 * By analyzing the code, it is composed of 14 iterations (one for each digit), each with 18 instructions.
 * The first instruction in the iteration is always `inp w` and they are all *MOSTLY* identical.
 */
const NUM_DIGITS = 14
const NUM_ITERATIONS = 14 // well, also 14. one per digit
const ITERATION_LENGTH = 18
const POSSIBLE_DIGIT_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// split the code into the 14 iterations
const iterations = []
for (let i = 0; i < NUM_ITERATIONS; i++)
    iterations.push({
        index: i,
        instructions: instructions.slice(i * ITERATION_LENGTH, (i+1) * ITERATION_LENGTH)
    })

/**
 * Each iteration is matched to another iteration, stack-style.
 * Whenever the 5th instruction of an iteration is `div z 1`, we 'push' the instruction into the stack.
 * Whenever the 5th instruction of an iteration is `div z 26`, we 'pop' from the stack and match the current iteration
 * with the popped iteration.
 *
 * Where am I seeing stacks? The values in the stack are encoded in base 26.
 * How to encode several values in a single number? That's what we do already with Base N numbers.
 *
 * For example, we can encode push(1), push(2), push(3) into a stack, and retrieve them pop()->3, pop()->2, pop()->1:
 * stack is a number
 * push(n) => stack = stack * BASE + n
 * pop() => n = mod stack BASE; stack = div stack BASE; return n
 *
 * For example, encoding [1, 2, 3] in base 10:
 * push(1) => stack = 0 * 10 + 1 => stack = 1
 * push(2) => stack = 1 * 10 + 2 => stack = 12
 * push(3) => stack = 12 * 10 + 3 => stack = 123
 * pop() => n = 123 % 10 = 3; stack = 123 / 10 = 12; return 3
 * pop() => n = 12 % 10 = 2; stack = 12 / 10 = 1; return 2
 * pop() => n = 1 % 10 = 1; stack = 1 / 10 = 0; return 1
 *
 * In this program, 'z' is the number that keeps the values in the stack.
 * For the model number to be accepted, 'z' must be zero at the end, which means no values can be left in the stack!!
 *
 * Now that we know which iterations match which iterations, how are they matched?
 * Each iteration tends to add stuff to the stack. The only exception is when an iteration has `div z 26` as its 5th
 * instruction, in which case it will not add to the stack. And, with luck, it will remove from the stack:
 * Lets call the iteration that was popped from the stack 'A' and the current iteration "B".
 *
 * For iteration B to not remove things from the stack without adding, the following condition must be satisfied:
 * -> A[n] denotes the nth instruction (zero-indexed)
 * -> A[n].args[i] denotes the ith argument of the nth instruction
 * A.w + A[15].args[1] + B[5].args[1] == B.w
 * This means that, when we "guess" a value for one iteration, it automatically lets us know the required value for the
 * other iteration. Further, it tells us immediately if the condition can be satisfied.
 *
 * Other way of looking at it, by checking what iterations do:
 * The result of the first iteration is push(w + iteration[15].args[1]). It adds the second argument of instruction 15
 * to the input value and pushes that value into z.
 * This is common to all iterations with `div z 1` (assuming their 5th instruction adds a number greater than 9 to x)`
 * If it doesn't add a number greater than 9, then I have no idea. You're out of luck.
 * If it is greater than 9, then after instruction 7 (eql x 0), x will always be 1, and will result in:
 * push(w + iteration[15].args[1])
 *
 * Iterations with `div z 26` pop from the stack and are able to avoid pushing things to the stack at the end. This is
 * accomplished by having y = 0 (last instruction), which happens by satisfying the above equation.
 *
 * Analyzing complexity: iterations only depend on each other in pairs, and each pair can have at most 9 valid values.
 * This means that we only need to check up to 63 combinations (NUM_ITERATIONS/2 * NUM_POSSIBILITIES_PER_DIGIT)
 * This is slightly better than the brute-force approach with 22876792454961 combinations.
 */

// get the list of restrictions based on the essay described above
const stack = []
const restrictions = []
iterations.forEach(iteration => {
    if (iteration.instructions[4].args[1] === 1) {
        stack.push(iteration)
    } else {
        const otherIteration = stack.pop()
        const a15 = otherIteration.instructions[15].args[1]
        const b5 = iteration.instructions[5].args[1]
        restrictions.push({a: otherIteration, b: iteration})
    }
})

/**
 * Now that we know the mysterious restrictions on model numbers that were discussed on the MONAD documentation eaten
 * by a tanuki… we just have to search for the numbers that satisfy them (without needing to run the program)
 */
const largestNumber  = [...Array(NUM_DIGITS)]
const smallestNumber = [...Array(NUM_DIGITS)]
restrictions.forEach(({a, b}) => {
    const digits = [9, 8, 7, 6, 5, 4, 3, 2, 1]
    const a15 = a.instructions[15].args[1]
    const b5 = b.instructions[5].args[1]
    // index of 'a' is always smaller than index of 'b'.
    // to search for the largest overall model number, we attempt to get the largest value for w[a.index], as
    // it is a more significant digit than w[b.index].
    const options = digits.map(digit => {
        const wa = digit
        const wb = digit + a15 + b5;
        return ({wa: digit, wb: digit + a15 + b5})
    }).filter(({wa, wb}) => POSSIBLE_DIGIT_VALUES.includes(wa) && POSSIBLE_DIGIT_VALUES.includes(wb))

    // to get the largest number, take the first option
    largestNumber[a.index] = options[0].wa
    largestNumber[b.index] = options[0].wb

    // to get the smallest number, take the last option
    smallestNumber[a.index] = options.at(-1).wa
    smallestNumber[b.index] = options.at(-1).wb
})



// print restrictions as equations/dependencies between pairs of inputs
// w[i] represents the digit provided as input on iteration i
const printRestrictions = restrictions => {
    restrictions.forEach(({a, b}) => {
        const aIndex = a.index.toString().padStart(2)
        const bIndex = b.index.toString().padStart(2)
        const a15 = a.instructions[15].args[1].toString().padStart(3)
        const b5 = b.instructions[5].args[1].toString().padStart(3)
        console.log(`w[${aIndex}] + ${a15} + ${b5} = w[${bIndex}]`)
    })
}

//printRestrictions(restrictions) // uncomment me to see the equations!
console.log('Part 1 =', largestNumber.join(''))
console.log('Part 2 =', smallestNumber.join(''))
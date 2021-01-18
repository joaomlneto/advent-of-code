const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const rom = file.trim().split(',').map(value => Number(value))

function run(mem) {
  let pc = 0;
  while (mem[pc] !== 99) {
    switch (mem[pc]) {
      case 1:
        mem[mem[pc + 3]] = mem[mem[pc + 1]] + mem[mem[pc + 2]]
        break
      case 2:
        mem[mem[pc + 3]] = mem[mem[pc + 1]] * mem[mem[pc + 2]]
        break
    }
    pc += 4
  }
  return mem[0]
}

function patchAndRun(rom, noun, verb) {
  mem = rom.slice()
  mem[1] = noun
  mem[2] = verb
  return run(mem)
}

function findPatch(rom, result) {
  for (let noun = 0; noun < 100; noun++) {
    for (let verb = 0; verb < 100; verb++) {
      if (patchAndRun(rom, noun, verb) === result) {
        return 100 * noun + verb
      }
    }
  }

}

console.log('Part 1 =', patchAndRun(rom, 12, 2))
console.log('Part 2 =', findPatch(rom, 19690720))

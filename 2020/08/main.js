const fs = require('fs')

const file = fs.readFileSync('input.txt').toString('utf8');

const instructions = file.split('\n')
  .filter(line => line.length > 0)
  .map(line => {
    const [opcode, arg] = line.split(' ')
    return {
      opcode: String(opcode),
      arg: Number(arg)
    }
  })

function execute(instructions) {
  let executedInstructions = []
  let ip = 0;
  let acc = 0;
  while (!executedInstructions.includes(ip) && (ip >= 0 && ip < instructions.length)) {
    executedInstructions.push(ip)
    //console.log(ip, instructions[ip])
    const instruction = instructions[ip++]
    switch(instruction.opcode) {
      case 'acc':
        acc += instruction.arg;
        break;
      case 'jmp':
        ip = ip - 1 + instruction.arg;
        break;
      case 'nop':
        // do nothing
        break;
      default: console.log('COSMIC RAY DETECTED'); return;
    }
  }

  return {
    ip,
    acc,
    executedInstructions: executedInstructions.length,
    infiniteLoopDetected: executedInstructions.includes(ip),
    goodTermination: ip == instructions.length,
  }
}

function findPatch(instructions) {
  for(let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i]
    if (['jmp', 'nop'].includes(instruction.opcode)) {
      // do not patch NOP +0
      if (instruction.opcode == 'nop' && instruction.arg == 0) continue;

      // attempt patch
      const newOpcode = instruction.opcode == 'nop' ? 'jmp' : 'nop';
      patchedInstructions = instructions.slice()
      patchedInstructions[i] = {
        opcode: newOpcode,
        arg: instruction.arg
      }
      const result = execute(patchedInstructions);
      if (result.goodTermination) {
        return result.acc
      }

    }
  }
}

console.log('Part 1: acc =', execute(instructions).acc);
console.log('Part 2: acc =', findPatch(instructions))

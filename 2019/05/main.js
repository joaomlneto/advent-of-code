const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const rom = file.trim().split(',').map(value => Number(value))

function read_opcode(mem, addr) {
  return mem[addr] % 100
}

function read_arg(mem, addr, parameter_mode) {
  if (parameter_mode === 0) return mem[mem[addr]]
  if (parameter_mode === 1) return mem[addr]
  throw Error('bad parameter mode')
}

function read_args(mem, opcode_addr, num_params) {
  const param_modes_value = Math.floor(mem[opcode_addr] / 100)
  return decode_parameter_mode(param_modes_value, num_params)
    .map((mode, argnum) => read_arg(mem, opcode_addr + argnum + 1, mode))
}

function decode_parameter_mode(param_modes_value, num_params) {
  const modes = Array.from(Array(num_params), () => 0)
  for (let i = 0; param_modes_value !== 0; i++) {
    modes[i] = param_modes_value % 10
    param_modes_value = Math.floor(param_modes_value / 10)
  }
  return modes
}

function run_part_1(mem, input) {
  let pc = 0;
  let parameter_mode = 0
  let output = []
  while (read_opcode(mem, pc) !== 99) {
    let num_args = 0
    let args;
    switch (read_opcode(mem, pc)) {
      case 1:
        num_args = 3
        args = read_args(mem, pc, num_args)
        mem[mem[pc + 3]] = args[0] + args[1]
        break
      case 2:
        num_args = 3
        args = read_args(mem, pc, num_args)
        mem[mem[pc + 3]] = args[0] * args[1]
        break
      case 3:
        num_args = 1
        mem[mem[pc+1]] = input
        break
      case 4:
        num_args = 1
        args = read_args(mem, pc, num_args)
        output.push(args[0])
        break
    }
    pc += 1 + num_args
  }
  return output.slice(-1)[0]
}

function run_part_2(mem, input) {
  let pc = 0;
  let parameter_mode = 0
  let output = []
  while (read_opcode(mem, pc) !== 99) {
    let num_args = 0
    let increment_pc = true
    switch (read_opcode(mem, pc)) {
      case 1:
        num_args = 3
        args = read_args(mem, pc, num_args)
        mem[mem[pc + 3]] = args[0] + args[1]
        break
      case 2:
        num_args = 3
        args = read_args(mem, pc, num_args)
        mem[mem[pc + 3]] = args[0] * args[1]
        break
      case 3:
        num_args = 1
        mem[mem[pc+1]] = input
        break
      case 4:
        num_args = 1
        args = read_args(mem, pc, num_args)
        output.push(args[0])
        break
      case 5:
        num_args = 2
        args = read_args(mem, pc, num_args)
        pc = (args[0] !== 0) ? args[1] : pc + 1 + num_args
        increment_pc = false
        break
      case 6:
        num_args = 2
        args = read_args(mem, pc, num_args)
        pc = (args[0] === 0) ? args[1] : pc + 1 + num_args
        increment_pc = false
        break
      case 7:
        num_args = 3
        args = read_args(mem, pc, num_args)
        mem[mem[pc + 3]] = (args[0] < args[1]) ? 1 : 0
        break
      case 8:
        num_args = 3
        args = read_args(mem, pc, num_args)
        mem[mem[pc + 3]] = (args[0] === args[1]) ? 1 : 0
        break
    }
    if (increment_pc) pc += 1 + num_args
  }
  return output[0]
}

console.log('Part 1 =', run_part_1(rom.slice(), 1))
console.log('Part 2 =', run_part_2(rom.slice(), 5))

const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const MASK_LEN = 36

const instructions = file.split('\n')
  .filter(line => line.length > 0) // disregard trailing \n
  .map(line => {
    if (line.startsWith('mask')) {
      return {
        op: 'mask',
        value: line.slice(-MASK_LEN),
      }
    }
    if (line.startsWith('mem')) {
      return {
        op: 'mem',
        index: Number((/\[([0-9]+)\]/g).exec(line)[1]),
        value: Number(line.match(/\D*(\d+)$/)[1])
      }
    }
  })

// get binary representation of number
function dec2bin(n) {
  return (n >>> 0).toString(2)
}

// get number from binary representation
function bin2dec(n) {
  return parseInt(n, 2)
}

// replace char in string
function replaceCharAtIndex(string, position, replacement) {
  return string.slice(0, position) + replacement + string.slice(position + 1)
}

function applyInstructions(instructions, {
  addrDecoder = (a) => [a],
  valueDecoder = (v) => v
}) {
  let mask = ''
  let mem = {}
  for (let i = 0; i < instructions.length; i++) {
    const {op, index, value} = instructions[i]
    if (op == 'mask') {
      mask = value
    }
    if (op == 'mem') {
      addrDecoder(index, mask)
        .forEach((address, i) => {
          mem[address] = valueDecoder(value, mask)
        });
    }
  }
  return {
    mask,
    mem,
    sum: Object.keys(mem).reduce((a, b) => a + mem[b], 0),
  }
}

function valueDecoder(value, mask) {
  const bin = dec2bin(value).padStart(MASK_LEN, '0')
  const maskedBin = mask
    .split('')
    .map((c, i) => {
      switch(c) {
        case 'X': return bin[i]
        case '0': return '0'
        case '1': return '1'
      }
    })
    .join('')
  return bin2dec(maskedBin)
}

function addrDecoder(address, mask) {
  let addresses = []
  let binAddress = dec2bin(address).padStart(MASK_LEN, '0')

  // compute the base address (where all Xs are zeroes)
  const baseAddress = mask
    .split('')
    .map((c, i) => {
      switch(c) {
        case '0': return binAddress[i]
        case '1': return '1'
        case 'X': return '0'
      }
    })
    .join('')
  addresses = [baseAddress]

  // generate all other addresses from the base address
  const x = mask
    .split('')
    .forEach((c, i) => {
      if (c == 'X') {
        const newAddresses = addresses
          .map(addr => replaceCharAtIndex(addr, i, '1'))
        addresses = [...addresses, ...newAddresses]
      }
    })

  return addresses
}

console.log('Part 1 =', applyInstructions(instructions, {valueDecoder}).sum)
console.log('Part 2 =', applyInstructions(instructions, {addrDecoder}).sum)

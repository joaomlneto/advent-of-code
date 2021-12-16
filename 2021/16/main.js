const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const hex2bin = hex => hex.split('').map(hexChar => parseInt(hexChar, 16).toString(2).padStart(4, '0')).join('')

// parse input
const bits = file.split('').map(hexChar => parseInt(hexChar, 16).toString(2).padStart(4, '0')).join('')

const parseLiteralPayload = payloadBits => {
    let trimmedPayloadBits = ''
    for (let i = 0; i < payloadBits.length; i++) {
        const group = payloadBits.slice(i*5 + 0, i*5 + 5)
        trimmedPayloadBits += group.slice(1)
        if (group[0] === '0') break
    }
    return {
        value: parseInt(trimmedPayloadBits, 2),
        len: trimmedPayloadBits.length * 5/4
    }
}

// scan bits and attempt to find packets inside
const scanBitsForPackets = bits => {
    const packets = []
    while (bits.length > 0) {
        const packet = buildPacketTree(bits)
        bits = bits.slice(packet.len)
        packets.push(packet)
    }
    return packets
}

const extractPacketsFromBits = (bits, numPackets) => {
    const packets = []
    for (let i = 0; i < numPackets; i++) {
        const packet = buildPacketTree(bits)
        bits = bits.slice(packet.len)
        packets.push(packet)
    }
    return packets
}

const parseOperatorPayload = bits => {
    let subpackets = []
    const lengthTypeID = bits[0]
    bits = bits.slice(1)
    if (lengthTypeID == 0) {
        const lengthSubpackets = parseInt(bits.slice(0, 15), 2)
        subpackets = scanBitsForPackets(bits.slice(15, 15 + lengthSubpackets))
    }
    if (lengthTypeID == 1) {
        const numSubpackets = parseInt(bits.slice(0, 11), 2)
        subpackets = extractPacketsFromBits(bits.slice(11), numSubpackets)
    }
    return {
        subpackets,
        len: (lengthTypeID == 0 ? 16 : 12) + subpackets.reduce((len, packet) => len + packet.len, 0)
    }
}

const buildPacketTree = bits => {
    const version = parseInt(bits.slice(0, 3), 2)
    const typeID = parseInt(bits.slice(3, 6), 2)
    const payload = typeID === 4 ? parseLiteralPayload(bits.slice(6)) : parseOperatorPayload(bits.slice(6))
    const len = 6 + payload.len
    return {version, typeID, len, subpackets: payload.subpackets || [], value: payload.value}
}

const sumVersionNumbers = packet => packet.version + packet.subpackets.reduce((sum, p) => sum + sumVersionNumbers(p), 0)

const OP = {'ADD': 0, 'MUL': 1, 'MIN': 2, 'MAX': 3, 'INT': 4, 'GRT': 5, 'LST': 6, 'EQT': 7}

const evaluate = packet => ({
    [OP['ADD']]: packet => packet.subpackets.reduce((sum, p) => sum + evaluate(p), 0),
    [OP['MUL']]: packet => packet.subpackets.reduce((prd, p) => prd * evaluate(p), 1),
    [OP['MIN']]: packet => packet.subpackets.reduce((min, p) => Math.min(min, evaluate(p)), Infinity),
    [OP['MAX']]: packet => packet.subpackets.reduce((max, p) => Math.max(max, evaluate(p)), -Infinity),
    [OP['INT']]: packet => packet.value,
    [OP['GRT']]: packet => (evaluate(packet.subpackets[0]) > evaluate(packet.subpackets[1])) ? 1 : 0,
    [OP['LST']]: packet => (evaluate(packet.subpackets[0]) < evaluate(packet.subpackets[1])) ? 1 : 0,
    [OP['EQT']]: packet => (evaluate(packet.subpackets[0]) == evaluate(packet.subpackets[1])) ? 1 : 0
}[packet.typeID](packet))

// sanity checks part 1
console.assert(sumVersionNumbers(buildPacketTree(hex2bin("D2FE28"))) === 6)
console.assert(sumVersionNumbers(buildPacketTree(hex2bin("38006F45291200"))) === 9)
console.assert(sumVersionNumbers(buildPacketTree(hex2bin("EE00D40C823060"))) === 14)
console.assert(sumVersionNumbers(buildPacketTree(hex2bin("8A004A801A8002F478"))) === 16)
console.assert(sumVersionNumbers(buildPacketTree(hex2bin("620080001611562C8802118E34"))) === 12)
console.assert(sumVersionNumbers(buildPacketTree(hex2bin("C0015000016115A2E0802F182340"))) === 23)
console.assert(sumVersionNumbers(buildPacketTree(hex2bin("A0016C880162017C3686B18A3D4780"))) === 31)

// sanity checks part 2
console.assert(evaluate(buildPacketTree(hex2bin("C200B40A82"))) === 3)
console.assert(evaluate(buildPacketTree(hex2bin("04005AC33890"))) === 54)
console.assert(evaluate(buildPacketTree(hex2bin("880086C3E88112"))) === 7)
console.assert(evaluate(buildPacketTree(hex2bin("CE00C43D881120"))) === 9)
console.assert(evaluate(buildPacketTree(hex2bin("D8005AC2A8F0"))) === 1)
console.assert(evaluate(buildPacketTree(hex2bin("F600BC2D8F"))) === 0)
console.assert(evaluate(buildPacketTree(hex2bin("9C005AC2F8F0"))) === 0)
console.assert(evaluate(buildPacketTree(hex2bin("9C0141080250320F1802104A08"))) === 1)

const packet = buildPacketTree(bits)
console.log('Part 1 =', sumVersionNumbers(packet))
console.log('Part 2 =', evaluate(packet))

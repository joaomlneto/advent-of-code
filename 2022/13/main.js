const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

const RIGHT_ORDER = -1
const INCONCLUSIVE = 0
const WRONG_ORDER = 1

// parse input file
const packetPairs = file.trim()
    .split("\n\n")
    .map((packet) => packet
        .split("\n")
        .map(JSON.parse))
    .map(([left, right]) => ({ left, right }));

// function to check if a pair of packets is in the right order (part 1)
// this can also be fed to array.sort() to sort the packets! (part 2)
const comparePackets = (left, right) => {
    // if both are integers, left should be less than right
    if ([left, right].every(Number.isInteger)) {
        return right > left ? RIGHT_ORDER : right < left ? WRONG_ORDER : INCONCLUSIVE;
    }
    // if both are lists
    if (![left, right].some(Number.isInteger)) {
        // compare each one by one according to the same rules as above until we run out of elements
        for (let i = 0; i < Math.min(left.length, right.length); i++) {
            const result = comparePackets(left[i], right[i]);
            // if the result is conclusive, return it
            if (result !== 0) {
                return result;
            }
        }
        // if left list runs out of elements first, they are in the right order
        if (left.length < right.length) return RIGHT_ORDER
        // if right list runs out of elements first, they are in the wrong order
        if (left.length > right.length) return WRONG_ORDER
        // otherwise need to keep checking...
        return INCONCLUSIVE;
    }
    // if one of them is a list and the other is a number... make the number a list and repeat the process
    return comparePackets(Number.isInteger(left) ? [left] : left, Number.isInteger(right) ? [right] : right);
}

const locatorPackets = [[[2]], [[6]]]
const packetsAreEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const isLocatorPacket = (packet) => locatorPackets.some(locatorPacket => packetsAreEqual(packet, locatorPacket))

console.log('Part 1:', packetPairs
    .map(({left, right}, i) => ({index: i + 1, inRightOrder: comparePackets(left, right) === RIGHT_ORDER}))
    .filter(({inRightOrder}) => inRightOrder)
    .reduce((sum, {index}) => sum + index, 0))

console.log('Part 2:', [...packetPairs.map(Object.values).flat(), ...locatorPackets]
    .sort(comparePackets)
    .map((packet, i) => ({index: i + 1, isLocatorPacket: isLocatorPacket(packet)}))
    .filter(({isLocatorPacket}) => isLocatorPacket)
    .reduce((product, {index}) => product * index, 1))

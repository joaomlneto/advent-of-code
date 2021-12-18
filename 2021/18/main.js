const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const [LEFT, RIGHT] = [0, 1]

// check if number is a regular (non-pair) number
const isRegularNum = n => Number.isInteger(n)

// check if number is a snailfish (pair) number
const isSnailfishNum = n => Array.isArray(n)

// adds two snailfish numbers
const add = (a, b) => reduce([a, b])

// adds a sequence of snailfish numbers
const sum = nums => nums.slice(1).reduce((a, b) => add(a, b), nums[0])

// returns the magnitude of the snailfish number
const magnitude = num => isRegularNum(num) ? num : 3 * magnitude(num[LEFT]) + 2 * magnitude(num[RIGHT])

// propagate exploded amount to the righmost leaf possible
// returns the resulting snailfish number with 'addLeft' added to the rightmost leaf possible
const propagateExplosionLeft = (num, addLeft) =>
    isRegularNum(num) ? num + addLeft : [num[LEFT], propagateExplosionLeft(num[RIGHT], addLeft)]

// attempt to propagate exploded amount to the leftmost leaf possible
// returns {num, addRight}
// num is the resulting number of the propagation attempt (may remain unchanged if unsuccessful)
// addRight is the original amount (if unable to propagate) or 0 if successful
const propagateExplosionRight = (num, addRight) => {
    if (addRight === 0) return {num, addRight}
    if (isRegularNum(num)) return {num: num + addRight, addRight: 0}
    const left = propagateExplosionRight(num[LEFT], addRight)
    const right = left.addRight === 0 ? {num: num[RIGHT], addRight: 0} : propagateExplosionRight(num[RIGHT], addRight)
    return {
        num: [left.num, right.num],
        addRight: left.addRight + right.addRight
    }
}

// perform explode operation: if any pair is nested inside four pairs, the leftmost such pair explodes
// returns {num, addLeft, addRight, exploded}
//   num: the resulting number after the operation. unchanged if no explosions
//   addLeft: amount that exploded that is yet to be propagated to the left
//   addRight: amount that exploded that is yet to be propagated to the right
//   exploded: true if found a pair nested inside four pairs (which exploded), false otherwise
const explode = (num, depth = 0) => {
    // if it is a regular number, just return its value
    if (isRegularNum(num)) return {num, addLeft: 0, addRight: 0, exploded: false}

    // if a pair is nested inside four pairs, the leftmost such pair explodes
    if (depth === 4 && isSnailfishNum(num)) return {num: 0, addLeft: num[LEFT], addRight: num[RIGHT], exploded: true}

    // otherwise, combine the results from the two children
    // try first to explode the left child
    const leftChild = explode(num[LEFT], depth + 1)

    // if it exploded, we enter propagation mode! otherwise, attempt to explode the right child as well.
    const rightChild = leftChild.exploded
        ? {...propagateExplosionRight(num[RIGHT], leftChild.addRight), addLeft: 0, exploded: true }
        : explode(num[RIGHT], depth + 1)

    // right child exploded? propagate its exploded left half to the rightmost leaf of the left child
    if (rightChild.exploded && rightChild.addLeft !== 0)
        leftChild.num = propagateExplosionLeft(leftChild.num, rightChild.addLeft)

    // combine results
    return {
        num: [leftChild.num, rightChild.num],
        addLeft: leftChild.addLeft,
        addRight: rightChild.addRight,
        exploded: leftChild.exploded || rightChild.exploded
    }
}

// perform split operation: if any regular number is 10 or greater, the leftmost such regular number splits
// returns {num, split}
//   num: the resulting number after the operation. unchanged if no splitting occurred
//   split: true if found number that is 10 or greater, false otherwise
const split = num => {
    // if it is a regular number, check whether it is too large. returns {num, split}
    // split specifies whether the number was split or not. num is the number after being split (if needed):
    //   if it is too large, replace it with a pair (left is original/2 rounded down, right is original/2 rounded up)
    //   if it is not too large, return it.
    if (isRegularNum(num)) return {
        num: num >= 10 ? [Math.floor(num/2), Math.ceil(num/2)] : num,
        split: num >= 10
    }
    // otherwise, attempt to split the left child
    const leftChild = split(num[LEFT])
    // and attempt to split the right half, unless left half was split
    const rightChild = leftChild.split ? {num: num[RIGHT]} : split(num[RIGHT])
    return {
        num: [leftChild.num, rightChild.num],
        split: leftChild.split || rightChild.split
    }
}

// reduce a number: repeatedly apply explode/split to the number until it stabilizes
const reduce = num => {
    while (true) {
        const explosion = explode(num)
        if (explosion.exploded) {
            num = explosion.num
            continue;
        }
        const splitting = split(num)
        if (splitting.split) {
            num = splitting.num
            continue;
        }
        break
    }
    return num
}

// returns the value of the largest magnitude for adding any two distinct numbers from the list in any order
const findLargestMagnitude = nums => {
    let largestMagnitude = -Infinity
    for (let i = 0; i < nums.length; i++)
        for (let j = 0; j < nums.length; j++)
            if (i !== j) largestMagnitude = Math.max(magnitude(add(nums[i], nums[j], false)), largestMagnitude)
    return largestMagnitude
}

// returns whether two numbers are equal
const numbersAreEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

// assorted asserts for convenience
const assertExplode = (num, expected) => console.assert(numbersAreEqual(explode(num).num, expected))
const assertSplit = (num, expected) => console.assert(numbersAreEqual(split(num).num, expected))
const assertAdd = (a, b, expected) => console.assert(numbersAreEqual(add(a, b), expected))
const assertMagnitude = (num, expected) => console.assert(magnitude(num) === expected)

// lots of sanity checks
assertExplode([[[[[9,8],1],2],3],4], [[[[0,9],2],3],4])
assertExplode([7,[6,[5,[4,[3,2]]]]], [7,[6,[5,[7,0]]]])
assertExplode([[6,[5,[4,[3,2]]]],1], [[6,[5,[7,0]]],3])
assertExplode([[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]], [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]])
assertExplode([[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]], [[3,[2,[8,0]]],[9,[5,[7,0]]]])
assertSplit(10, [5, 5])
assertSplit(11, [5, 6])
assertSplit(12, [6, 6])
assertExplode([[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]], [[[[0,7],4],[7,[[8,4],9]]],[1,1]])
assertExplode([[[[0,7],4],[7,[[8,4],9]]],[1,1]], [[[[0,7],4],[15,[0,13]]],[1,1]])
assertSplit([[[[0,7],4],[15,[0,13]]],[1,1]], [[[[0,7],4],[[7,8],[0,13]]],[1,1]])
assertSplit([[[[0,7],4],[[7,8],[0,13]]],[1,1]], [[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]])
assertExplode([[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]], [[[[0,7],4],[[7,8],[6,0]]],[8,1]])
assertAdd([[[[4,3],4],4],[7,[[8,4],9]]], [1, 1], [[[[0,7],4],[[7,8],[6,0]]],[8,1]])
assertAdd(
    [[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],
    [7,[[[3,7],[4,3]],[[6,3],[8,8]]]],
    [[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]])
assertAdd(
    [[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]],
    [[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]],
    [[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]])
assertMagnitude([[1,2],[[3,4],5]], 143)
assertMagnitude([[[[0,7],4],[[7,8],[6,0]]],[8,1]], 1384)
assertMagnitude([[[[1,1],[2,2]],[3,3]],[4,4]], 445)
assertMagnitude([[[[3,0],[5,3]],[4,4]],[5,5]], 791)
assertMagnitude([[[[5,0],[7,4]],[5,5]],[6,6]], 1137)
assertMagnitude([[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]], 3488)

const nums = file.split('\n').map(str => JSON.parse(str))
console.log('Part 1 =', magnitude(sum(nums)))
console.log('Part 2 =', findLargestMagnitude(nums))
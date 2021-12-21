const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const boxes = file.split('\n').map(line => line.split('x').map(Number)).map(([l, w, h]) => ({l, w, h}))

const areaSmallestSide = box => box.w * box.l * box.h / Math.max(box.w, box.l, box.h)
const surfaceArea = box => 2 * (box.l * box.w + box.w * box.h + box.h * box.l)
const wrappingPaperArea = box => surfaceArea(box) + areaSmallestSide(box)

const smallestPerimeter = box => 2 * (box.w + box.l + box.h - Math.max(box.w, box.l, box.h))
const volume = box => box.w * box.l * box.h
const ribbonLength = box => smallestPerimeter(box) + volume(box)

const sumOfWrappingPaperAreas = boxes => boxes.map(box => wrappingPaperArea(box)).reduce((a, b) => a + b, 0)
const sumOfRibbonLengths = boxes => boxes.map(box => ribbonLength(box)).reduce((a, b) => a + b, 0)

console.log('Part 1 =', sumOfWrappingPaperAreas(boxes))
console.log('Part 2 =', sumOfRibbonLengths(boxes))

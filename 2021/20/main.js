const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const DARK = '.'
const LIGHT = '#'
const DARK_PRETTY = ' '
const LIGHT_PRETTY = '█'

// get a pretty printable version of the image
const prettify = image =>
    image.map(row => row.join('').replaceAll(DARK, DARK_PRETTY).replaceAll(LIGHT, LIGHT_PRETTY)).join('\n')

// get a row of dark pixels with specified length
const emptyRow = (length) => [...Array(length)].fill(DARK)

// get several rows of dark pixels, each with the specified length
const severalEmptyRows = (amount, length) => [...Array(amount)].fill(emptyRow(length))

// expands a row of pixels from the image by adding some amount of dark pixels both to its left and right
const expandRow = (row, amount) => [...DARK.repeat(amount), ...row, ...DARK.repeat(amount)]

// expand visible image N pixels in every direction, adding dark pixels around it
const expandImageDimensions = (image, amount = 1) => [
    ...severalEmptyRows(amount, image[0].length + 2 * amount),
    ...image.map(row => expandRow(row, amount)),
    ...severalEmptyRows(amount, image[0].length + 2 * amount),
]

// get the coordinates for every pixel on the 3x3 region centered on the given coordinates
const adjacentCoordinates = (row, col) =>
    [-1, 0, 1].map(rowOffset => [-1, 0, 1].map(colOffset => ({row: row + rowOffset, col: col + colOffset}))).flat()

// check whether the given coordinates are within the bounds of the visible image
const isWithinBounds = (image, row, col) => row >= 0 && row < image.length && col >= 0 && col < image[row].length

// get the pixels on the 3x3 region centered on the given coordinates
// in case the pixel is out-of-bounds of the visible image, return the vacuum 'fill'
const pixelMask = (image, row, col, fill) =>
    adjacentCoordinates(row, col).map(({row, col}) =>
        isWithinBounds(image, row, col) ? image[row][col] : fill)

// given an array of pixels, return its decimal value
const pixelsToDecimal = pixels =>
    parseInt(pixels.join('').replaceAll(DARK, '0').replaceAll(LIGHT, '1'), 2)

// returns the enhanced pixel value at a given position
const enhancePixel = (image, enhancement, row, col, fill) =>
    enhancement[pixelsToDecimal(pixelMask(image, row, col, fill))]

// applies one pass of the enhancement algorithm to the image
const enhanceImageOnce = (image, enhancement, fill) =>
    expandImageDimensions(image).map((r, row) => r.map((_, col) =>
        enhancePixel(image, enhancement, row - 1, col - 1, fill)))

// compute the color of pixels that are out of bounds of the image
const outOfBoundsFill = (enhancement, numTimesEnhanced) => numTimesEnhanced % 2 === 0 ? '.' : enhancement[0]

// apply the enhancement algorithm a given number of times to the input image
const enhanceImageMultipleTimes = (image, enhancement, numTimes) =>
    [...Array(numTimes).keys()].reduce(
        (image, numTime) =>
            enhanceImageOnce(image, enhancement, outOfBoundsFill(enhancement, numTime))
        , image)

// returns the amount of lit pixels in an image
const countLitPixels = image => image.map(row => row.filter(px => px === LIGHT).length).reduce((a, b) => a + b, 0)


// parse input and return a list of scanner objects
const [enhancementStr, imageStr] = file.split('\n\n')
const enhancement = enhancementStr.split('\n').join('')
const image = imageStr.split('\n').map(row => row.split(''))

//console.log(prettify(image))
console.log('Part 1 =', countLitPixels(enhanceImageMultipleTimes(image, enhancement, 2)))
console.log('Part 1 =', countLitPixels(enhanceImageMultipleTimes(image, enhancement, 50)))

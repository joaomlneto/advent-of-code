const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// parse input file
const lines = file.split('\n').filter(x => x)

// print filesystem tree
const tree = (node, depth = 0) => {
    const indent = '  '.repeat(depth)
    console.log(indent + "- " + node.name, '(' + node.type + (node.size ? ', size=' + node.size : '') +')')
    if (node.files) {
        for (const file of Object.values(node.files)) {
            tree(file, depth + 1)
        }
    }
}

// create root node
const root = {
    name: '/',
    type: 'dir',
    files: {},
    size: undefined,
    parent: undefined
}
// point to root node
let current = root

// parse console output and populate filesystem tree
for (const line of lines) {
    const tokens = line.split(' ')
    if (tokens[0] === '$') {
        if (tokens[1] === 'cd') {
            if (tokens[2] === '/') {
                current = root
            } else if (tokens[2] === '..') {
                current = current.parent
            } else {
                current = current.files[tokens[2]]
            }
        }
    } else {
        if (tokens[0] === 'dir') {
            current.files[tokens[1]] = {
                name: tokens[1],
                type: 'dir',
                files: {},
                size: undefined,
                parent: current
            }
        } else {
            current.files[tokens[1]] = {
                name: tokens[1],
                type: 'file',
                size: Number(tokens[0]),
                parent: current
            }
        }
    }
}

// compute directory sizes, starting at the root
const computeDirectorySizes = node =>
    node.type === 'file'
        ? node.size
        : node.size = Object.values(node.files).reduce((acc, file) => acc + computeDirectorySizes(file), 0)

computeDirectorySizes(root)

// compute list of nodes (flatten filesystem tree)
const listNodes = node => node.type === 'file' ? [node] : [node, ...Object.values(node.files).flatMap(listNodes)]
const nodes = listNodes(root)

console.log('Part 1:', nodes
    .filter(({type, size}) => type === 'dir' && size < 100000)
    .reduce((acc, {size}) => acc + size, 0))

const SPACE_TO_FREE = 30000000 + root.size - 70000000

console.log('Part 2:', nodes
    .filter(({type, size}) => type === 'dir' && size >= SPACE_TO_FREE)
    .sort((a, b) => a.size - b.size)[0].size)

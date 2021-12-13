const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// get list of edges from input in the format [{from, to}]
const edges = file.split('\n').map(edgeStr => edgeStr.split('-')).map(([from, to]) => ({from, to}))

// special edges
const SOURCE = 'start'
const DESTINATION = 'end'

// given list of edges, returns the list of all cave names found in the list
const getCaveNames = (edges) => [...new Set(edges.map(edge => [edge.from, edge.to]).flat())]

// build adjacency list from list of edges
const buildAdjacencyList = (paths) => {
    const adjacentCaves = {}
    getCaveNames(paths).forEach(cave => adjacentCaves[cave] = [])
    paths.forEach(edge => adjacentCaves[edge.from].push(edge.to))
    paths.forEach(edge => adjacentCaves[edge.to].push(edge.from))
    return adjacentCaves
}

// checks whether cave is small or not
const isSmallCave = (name) => name == name.toLowerCase()

const hasSmallCaveBeenVisitedTwice = (visited) =>
    Object.keys(visited).some(cave => isSmallCave(cave) && visited[cave] > 1)

// part 1: cannot visit a small cave if it has been visited before
const nextCaveFilterPart1 = (cave, visited) => !(isSmallCave(cave) && visited[cave] > 0)

// part 2: allow one small cave to be visited twice; other small caves to be visited once
const nextCaveFilterPart2 = (cave, visited) =>
    hasSmallCaveBeenVisitedTwice(visited)
        ? nextCaveFilterPart1(cave, visited)
        : !(isSmallCave(cave) && (cave == SOURCE || visited[cave] > 1))

const findPathsAux = (adjacencyList, nextCaveFilter, currentCave = SOURCE, visited = {}) => {
    // are we there yet?
    if (currentCave === DESTINATION) return [[DESTINATION]]
    // mark current cave as visited
    visited = {...visited}
    visited[currentCave]++
    // check which caves can be visited next
    const availablePaths = adjacencyList[currentCave].filter(cave => nextCaveFilter(cave, visited))
    // return all the possible paths from those caves
    return availablePaths.map(nextCave =>
        findPathsAux(adjacencyList, nextCaveFilter, nextCave, visited)
    ).flat().map(path => [currentCave, ...path])
}

const findPaths = (edges, nextCaveFilter) => {
    const adjList = buildAdjacencyList(edges)
    const visitedMap = getCaveNames(edges).reduce((visited, cave) => (visited[cave] = 0, visited), {})
    return findPathsAux(adjList, nextCaveFilter, SOURCE, visitedMap)
}

console.log('Part 1 =', findPaths(edges, nextCaveFilterPart1).length)
console.log('Part 2 =', findPaths(edges, nextCaveFilterPart2).length)

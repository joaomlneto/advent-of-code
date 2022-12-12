const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

// parse input file
const map = file
    .split("\n")
    .filter((x) => x)
    .map((line) => line.split(""));

// get position of markers in the map
const find2d = (map, thing) => {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === thing) {
                return { row, col };
            }
        }
    }
};

// return the key for a vertex
const vertexKey = ({ row, col }) => `${row},${col}`;

// return a list of all the neighbor keys for a given vertex
const neighborKeys = ({ row, col }) =>
    [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 },
    ].map(vertexKey);

// dijkstra's algorithm, slightly modified:
// (1) swap start and end vertices: this causes the 'dist' object to contain the shortest path from the end to all
//     possible starts
// (2) only consider neighbors that are at least one lower (inverted neighbor condition from the original)
const dijkstra = (vertices, end, start) => {
    const dist = {};
    const prev = {};
    const Q = Object.keys(vertices);
    Object.keys(vertices).forEach((key) => {
        dist[key] = Infinity;
        prev[key] = null;
    });

    dist[start] = 0;
    while (Q.length > 0) {
        // find vertex in Q with minimum dist and remove it from Q
        const u = Q.sort((a, b) => dist[a] - dist[b]).shift();
        if (u === end) break;

        // for each neighbor v of u still in Q:
        vertices[u].neighbors
            .filter((v) => Q.includes(v)) // only include those in Q
            .filter((v) => vertices[u].height <= vertices[v].height + 1) // only include those at least one lower
            .forEach((v) => {
                const alt = dist[u] + 1;
                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                }
            });
    }

    return dist;
};

// find position of start and end markers in the map
const start = find2d(map, "S");
const end = find2d(map, "E");

// replace markers with their implicit elevation
map[start.row][start.col] = "a";
map[end.row][end.col] = "z";

// build a list of all vertices and useful annotations such as unique key, numeric height, and set of neighbors
const vertexList = map
    .map((r, row) =>
        r.map((_, col) => ({
            key: vertexKey({ row, col }), // unique key for this vertex
            height: map[row][col].charCodeAt(0) - "a".charCodeAt(0), // normalize 'a' to 'z' => 0 to 25
            neighbors: neighborKeys({ row, col }), // keys of neighboring vertices
        }))
    )
    .flat();

// build a vertex index for easy lookup
const vertices = {};
vertexList.forEach((v) => (vertices[v.key] = v));

const dist = dijkstra(vertices, vertexKey(start), vertexKey(end));

console.log("Part 1:", dist[vertexKey(start)]);

console.log(
    "Part 2:",
    Math.min(
        ...Object.values(vertices)
            .filter(({ height }) => height === 0) // only include vertices at minimum height of 'a'
            .map(({ key }) => dist[key]) // get the distance to the target location
    )
);

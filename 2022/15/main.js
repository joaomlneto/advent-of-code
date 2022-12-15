const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

const manhattanDistance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

// parse input file
const sensors = file
  .trim()
  .split("\n")
  .map((line) => line.split(" "))
  .map((lineTokens) => ({
    x: parseInt(lineTokens[2].split("=")[1]),
    y: parseInt(lineTokens[3].split("=")[1]),
    closestBeaconPosition: {
      x: parseInt(lineTokens[8].split("=")[1]),
      y: parseInt(lineTokens[9].split("=")[1]),
    },
  }))
  .map((sensor) => ({
    ...sensor,
    distanceToClosestBeacon: manhattanDistance(
      sensor,
      sensor.closestBeaconPosition
    ),
  }));

const beacons = sensors
  .map((sensor) => sensor.closestBeaconPosition)
  .filter(
    (beacon, index, self) =>
      self.findIndex((b) => b.x === beacon.x && b.y === beacon.y) === index
  );

// compute the bounding box
const boundingBox = sensors.reduce(
  (acc, { x, y, distanceToClosestBeacon }) => ({
    xMin: Math.min(acc.xMin, x - distanceToClosestBeacon),
    xMax: Math.max(acc.xMax, x + distanceToClosestBeacon),
    yMin: Math.min(acc.yMin, y - distanceToClosestBeacon),
    yMax: Math.max(acc.yMax, y + distanceToClosestBeacon),
  }),
  { xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity }
);

const isInSensorRange = (sensor, { x, y }) =>
  manhattanDistance(sensor, { x, y }) <= sensor.distanceToClosestBeacon;

const y = filename === "sample.txt" ? 10 : 2000000;

console.log(
  "Part 1:",
  // Create array of all possible x values reachable by sensors range
  // return its length
  Array.from({ length: boundingBox.xMax - boundingBox.xMin }, (_, i) => ({
    x: i + boundingBox.xMin,
    y,
  }))
    // Filter those that are in range of a sensor and are not beacons
    .filter(
      ({ x, y }) =>
        beacons.every((beacon) => !(beacon.x === x && beacon.y === y)) &&
        sensors.some((sensor) => isInSensorRange(sensor, { x, y }))
    ).length // and count them
);

const distressBeaconArea =
  filename === "sample.txt"
    ? {
        xMin: 0,
        xMax: 20,
        yMin: 0,
        yMax: 20,
      }
    : {
        xMin: 0,
        xMax: 4000000,
        yMin: 0,
        yMax: 4000000,
      };

const diagonalDirections = [
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
];

const withinBoundingBox = ({ x, y }, { xMin, xMax, yMin, yMax }) =>
  x >= xMin && x <= xMax && y >= yMin && y <= yMax;

const sensorBoundingBox = (sensor) => {
  let positions = [];
  for (const direction of diagonalDirections) {
    for (let i = 0; i <= sensor.distanceToClosestBeacon + 1; i++) {
      const pos = {
        x: sensor.x + direction.x * i,
        y: sensor.y + direction.y * (sensor.distanceToClosestBeacon - i + 1),
      };
      if (withinBoundingBox(pos, distressBeaconArea)) positions.push(pos);
    }
  }
  return positions;
};

// Compute all bounding boxes - takes a long time (20 seconds)!
// This is the current performance bottleneck
const boundingBoxPositions = sensors.flatMap(sensorBoundingBox);

// find the position that is out of range of every sensor
const distressBeaconPosition = boundingBoxPositions.find((p) =>
  sensors.every((sensor) => !isInSensorRange(sensor, p))
);

console.log(
  "Part 2:",
  distressBeaconPosition.x * 4000000 + distressBeaconPosition.y
);

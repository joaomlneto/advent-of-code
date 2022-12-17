const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

// parse input file into a list of valves
const valveList = file
  .trim()
  .split("\n")
  .map((line) => line.split(" "))
  .map((tokens) => ({
    name: tokens[1],
    flowRate: parseInt(tokens[4].split("=")[1]),
    edges: tokens.slice(9).map((name) => name.replace(",", "")),
  }));

// index valves by name
const valves = {};
valveList.forEach((valve) => {
  valves[valve.name] = valve;
});

// preprocessing: compute the distance between all pairs of valves with the floyd warshall algorithm
const floydWarshall = (valves) => {
  // let dist be a |V| × |V| array of minimum distances initialized to ∞ (infinity)
  const dist = {};
  for (const v in valves) {
    dist[v] = {};
    for (const w in valves) {
      dist[v][w] = Infinity;
    }
    // for each edge (v, u) do dist[v][u] ← w(v, u)
    for (const u of valves[v].edges) {
      dist[v][u] = 1;
    }
    // for each vertex v do dist[v][v] <-- 0
    dist[v][v] = 0;
  }

  for (const k in valves) {
    for (const i in valves) {
      for (const j in valves) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  for (const v in valves) {
    valves[v].distance = dist[v];
  }

  return dist;
};

floydWarshall(valves);

const valveComparatorDescending = (a, b) =>
  valves[b].flowRate - valves[a].flowRate;

// compute the set of valves that do something
const candidateValveNames = (valves) =>
  new Set(
    Object.keys(valves)
      .filter((valve) => valves[valve].flowRate > 0)
      .sort(valveComparatorDescending)
  );

const heuristic = (agents, candidateValves) =>
  [...candidateValves]
    .sort(valveComparatorDescending)
    .reduce(
      (acc, valve, valveIndex) =>
        acc +
        valves[valve].flowRate *
          Math.max(
            0,
            ...Object.values(agents).map(
              (agent) =>
                agent.timeLeft -
                valves[agent.currentValve].distance[valve] -
                valveIndex * 2
            )
          ),
      0
    );

const findMaxPressureRelease = (
  valves,
  agents,
  bestAlternative = 0,
  candidateValves = candidateValveNames(valves)
) => {
  // check if there is an alternative that is better than the current one
  if (bestAlternative >= heuristic(agents, candidateValves)) return 0;

  let best = 0;

  // consider sending one of the agents to one of the remaining open valves
  for (let agent of Object.keys(agents)) {
    for (let valve of [...candidateValves]) {
      // check how much time it takes the agent to reach the valve and open it
      const timeCost = valves[agents[agent].currentValve].distance[valve] + 1;

      // check if agent has enough time to go and open this valve: if not, skip
      if (timeCost > agents[agent].timeLeft) continue;

      // compute how much pressure is released by opening this valve until the volcano erupts
      const pressure =
        valves[valve].flowRate * (agents[agent].timeLeft - timeCost);

      // recursion: check what would happen if we choose this valve...
      const prevAgentValve = agents[agent].currentValve;
      candidateValves.delete(valve);
      agents[agent].timeLeft -= timeCost;
      agents[agent].currentValve = valve;
      const totalPressureReleased =
        pressure +
        findMaxPressureRelease(
          valves,
          agents,
          best - pressure,
          candidateValves
        );
      candidateValves.add(valve);
      agents[agent].timeLeft += timeCost;
      agents[agent].currentValve = prevAgentValve;

      // check if this is the best solution so far
      if (totalPressureReleased > best) best = totalPressureReleased;
    }
  }

  return best;
};

const agentsPartOne = {
  You: {
    timeLeft: 30,
    currentValve: "AA",
  },
};
const agentsPartTwo = {
  You: {
    timeLeft: 26,
    currentValve: "AA",
  },
  Elephant: {
    timeLeft: 26,
    currentValve: "AA",
  },
};

console.log("Part 1:", findMaxPressureRelease(valves, agentsPartOne, 1));
console.log("Part 2:", findMaxPressureRelease(valves, agentsPartTwo, 3));

const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

// Print log messages during search, but only for the topmost N levels
const MAX_LOG_DEPTH = 0;
// Benchmark code sections
const RUN_BENCHMARKS = false;

const benchmark = (fn, name) => {
  if (RUN_BENCHMARKS) console.time(name);
  fn();
  if (RUN_BENCHMARKS) console.timeEnd(name);
};

const Resource = {
  Ore: "ore",
  Clay: "clay",
  Obsidian: "obsidian",
  Geode: "geode",
};

const blueprints = file
  .trim()
  .split("\n")
  .map((line) => line.split(":"))
  .map(([name, robotsStr]) => [
    Number(name.split(" ")[1]),
    robotsStr.split(". ").map((s) => s.trim()),
  ])
  .map(([id, robots]) => ({
    id,
    robots: {
      [Resource.Ore]: {
        [Resource.Ore]: Number(robots[0].split(" ")[4]),
      },
      [Resource.Clay]: {
        [Resource.Ore]: Number(robots[1].split(" ")[4]),
      },
      [Resource.Obsidian]: {
        [Resource.Ore]: Number(robots[2].split(" ")[4]),
        [Resource.Clay]: Number(robots[2].split(" ")[7]),
      },
      [Resource.Geode]: {
        [Resource.Ore]: Number(robots[3].split(" ")[4]),
        [Resource.Obsidian]: Number(robots[3].split(" ")[7]),
      },
    },
  }));

const makeSimulation = (blueprint, timeRemaining) => ({
  blueprint,
  timeRemaining,
  actions: [],
  resources: {
    [Resource.Ore]: 0,
    [Resource.Clay]: 0,
    [Resource.Obsidian]: 0,
    [Resource.Geode]: 0,
  },
  robots: {
    [Resource.Ore]: 1,
    [Resource.Clay]: 0,
    [Resource.Obsidian]: 0,
    [Resource.Geode]: 0,
  },
  best: {
    actions: [],
    numGeodes: 0,
  },
});

const forkSimulation = (simulation) => ({
  blueprint: simulation.blueprint,
  timeRemaining: simulation.timeRemaining,
  actions: [...simulation.actions],
  resources: { ...simulation.resources },
  robots: { ...simulation.robots },
  best: { ...simulation.best },
});

const collectResources = ({ resources, robots }, minutes) =>
  Object.keys(resources).forEach(
    (resource) => (resources[resource] += robots[resource] * minutes)
  );

const buildRobot = (simulation, robot, quantity = 1) => {
  if (!robot) return;
  Object.keys(simulation.blueprint.robots[robot]).forEach((resource) => {
    simulation.resources[resource] -=
      simulation.blueprint.robots[robot][resource] * quantity;
  });
  simulation.robots[robot] += quantity;
};

const destroyRobot = (simulation, robot) => buildRobot(simulation, robot, -1);

const applyAction = (simulation, action) => {
  const { robot, minutes } = action;
  collectResources(simulation, minutes);
  simulation.timeRemaining -= minutes;
  buildRobot(simulation, robot);
  simulation.actions.push({ robot, minutes });
};

const undoLastAction = (simulation) => {
  const { robot, minutes } = simulation.actions.pop();
  destroyRobot(simulation, robot);
  simulation.timeRemaining += minutes;
  collectResources(simulation, -minutes);
};

// check how many minutes it will take to get a certain quantity of a given resource
const timeToCollectResource = ({ resources, robots }, resource, quantity) =>
  Math.max(Math.ceil((quantity - resources[resource]) / robots[resource]), 0);

// check whether the given robot can be built next (i.e. we are able to collect resources for it)
const canBuildRobotNext = (simulation, robot) =>
  Object.keys(simulation.blueprint.robots[robot]).every(
    (resource) => simulation.robots[resource] > 0
  );

// get the number of minutes it will take to collect the resources needed to build a robot
const minutesToCollect = (simulation, robot) =>
  canBuildRobotNext(simulation, robot)
    ? Math.max(
        ...Object.keys(simulation.blueprint.robots[robot]).map((resource) =>
          timeToCollectResource(
            simulation,
            resource,
            simulation.blueprint.robots[robot][resource]
          )
        )
      )
    : Infinity;

// get the set of available actions at a given point in the simulation
const getAvailableActions = (simulation) =>
  [Resource.Geode, Resource.Obsidian, Resource.Clay, Resource.Ore] // be greedy and try to build geodes first
    .map((robot) => ({
      robot,
      minutes: minutesToCollect(simulation, robot) + 1, // time to collect plus 1 minute to build
    }))
    .filter(({ minutes }) => minutes <= simulation.timeRemaining);

// get the number of geodes opened in the simulation assuming no more robots are built
const numGeodesOpened = (simulation) =>
  simulation.resources[Resource.Geode] +
  simulation.timeRemaining * simulation.robots[Resource.Geode];

// Heuristic v1: be the most optimistic and assume we can build all the robots we need... how many geodes can we get?
const mostOptimisticUpperBound = ({ resources, timeRemaining, robots }) =>
  resources[Resource.Geode] +
  timeRemaining * (robots[Resource.Geode] + (timeRemaining - 1) / 2);

// Heuristic v2: compute what is the maximum of a certain kind of robot that is buildable
// Lets consider we can try building all robot kinds in parallel
const maxPossibleGeodes = (simulation) => {
  const optimisticSim = forkSimulation(simulation);

  for (let timeLeft = optimisticSim.timeRemaining; timeLeft > 0; timeLeft--) {
    // check ore
    collectResources(optimisticSim, 1);
    Object.keys(optimisticSim.robots).forEach((robot) => {
      if (
        Object.keys(optimisticSim.blueprint.robots[robot]).every(
          (resource) =>
            optimisticSim.resources[resource] -
              simulation.blueprint.robots[robot][resource] *
                (optimisticSim.robots[robot] - simulation.robots[robot]) >=
            optimisticSim.blueprint.robots[robot][resource]
        )
      ) {
        optimisticSim.robots[robot]++;
      }
    });
  }
  return optimisticSim.resources[Resource.Geode];
};

const searchLargestNumberOfGeodes = (
  simulation,
  maxLogDepth = MAX_LOG_DEPTH
) => {
  const log = (...args) =>
    simulation.actions.length < maxLogDepth &&
    console.log("    ".repeat(simulation.actions.length) + "-", ...args);

  // check if we have any chances of succeeding at finding more geodes than the current best
  if (maxPossibleGeodes(simulation) < simulation.best.numGeodes) {
    return;
  }

  // check what are the available actions from here...
  const availableActions = getAvailableActions(simulation);

  log(
    simulation.actions.at(-1) ?? "Blueprint " + simulation.blueprint.id,
    simulation.timeRemaining,
    "min remaining",
    "possible actions:",
    JSON.stringify(availableActions)
  );

  if (availableActions.length === 0) {
    // if there are no more actions, we are done with this simulation
    const numGeodes = numGeodesOpened(simulation);
    log("done, found", numGeodes, "geodes");
    if (numGeodes > simulation.best.numGeodes) {
      log("new best:", numGeodes);
      simulation.best = {
        actions: simulation.actions.slice(),
        numGeodes,
      };
    }
  }

  // ...and pick the one that gives the highest quality level
  availableActions.forEach((action) => {
    applyAction(simulation, action);
    searchLargestNumberOfGeodes(simulation, maxLogDepth);
    undoLastAction(simulation);
  });
};

const blueprintMaxGeodes = (blueprint, time) => {
  const sim = makeSimulation(blueprint, time);
  benchmark(
    () => searchLargestNumberOfGeodes(sim),
    "Blueprint " + blueprint.id + " time " + time
  );
  return sim.best.numGeodes;
};

const blueprintQualityLevel = (blueprint, time) =>
  blueprintMaxGeodes(blueprint, time) * blueprint.id;

benchmark(
  () =>
    console.log(
      "Part 1:",
      blueprints.reduce(
        (sum, blueprint) => sum + blueprintQualityLevel(blueprint, 24),
        0
      )
    ),
  "Part 1"
);

benchmark(
  () =>
    console.log(
      "Part 2:",
      blueprints
        .slice(0, 3)
        .reduce(
          (product, blueprint) => product * blueprintMaxGeodes(blueprint, 32),
          1
        )
    ),
  "Part 2"
);

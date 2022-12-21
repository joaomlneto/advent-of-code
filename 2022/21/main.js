const fs = require("fs");

const filename = "input.txt";
const file = fs.readFileSync(filename).toString("utf8");
console.log("filename:", filename);

const ROOT = "root";
const HUMN = "humn";

// create an index of monkeys by name
const monkeys = file
  .trim()
  .split("\n")
  .map((line) => line.split(": "))
  .map(([name, operation]) => ({ name, operation: operation.split(" ") }))
  .map((monkey) => ({
    name: monkey.name,
    ...(monkey.operation.length === 1
      ? { value: Number(monkey.operation[0]) }
      : {
          left: monkey.operation[0],
          operator: monkey.operation[1],
          right: monkey.operation[2],
        }),
  }))
  .reduce((acc, monkey) => ({ ...acc, [monkey.name]: monkey }), {});

// create references to the actual monkey objects, rather than just their names
for (const monkey of Object.values(monkeys)) {
  if (monkey.left) monkey.left = monkeys[monkey.left];
  if (monkey.right) monkey.right = monkeys[monkey.right];
}

// solve for the result of the operation
const evaluate = (left, op, right) =>
  ({
    "+": left + right,
    "-": left - right,
    "*": left * right,
    "/": left / right,
  }[op]);

// if we know the result of the operation and the right operand, solve for the left operand
const solveForLeft = (op, right, result) =>
  ({
    "+": result - right,
    "-": result + right,
    "*": result / right,
    "/": result * right,
  }[op]);

// if we know the result of the operation and the left operand, solve for the right operand
const solveForRight = (op, left, result) =>
  ({
    "+": result - left,
    "-": left - result,
    "*": result / left,
    "/": left / result,
  }[op]);

// get the number yelled by a given monkey by traversing the tree post-order
const monkeyNumber = (monkey) =>
  (monkey.result =
    monkey.value ??
    evaluate(
      monkeyNumber(monkey.left),
      monkey.operator,
      monkeyNumber(monkey.right)
    ));

// check whether a given subtree contains the human, and if so, leave a flag
const annotateSubtreesContainingHumn = (monkey) =>
  (monkey.hasHumn =
    monkey.name === HUMN ||
    (!Object.hasOwn(monkey, "value") &&
      (annotateSubtreesContainingHumn(monkey.left) ||
        annotateSubtreesContainingHumn(monkey.right))));

// find which of the two monkey dependency subtrees contains the human
const humanSubtree = (monkey) =>
  monkey.left.hasHumn ? monkey.left : monkey.right;

// find which of the two monkey dependency subtrees contains no human
const nonHumanSubtree = (monkey) =>
  monkey.left.hasHumn ? monkey.right : monkey.left;

// solve the operation backwards and return the value of the missing operand
const solveForMissingOperand = (monkey, targetResult) =>
  (monkey.left.hasHumn ? solveForLeft : solveForRight)(
    monkey.operator,
    nonHumanSubtree(monkey).result,
    targetResult
  );

// solve for human value in a given subtree
const findHumanNumber = (monkey, targetResult) =>
  monkey.name === HUMN
    ? targetResult
    : findHumanNumber(
        humanSubtree(monkey),
        solveForMissingOperand(monkey, targetResult)
      );

// solve for the human value, starting at the root
const findHumanNumberFromRoot = (rootMonkey) =>
  findHumanNumber(humanSubtree(rootMonkey), nonHumanSubtree(rootMonkey).result);

console.log("Part 1:", monkeyNumber(monkeys[ROOT]));
annotateSubtreesContainingHumn(monkeys[ROOT]);
console.log("Part 2:", findHumanNumberFromRoot(monkeys[ROOT]));

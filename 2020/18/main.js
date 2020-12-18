const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

// splits the string into a sequence of tokens
function getTokensFromString(expressionString) {
  return expressionString
    .replace(/\(/g, '( ')
    .replace(/\)/g, ' )')
    .split(' ')
    .map(token => isNaN(token) ? token : Number(token))
}

// finds the list of tokens composing an operand at the start of the string
function findOperand(tokens) {
  let i = 0;
  let depth = 0;
  do {
    switch(tokens[i++]) {
      case '(': depth++; break;
      case ')': depth--; break;
    }
  } while (depth > 0)
  return tokens.slice(0, i)
}

// this will return the list of top-level operations in the sequence of tokens.
// for example, for "a + b * c + d" it will return {
//   operands: [a, b, c, d]
//   operators: ['+', '*', '+']
// }
function getListOfOperations(tokens, associativityFunction) {
  let operands = []
  let operators = []
  while (tokens.length > 0) {
    const operand = findOperand(tokens)
    const operandLength = Number.isInteger(operand) ? 1 : operand.length
    const operator = tokens[operandLength]
    operands.push(buildAST(operand, associativityFunction))
    if (operator) operators.push(operator)
    tokens = tokens.slice(operandLength + 1)
  }
  return {operands, operators}
}

// build the abstract syntax tree for the tokens, given an associativityFunction
// The associativityFunction is a function that receives a list of operations
// and returns the syntax tree corresponding to its evaluation of those operations
// For part 1, we simply apply the operations in the order they appear.
// For part 2, we apply additions before multiplications.
function buildAST(tokens, associativityFunction) {
  // check if it's a leaf node
  if (tokens.length === 1) return tokens[0]

  // check if it's a parenthesis wrapped expression/operand
  if (tokens[0] === '(' && findOperand(tokens).length === tokens.length) {
    return buildAST(tokens.slice(1, -1), associativityFunction)
  }

  // if its none of the above, it must be a chain of same-level expressions
  const {operands, operators} = getListOfOperations(tokens, associativityFunction)
  return associativityFunction({operands, operators})
}

// given a node of the abstract syntax tree, compute its value
function evaluateAST(node) {
  // check if it is a leaf node
  if (Number.isInteger(node)) return node

  // otherwise it must be a complex operation node
  switch(node.op) {
    case '+': return evaluateAST(node.left) + evaluateAST(node.right)
    case '*': return evaluateAST(node.left) * evaluateAST(node.right)
  }
}

// given the string representation of an expression, compute its result
function evaluateExpressionString(expressionString, associativityFunction) {
  const tokens = getTokensFromString(expressionString)
  const ast = buildAST(tokens, associativityFunction)
  const result = evaluateAST(ast)
  return result
}

// Associativity Function: Apply operations in order (Part 1)
function associateOperationsInOrder({operands, operators}) {
  node = operands[0]
  for (let i = 0; i < operators.length; i++) {
    node = {
      left: node,
      op: operators[i],
      right: operands[i+1],
    }
  }
  return node
}

// Associativity Function: Apply additions before multiplications (Part 2)
function associateOperationsWithPrecedence({operands, operators}) {
  const LOWER_PRECEDENCE_OPERATOR = '*'
  const index = operators.indexOf(LOWER_PRECEDENCE_OPERATOR)

  // if there are multiplications, make them be resolved after the additions
  if (index !== -1) {
    return {
      left: associateOperationsWithPrecedence({
        operands: operands.slice(0, index + 1),
        operators: operators.slice(0, index),
      }),
      op: '*',
      right: associateOperationsWithPrecedence({
        operands: operands.slice(index + 1),
        operators: operators.slice(index + 1),
      }),
    }
  }

  // if there are no multiplications, just apply the operations in order
  return associateOperationsInOrder({operands, operators})
}



const expressions = file
  .split('\n')
  .filter(line => line.length > 0)

console.log('Part 1 =', expressions
  .map(expr => evaluateExpressionString(expr, associateOperationsInOrder))
  .reduce((a, b) => a + b, 0))

console.log('Part 2 =', expressions
  .map(expr => evaluateExpressionString(expr, associateOperationsWithPrecedence))
  .reduce((a, b) => a + b, 0))

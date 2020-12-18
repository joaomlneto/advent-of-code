const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const expressions = file
  .split('\n')
  .filter(line => line.length > 0)

function getTokensFromString(expressionString) {
  return expressionString
    .replace(/\(/g, '( ')
    .replace(/\)/g, ' )')
    .split(' ')
    .map(token => isNaN(token) ? token : Number(token))
}

function findOperand(expr) {
  let i = 0;
  let depth = 0;
  do {
    switch(expr[i++]) {
      case '(': depth++; break;
      case ')': depth--; break;
    }
  } while (depth > 0)
  return /*(i === 1) ? expr[0] :*/ expr.slice(0, i)
}

function leftAssociateOperations({operands, operators}) {
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

function buildAST(tokens) {
  // check if it's a leaf node
  if (Number.isInteger(tokens)) return tokens
  if (tokens.length === 1) return tokens[0]

  // check if it's a parenthesis wrapped expression
  if (findOperand(tokens).length === tokens.length) {
    console.log('this is tough!')
    //if (tokens[0] == '(' && tokens[tokens.length - 1] == ')')
    return buildAST(tokens.slice(1, -1))
  }

  // if its none of the above, it must be a chain of same-level expressions
  let operands = []
  let operators = []
  console.log('COMPLEX EXPRESSION:', tokens.join(''))
  while (tokens.length > 0) {
    const operand = findOperand(tokens)
    const operandLength = Number.isInteger(operand) ? 1 : operand.length
    const operator = tokens[operandLength]
    operands.push(buildAST(operand))
    if (operator) operators.push(operator)
    tokens = tokens.slice(operandLength + 1)
  }
  return leftAssociateOperations({operands, operators})
}

function evaluateAST(node) {
  // check if it is a leaf node
  if (Number.isInteger(node)) return node

  // otherwise it must be a complex operation node
  switch(node.op) {
    case '+': return evaluateAST(node.left) + evaluateAST(node.right)
    case '*': return evaluateAST(node.left) * evaluateAST(node.right)
  }
}

function evaluateExpressionString(expressionString) {
  const tokens = getTokensFromString(expressionString)
    console.log('evaluating', tokens.join(''))
  const ast = buildAST(tokens)
  const result = evaluateAST(ast)
  return result
}

const expr = "((6 * 3 + 2 + 6) * 7 + 7 * 5 + 3 * 4) + ((5 * 6 * 7 + 9 * 2) * 6 + (2 * 7))"
console.log('\nEXPRESSION:', expr)

const tokens = getTokensFromString(expr)
console.log('\nTOKENS:', tokens)

const ast = buildAST(tokens)
console.log("\n" + JSON.stringify(ast, null, 4))

const result = evaluateAST(ast)
console.log('\nRESULT =', result)



console.log('Part 1 =', expressions
  .map(expr => evaluateExpressionString(expr))
  .reduce((a, b) => a + b, 0))

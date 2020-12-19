const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)



// Parse input
const input = file
  .split('\n\n')

// Parse rules
const rulesObj = input[0]
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => ({
    id: line.split(': ')[0],
    match: line.split(': ')[1].split(' | ')
      .map(r => r.split(' ')
        .map(x => isNaN(x) ? x.replace(/\"/g, '') : Number(x))),
  }))
let rules = []
Object.entries(rulesObj).forEach(([i, r]) => rules[r.id] = r.match)

// Parse messages
const messages = input[1].split('\n').filter(msg => msg.length > 0)

// uncomment for debug information during analysis
function log(depth, ...msgs) {
  //console.log(" |  ".repeat(depth), ...msgs)
}

// checks if the 'message' matches the subrule
function checkAgainstSubrule(rules, message, pattern, depth = 0) {
  log(depth, 'SUBRULE', pattern, " => ", message)
  let unmatched = [message]
  for (const item of pattern) {
    if (Number.isInteger(item)) {
      unmatched = unmatched
        .map(message => checkAgainstRule(rules, message, item, depth + 1).unmatched)
        .flat()
    } else {
      unmatched = unmatched
        .filter(message => message[0] === item)
        .map(message => message.slice(1))
    }
    log(depth, 'unmatched is now', unmatched)
    if (unmatched.length === 0) {
      log(depth, '😔Didnt match')
      break
    }
  }
  const matched = unmatched.map(str => message.slice(0, message.length - str.length))

  log(depth, 'matched', matched)
  log(depth, 'unmatched', unmatched)
  return {matched, unmatched}
}

// checks if the 'message' matches any of the subrules
function checkAgainstRule(rules, message, ruleId, depth = 0) {
  log(depth, 'RULE', ruleId, ':', rules[ruleId], "=>", message)
  let unmatched = []
  for (const subrule of rules[ruleId]) {
    const subPossibilities = checkAgainstSubrule(rules, message, subrule, depth + 1)
    unmatched = [...unmatched, ...subPossibilities.unmatched]
  }
  const matched = unmatched.map(str => message.slice(0, message.length - str.length))

  log(depth, 'matched', matched)
  log(depth, 'unmatched', unmatched)
  return {matched, unmatched}
}

// checks if a message completely matches rule zero in a given list of rules
function checkMessage(rules, message) {
  const {matched, unmatched} = checkAgainstRule(rules, message, 0)
  return (
    matched.length > 0 &&
    matched[0] === message &&
    unmatched[0].length === 0
  )
}

// patch the rules (part 2)
function patchRules(rules) {
  rules[8] = [[42], [42, 8]]
  rules[11] = [[42, 31], [42, 11, 31]]
  return rules
}

// counts how many messages satisfy the given list of rules
function countValidMessages(rules, messages) {
  return messages
    .map(message => checkMessage(rules, message))
    .filter(message => message)
    .length
}

console.log('Part 1 =', countValidMessages(rules, messages))
console.log('Part 2 =', countValidMessages(patchRules(rules), messages))

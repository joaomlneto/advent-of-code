const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)


const input = file
  .split('\n\n')

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

console.log(rules)

const messages = input[1].split('\n').filter(msg => msg.length > 0)

console.log(JSON.stringify(messages, null, 2))

function log(depth, ...msgs) {
  console.log(" |  ".repeat(depth), ...msgs)
}

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

function checkMessage(rules, message) {
  const {matched, unmatched} = checkAgainstRule(rules, message, 0)
  return (
    matched.length > 0 &&
    matched[0] === message &&
    unmatched[0].length === 0
  )
}

const x = checkMessage(rules, messages[4])

const res = messages
  .map(message => checkMessage(rules, message))
  .filter(message => message)
console.log('Part 1 =', res.length)

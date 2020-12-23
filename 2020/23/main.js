const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

class Cup {
  constructor(label, next) {
    this.label = label
    if (!next) {
      this.next = this
      this.prev = this
    } else {
      this.prev = next.prev
      this.next = next
      this.prev.next = this
      this.next.prev = this
    }
  }

  // places nodes after the current element
  // cup <-> cups[0] <-> ... <-> cups[n-1] <-> cup.next
  // NOTE: we assume the nodes in the list have their prev/next pointers
  //       set up correctly and only the edge nodes need to be updated
  insertAfter(cups) {
    cups[0].prev = this
    cups[cups.length - 1].next = this.next
    this.next.prev = cups[cups.length - 1]
    this.next = cups[0]
  }

  extractAfter(amount) {
    let extracted = []
    let nextCup = this.next
    for (let i = 0; i < amount; i++) {
      extracted = [...extracted, nextCup]
      nextCup = nextCup.next
    }
    this.next = nextCup
    nextCup.prev = this
    return extracted
  }
}

class CupsCircle {
  constructor(cupLabels) {
    this.head = null
    this.length = 0
    this.labelLookup = {}
    cupLabels.forEach(label => this.insertCup(label))
  }

  insertCup(label) {
    const cup = new Cup(label, this.head)
    if (!this.head) this.head = cup
    this.labelLookup[label] = cup
    this.length++
  }

  getCupWithLabel(label) {
    return this.labelLookup[label]
  }

  destinationCup(currentCup, pickedUpCups) {
    const pickedUpLabels = pickedUpCups.map(cup => cup.label)
    let destinationCup = currentCup.label
    do {
      destinationCup = mod(destinationCup - 2, this.length) + 1
    } while (pickedUpLabels.includes(destinationCup))
    return this.getCupWithLabel(destinationCup)
  }

  doTheCrabMove(currentCup) {
    const pickedUpCups = currentCup.extractAfter(3)
    const destinationCup = this.destinationCup(currentCup, pickedUpCups)
    destinationCup.insertAfter(pickedUpCups)
  }

  playCrabGame(numRounds) {
    let currentCup = this.head
    for (let i = 0; i < numRounds; i++) {
      this.doTheCrabMove(currentCup)
      currentCup = currentCup.next
    }
  }

  toArray() {
    if (!this.head) return []
    let labels = [this.head.label]
    for (let elem = this.head.next; elem !== this.head; elem = elem.next)
      labels = [...labels, elem.label]
    return labels
  }
}

function mod(value, modulo) {
  return (value + modulo) % modulo
}

function padCups(cups, len) {
  return [...cups, ...[...Array(len + 1).keys()].slice(cups.length + 1)]
}

function playPartOne(cups) {
  const circle = new CupsCircle(cups)
  circle.playCrabGame(100)
  circle.head = circle.getCupWithLabel(1)
  return Number(circle.toArray().slice(1).join(''))
}

function playPartTwo(cups) {
  const circle = new CupsCircle(padCups(cups, 1000000))
  circle.playCrabGame(10000000)
  const cupOne = circle.getCupWithLabel(1)
  return cupOne.next.label * cupOne.next.next.label
}

const cups = file
  .split('\n')[0]
  .split('')
  .map(cup => Number(cup))

console.log('Part 1 =', playPartOne(cups))
console.log('Part 2 =', playPartTwo(cups))

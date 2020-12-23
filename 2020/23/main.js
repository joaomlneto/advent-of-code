const fs = require('fs')

const filename = 'sample.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

function mod(value, modulo) {
  return (value + modulo) % modulo
}

function pickUpCups(cups, currentCupIndex, numCups) {
  const pickedUpCups = [...Array(numCups)]
    .map(i => cups.splice(mod(currentCupIndex + 1, cups.length), 1))
    .flat()
  return pickedUpCups
}

function placeCups(cups, destinationCupIndex, pickedUpCups) {
  cups.splice(destinationCupIndex + 1, 0, ...pickedUpCups)
}

function getDestinationCup(cups, currentCup, totalCups) {
  let destinationCup = currentCup
  do {
    destinationCup = mod(destinationCup - 2, totalCups + 1) + 1
  } while (!cups.includes(destinationCup))
  return destinationCup
}

function crabMove(cups, currentCupIndex) {
  const numCups = cups.length
  // console.log(JSON.stringify(cups).replace(/,/g,' '))
  const currentCup = cups[currentCupIndex]
  // console.log('current cup', currentCup)

  const pickedUpCups = pickUpCups(cups, currentCupIndex, 3)
  //const pickedUpCups = cups.splice(2, 3)

  // pick up 3 cups clockwise of currentCup
  // console.log('pick up    ', pickedUpCups)

  let destinationCup = getDestinationCup(cups, currentCup, numCups)
  const destinationCupIndex = cups.indexOf(destinationCup)
  // console.log('destination', destinationCup)

  placeCups(cups, destinationCupIndex, pickedUpCups)
}

function padCups(cups) {
  const max = Math.max(...cups)
  console.log('highest number is', max)
  const next = Math.max(...cups)
  const allNumbers = [...Array(1000001).keys()]
  return [...cups, ...allNumbers.slice(cups.length + 1)]
}

function shiftArrayLeft(array) {
  array.push(array.shift())
}

function playPartOne(initialCups) {
  const cups = initialCups.slice()
  for (let i = 0; i < 100; i++) {
    //console.log('\n--- move', (i+1), '---')
    crabMove(cups, 0)
    shiftArrayLeft(cups)
  }
  // return numbers to the right of cup labeled 1
  while (cups[0] !== 1) shiftArrayLeft(cups)
  return cups.slice(1).join('')
}

class ListNode {
  constructor(value) {
    this.value = value
    this.prev = null
    this.next = null
  }

  // extract N elements after the current element
  extractNext(num) {
    let extracted = []
    let next = num.next
    for (let i = 0; i < num; i++) {
      extracted = [...extracted, next.value]
      next = next.next
    }
    this.next = next
    next.prev = this
    return extracted
  }
}

class CircularList {
  constructor(values) {
    this.head = null
    this.size = 0
    for (const value of values) this.insert(value)
  }

  insert(value) {
    const elem = new ListNode(value)
    if (!this.head) {
      this.head = elem
      elem.next = elem
      elem.prev = elem
    } else {
      elem.prev = this.head.prev
      elem.next = this.head
      elem.prev.next = elem
      elem.next.prev = elem
    }
    this.size++
  }

  toArray() {
    let values = []
    let elem = this.head
    for (let i = 0; i < this.size; i++) {
      values = [...values, elem.value]
      elem = elem.next
    }
    return values
  }
}

function playPartTwo(initialCups) {
  const cups = padCups(initialCups.slice())
  let list = { head: null }

/*
  for (let i = 0; i < 10000000; i++) {
    console.log('\n--- move', (i+1), '---')
    crabMove(cups, 0)
    shiftArrayLeft(cups)
  }
  // return numbers to the right of cup labeled 1
  while (cups[0] !== 1) shiftArrayLeft(cups)
  return cups.slice(1).join('')*/
}

const cups = file
  .split('\n')[0]
  .split('')
  .map(cup => Number(cup))



// console.log('Part 1 =', playPartOne(cups))
// playPartTwo(cups)

console.log(cups)

console.log('....................')
console.log('....................')
console.log('....................')

const list = new CircularList(cups)

console.log(list.toArray())

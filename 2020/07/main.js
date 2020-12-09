const fs = require('fs')

const file = fs.readFileSync('input.txt').toString('utf8');

function sanitizeBagName(name) {
  return name.replaceAll('bags', 'bag').replaceAll('.', '')
}

function findBagsContaining(bags, name) {
  return Object.keys(bags)
    .filter(bagName => bags[bagName].filter(content => content.name == name).length > 0)
}

const bags = file.split('\n')
  .filter(line => line.length > 0)
  .map(ruleString => {
    const [ nameStr, contentStr] = ruleString.split(' contain ')
    return {
      [sanitizeBagName(nameStr)]: contentStr.split(', ')
        .map(contentString => {
          const [qtyStr, nameStr] = contentString.split(/ (.+)/)
          return {
            name: sanitizeBagName(nameStr),
            quantity: Number(qtyStr),
          }
        })
        .filter(content => Number.isInteger(content.quantity))
    }
  })
  .reduce((a, b) => ({...a, ...b}))

const bagContainers = Object.keys(bags)
  .map(bagName => ({
      [bagName]: findBagsContaining(bags, bagName)
  }))
  .reduce((a, b) => ({...a, ...b}))


// PART 1

function getContainersOfBag(bagContainers, bag) {
  let visited = new Set()
  let marked = bagContainers[bag]
  while (marked.length > 0) {
    const bag = marked.shift()
    visited.add(bag)
    marked = [...marked, ...bagContainers[bag]]
  }
  return visited
}

console.log("Number of bags that eventually contain shiny gold bag:",
            getContainersOfBag(bagContainers, "shiny gold bag").size)


// PART 2

function getContentSizeOfBags(bags, bag, sizes = {}) {
  if (bag in sizes) return sizes;

  let size = 0
  for (const {name, quantity} of bags[bag]) {
    if (!(name in sizes)) {
      sizes = {...sizes, ...getContentSizeOfBags(bags, name, sizes)}
    }
    size += quantity * (1 + sizes[name])
  }

  sizes[bag] = size
  return sizes
}

function getContentSizeOfBag(bags, bag) {
  return getContentSizeOfBags(bags, bag)[bag]
}

console.log('Number of bags inside shiny gold bag:', getContentSizeOfBag(bags, 'shiny gold bag'))

const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)



// Make the input pretty

const input = file
  .split('\n\n')

const fields = input[0]
  .split('\n')
  .filter(str => str.length > 0)
  .map(str => ({
    name: str.split(':')[0],
    intervals: str.split(':')[1]
      .trim()
      .split(' or ')
      .map(str => str.split('-').map(Number))
  }))

const myTicket = input[1]
  .split('\n')[1]
  .split(',')
  .map(Number)

const tickets = input[2]
  .split('\n')
  .slice(1)
  .filter(str => str.length > 0)
  .map(str => str.split(',').map(Number))



// PART 1

function valueMatchesField(value, field) {
  for (const interval of field.intervals) {
    const [min, max] = interval
    if ((value >= min) && (value <= max)) {
      return true;
    }
  }
}

function isValidValue(fields, value) {
  for (const field of fields) {
    if (valueMatchesField(value, field))
      return true
  }
  return false
}

function ticketInvalidValues(fields, ticket) {
  let invalidValues = []
  for (const value of ticket) {
    if (!isValidValue(fields, value)) {
      invalidValues.push(value)
    }
  }
  return invalidValues
}

console.log('Part 1 =', tickets
  .map(ticket => ticketInvalidValues(fields, ticket))
  .flat()
  .reduce((acc, values) => acc + values, 0))



// PART 2

function removeFromArray(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

function mergeTickets(tickets) {
  const values = [...Array(tickets[0].length)].map(x=>[])
  for (const ticket of tickets) {
    for (const [index, value] of ticket.entries()) {
      values[index].push(value)
    }
  }
  return values;
}

function valuesMatchField(values, field) {
  for (value of values) {
    if (!valueMatchesField(value, field))
      return false
  }
  return true
}

function mapFieldsToIndices(fields, [values, ...remainingValues], assignment = []) {
  // check if we were able to assign all fields!
  if (fields.length === 0) {
    return assignment
  }

  // check which fields would be matched by the values
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    if (valuesMatchField(values, field)) {
      // if values match this field, try to map remaining fields to
      // the remaining values, in recursive fashion
      const remainingFields = removeFromArray(fields, i)
      const result = mapFieldsToIndices(remainingFields,
                                        remainingValues,
                                        [...assignment, field])
      if (result) return result
    }
  }

  return false
}

function decodeTicket(ticket, fieldsMapping) {
  return fieldsMapping
    .map((field, index) => ({name: field.name, value: ticket[index]}))
}

const validTickets = tickets
  .filter(ticket => ticketInvalidValues(fields, ticket).length === 0)

const fieldsMapping = mapFieldsToIndices(fields, mergeTickets(validTickets))

console.log('Part 2 =', decodeTicket(myTicket, fieldsMapping)
  .filter(field => field.name.startsWith('departure'))
  .reduce((product, field) => product * field.value, 1))

const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const MODULO = 20201227
const INITIAL_SUBJECT_NUMBER = 7

const [cardPublicKey, doorPublicKey] = file.trim()
  .split('\n')
  .map(value => Number(value))

function transformSubjectNumber(subjectNumber, loopSize) {
  let value = 1
  for (let i = 0; i < loopSize; i++) {
    value = (value * subjectNumber) % MODULO
  }
  return value
}

function findLoopSize(subjectNumber, publicKey) {
  let loopSize = 0
  let value = 1
  while (value != publicKey) {
    value = (value * subjectNumber) % MODULO
    loopSize++
  }
  return loopSize
}

function findEncryptionKey(cardPublicKey, doorPublicKey) {
  const cardLoopSize = findLoopSize(INITIAL_SUBJECT_NUMBER, cardPublicKey)
  const encryptionKey = transformSubjectNumber(doorPublicKey, cardLoopSize)
  return encryptionKey
}

console.log(findEncryptionKey(cardPublicKey, doorPublicKey))

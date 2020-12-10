const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8');
const preambleLength = filename == 'sample.txt' ? 5 : 25;

console.log('filename                ', filename)
console.log('preamble length         ', preambleLength)

const numbers = file.split('\n')
  .filter(line => line.length > 0)
  .map(str => Number(str))

//console.log(numbers, typeof numbers)

function isNumberValid(preamble, number) {
  for (let i=0; i < preamble.length; i++) {
    for (let j=i+1; j < preamble.length; j++) {
      if (preamble[i] + preamble[j] == number) return true;
    }
  }
  return false;
}

function getNextPreamble(preamble, number) {
  return [...preamble.slice(1), number]
}


function findInvalidNumber(numbers) {
  let preamble = numbers.slice(0, preambleLength)
  for(let i=preambleLength; i<numbers.length; i++) {
    const number = numbers[i]
    if (!isNumberValid(preamble, number)) return number
    preamble = getNextPreamble(preamble, number)
  }
}

function findSubsetSum(numbers, number) {
  for (let start = 0; start < numbers.length; start++) {
    let sum = numbers[start] + numbers[start+1] + numbers[start+2]
    let end = start + 3;
    while (sum <= number && end < numbers.length) {
      sum += numbers[end]
      end++;
    }
    end -= 1;
    sum -= numbers[end]
    if (sum == number) {
      console.log(start, end, sum)
      const subset = numbers.slice(start, end)
      return {
        subset,
        min: Math.min(...subset),
        max: Math.max(...subset),
        sumOfMinMax: Math.min(...subset) + Math.max(...subset)
      }
    }
  }
}

const invalidNumber = findInvalidNumber(numbers)
console.log('[Part 1] Invalid number:', invalidNumber)

console.log('[Part 2] Encryption Weakness:',
            findSubsetSum(numbers, invalidNumber).sumOfMinMax)

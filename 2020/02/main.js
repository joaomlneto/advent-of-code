const fs = require('fs')

function xor(a,b) {
  return ( a || b ) && !( a && b );
}

const file = fs.readFileSync('input.txt').toString('utf8');

const passwords = file.split('\n')
  .map(line => {
    cols = line.split(' ')
    return {
      min: line.split(' ')[0].split('-')[0],
      max: line.split(' ')[0].split('-')[1],
      char: String(line.split(' ')[1]).charAt(0),
      password: line.split(' ')[2] ? String(line.split(' ')[2]) : undefined,
    }
  })
  .filter(password => typeof password.password !== 'undefined')


let numValidPart1 = 0;

for (let i=0; i < passwords.length; i++) {
  const password = passwords[i].password
  const char = passwords[i].char
  const min = passwords[i].min
  const max = passwords[i].max
  let matchingChars = 0;
  for (let p=0; p < password.length; p++) {
    if (password.charAt(p).toString() == char) {
      matchingChars++;
    }
  }
  if (matchingChars >= min && matchingChars <= max) {
    numValidPart1++
  }
}

console.log('Valid passwords (part 1):', numValidPart1);

let numValidPart2 = 0;

for (let i=0; i < passwords.length; i++) {
  const password = passwords[i].password
  const char = passwords[i].char
  const index1 = passwords[i].min - 1
  const index2 = passwords[i].max - 1
  if (xor(password.charAt(index1).toString() == char,
          password.charAt(index2).toString() == char)) {
    numValidPart2++;
  }
}

console.log('Valid passwords (part 2):', numValidPart2);

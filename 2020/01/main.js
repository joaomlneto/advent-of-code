const fs = require('fs')

const file = fs.readFileSync('input.txt').toString('utf8');

const values = file.split('\n').map(x => Number(x)).sort();

for (let i=0; i < values.length; i++) {
  for (let j=i+1; j < values.length; j++) {
    if (values[i] + values[j] == 2020) {
      console.log('Found pair of values!')
      console.log(`values[${i}] = ${values[i]}`)
      console.log(`values[${j}] = ${values[j]}`)
      console.log('Multiplied they are ' + (values[i] * values[j]))
    }
  }
}

console.log('\n')

for (let i=0; i < values.length; i++) {
  for (let j=i+1; j < values.length; j++) {
    for (let k=j+1; k < values.length; k++) {
      if (values[i] + values[j] + values[k] == 2020) {
        console.log('Found tripled of values!')
        console.log(`values[${i}] = ${values[i]}`)
        console.log(`values[${j}] = ${values[j]}`)
        console.log(`values[${k}] = ${values[k]}`)
        console.log('Multiplied they are ' + (values[i] * values[j] * values[k]))
      }
    }
  }
}

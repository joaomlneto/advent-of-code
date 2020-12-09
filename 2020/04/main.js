const fs = require('fs')

const file = fs.readFileSync('input.txt').toString('utf8');

function isPassportValidPart1(passport) {
  const keys = Object.keys(passport).filter(key => key !== 'cid')
  return keys.length == 7
}

function isPassportValidPart2(passport) {
  // check birth date, issued date and expiration date
  const byr = Number(passport.byr)
  const iyr = Number(passport.iyr)
  const eyr = Number(passport.eyr)
  if (byr < 1920 || byr > 2002) return false
  if (iyr < 2010 || iyr > 2020) return false
  if (eyr < 2020 || eyr > 2030) return false

  // validate height
  const heightUnits = String(passport.hgt).slice(-2)
  const height = Number(String(passport.hgt).slice(0, -2))
  if (heightUnits == 'cm') {
    if (height < 150 || height > 193) return false;
  } else if (heightUnits == 'in') {
    if (height < 59 || height > 76) return false;
  } else {
    return false // invalid unit
  }

  // validate hair color
  const color = String(passport.hcl)
  const result = /^#[0-9a-f]{6}$/.test(color);
  if (!result) return false;

  // validate eye color
  const ecl = String(passport.ecl)
  const validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']
  if (!(validEyeColors.includes(ecl))) return false;

  // validate passport number
  const pid = String(passport.pid)
  if (!(/^[0-9]{9}$/.test(pid))) return false;

  // if we passed all checks, return true
  return true;
}

const passports = file.split('\n\n')
  .filter(line => line.length > 1)
  .map(data => {
    const fields = data.split(/[\n ]/).sort().filter(f => f.length > 0)
    let passport = {};
    for (fieldStr of fields) {
      const field = fieldStr.split(':')
      passport[field[0]] = field[1]
    }
    return passport
  })


const validPassportsPart1 = passports.filter(passport => isPassportValidPart1(passport))
const validPassportsPart2 = validPassportsPart1.filter(passport => isPassportValidPart2(passport))

console.log('# Valid Passports (part 1) =', validPassportsPart1.length)
console.log('# Valid Passports (part 2) =', validPassportsPart2.length)

const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

function setIntersection(...sets) {
  return sets.reduce((a, b) => new Set([...a].filter(x => b.has(x))))
}

function identifyPossibleIngredientsWithAllergen(foods, allergen) {
  const allergenFoods = foods.filter(food => food.allergens.includes(allergen))
  const foodIngredients = allergenFoods.map(food => new Set(food.ingredients))
  return [...setIntersection(...foodIngredients)]
}

function ingredientMayContainAllergen(allergens, ingredient) {
  return allergens
    .filter(allergen => allergen.ingredients.includes(ingredient.name))
    .length > 0
}

function solveUnsafeIngredients(allergens) {
  let solved = []
  let isTrivialAllergen = (allergen) => allergen.ingredients.length === 1

  // perform unit propagation
  // https://en.wikipedia.org/wiki/Unit_propagation
  while(allergens.filter(isTrivialAllergen).length > 0) {
    const trivialAllergens = allergens.filter(isTrivialAllergen)
    const trivialIngredients = trivialAllergens.map(allergen => allergen.ingredients[0])
    solved = [...solved, ...trivialAllergens]
    allergens = allergens.map(allergen => ({
      ...allergen,
      ingredients: allergen.ingredients
        .filter(otherIngredient => !trivialIngredients.includes(otherIngredient))
    }))
    .filter(allergen => allergen.ingredients.length > 0)
  }

  // Maybe unit propagation is not enough for all inputs, but for me it worked
  // So, if you're reading this if you got an evil puzzle input and were reading
  // my code in hopes of getting inspired, I'm sorry. :(
  return solved
}

const foods = file
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => ({
    ingredients: line.split(' (')[0].split(' '),
    allergens: line.split(' (')[1].slice(9, -1).split(', '),
  }))

const allergens = [...new Set(foods.map(food => food.allergens).flat())]
  .map(allergen => ({
    name: allergen,
    ingredients: identifyPossibleIngredientsWithAllergen(foods, allergen),
  }))

const ingredients = [...new Set(foods.map(food => food.ingredients).flat())]
  .map(ingredient => ({
    name: ingredient,
    foods: foods
      .map((food, i) => ({...food, index: i}))
      .filter((food) => food.ingredients.includes(ingredient))
      .map(food => food.index),
  }))

// console.log(foods)
// console.log(allergens)
// console.log(ingredients)

const definitelySafeIngredients = ingredients
.filter(ingredient => !ingredientMayContainAllergen(allergens, ingredient))

const possiblyUnsafeIngredients = ingredients
.filter(ingredient => ingredientMayContainAllergen(allergens, ingredient))

console.log('Part 1 =',
definitelySafeIngredients.reduce((sum, ing) => sum + ing.foods.length, 0))

console.log('Part 2 =', solveUnsafeIngredients(allergens)
  .sort((a, b) => (a.name < b.name) ? -1 : ((a.name < b.name) ? 1 : 0))
  .map(allergen => allergen.ingredients[0])
  .join(',')
)

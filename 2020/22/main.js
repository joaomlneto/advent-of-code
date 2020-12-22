const fs = require('fs')

const filename = 'input.txt'
const file = fs.readFileSync(filename).toString('utf8')
console.log('filename:', filename)

const drawCardFromTop = (deck) => deck.shift()

const placeCardsOnBottom = (deck, cards) => deck.push(...cards)

const getDeckScore = (deck) =>
  deck.reduce((score, card, i, deck) => score + card * (deck.length - i), 0)

// Checks if both decks contain the same cards in the same order
const decksAreEqual = (d1, d2) =>
  (d1.length === d2.length) && d1.every((card, i) => card === d2[i])

// Check if there was a previous round in this game with every deck having
// the same cards in the same order
const decksAreRepeating = (decks, previousRounds) =>
  previousRounds.some(previousRound =>
    previousRound.every((previousDeck, i) =>
      decksAreEqual(previousDeck, decks[i])))

// sort cards according to the corresponding result in the sub-game
const sortCardsByResult = (cards, results) =>
  cards
    .map((card, i) => ({card, score: results[i]}))
    .sort((a, b) => b.score - a.score)
    .map(({card}) => card)

const descendingOrder = (a, b) => b - a

const noDeckIsEmpty = (decks) => decks.every(deck => deck.length > 0)

// get the deck with the highest result
const getWinnerDeck = (decks, results) =>
  decks[results.indexOf(Math.max(...results))]

function playCombat(decks) {
  // make a copy of the decks (so that we dont modify the original ones)
  decks = decks.map(deck => deck.slice())
  // play rounds until someone has no more cards
  while(noDeckIsEmpty(decks)) {
    const topCards = decks.map(drawCardFromTop)
    const winnerDeck = getWinnerDeck(decks, topCards)
    placeCardsOnBottom(winnerDeck, topCards.sort(descendingOrder))
  }
  return decks.map(getDeckScore)
}

function playRecursiveCombat(startingDecks) {
  // make a copy of the decks (so that we dont modify the original ones)
  const decks = startingDecks.map(deck => deck.slice())
  let previousRounds = []

  while (noDeckIsEmpty(decks)) {
    // check if decks are repeating. If so, give the first player the win.
    if (decksAreRepeating(decks, previousRounds))
      return [getDeckScore(decks[0]), -1]

    // remember the decks for the future (so we can check if it is a repetition)
    previousRounds.push(decks.map(deck => deck.slice()))

    // both players draw their top cards as before
    const topCards = decks.map(drawCardFromTop)

    // Check if players have at least as many cards remaining in their deck as
    // the value of the card they just drew
    if (decks.every((deck, i) => deck.length >= topCards[i])) {
      // If so, winner of the round is determined by a game of Recursive Combat
      const subDecks = decks.map((deck, i) => deck.slice(0, topCards[i]))
      const subResult = playRecursiveCombat(subDecks)
      const winnerDeck = getWinnerDeck(decks, subResult)
      placeCardsOnBottom(winnerDeck, sortCardsByResult(topCards, subResult))
    }
    else {
      // Otherwise, winner is player with highest-value card
      const winnerDeck = decks[topCards.indexOf(Math.max(...topCards))]
      placeCardsOnBottom(winnerDeck, topCards.sort(descendingOrder))
    }
  }
  return decks.map(getDeckScore)
}


const decks = file
  .split('\n\n')
  .map(deckString =>
    deckString
      .split('\n')
      .filter(n => n.length > 0)
      .slice(1)
      .map(card => Number(card)))

console.log("Part 1 =", playCombat(decks).reduce((s, d) => s + d, 0))
console.log('Part 2 =', playRecursiveCombat(decks).reduce((s, d) => s + d, 0))

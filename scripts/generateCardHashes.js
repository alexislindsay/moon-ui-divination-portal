// Utility script to add a stable `hash64` field to each tarot card.
// Run via `npm run generate-hashes` before building the app.
const fs = require('fs');
const crypto = require('crypto');

const deckPath = 'src/data/deckTarot.json';
const deck = JSON.parse(fs.readFileSync(deckPath, 'utf8'));

for (const card of deck.cards) {
  const hash = crypto
    .createHash('sha256')
    .update(card.name)
    .digest('hex');
  card.hash64 = hash; // 64 hex characters
}

fs.writeFileSync(deckPath, JSON.stringify(deck, null, 2));
console.log(`Updated ${deck.cards.length} cards with hash64 values.`);

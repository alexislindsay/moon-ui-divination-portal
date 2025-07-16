# Moon UI Divination Portal

Moon UI Divination Portal is an experimental tarot reader and text oracle built with React and Tailwind CSS.  It presents a short cosmic intro followed by a sequential three‑card draw.  Each card is paired with lines from sacred texts to inspire reflection.

## Features

- Animated "Galactic Scroll" intro screen.
- Tarot cards drawn from `src/data/deckTarot.json`.
- Quotes from the Avesta, Tao Te Ching and I Ching shown with each card.
- Cards appear one by one on request with a floating animation.

## Getting Started

Install dependencies and start the development server:

\`\`\`bash
npm install
npm start
\`\`\`

Open <http://localhost:3000> in your browser.  Use `npm run build` to create a production build.

## Usage

Click **Reveal 3 Cards** to shuffle the deck and display the first card.  Use **Reveal Next Card** to show each remaining card in order.  When all three cards are shown you can draw another set.

## Project Structure

- `src/App.js` – main application component handling card selection and display
- `src/GalacticScroll.jsx` – introductory animation
- `src/index.css` – base styles and Tailwind utilities
- `public/` – static assets including tarot imagery and sacred text data

## Contributing

Pull requests are welcome.  Feel free to open an issue to discuss improvements or report problems.

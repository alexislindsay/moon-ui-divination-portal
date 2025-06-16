# Moon UI Divination Portal

Moon UI Divination Portal is an experimental tarot reader and text oracle built with React and Tailwind CSS.  It presents a short cosmic intro followed by either a traditional three‑card draw or an unlimited reading for deeper exploration.  Each card is paired with lines from sacred texts to inspire reflection.

## Features

- Animated "Galactic Scroll" intro screen.
- Tarot cards drawn from `src/data/deckTarot.json`.
- Quotes from the Avesta, Tao Te Ching and I Ching shown with each card.

- Choose between a 3‑card reading or an unlimited draw for ongoing clarity,
  with a button to return to the central scroll.

- Cards appear one by one on request with a floating animation.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm start
```

Open <http://localhost:3000> in your browser.  Use `npm run build` to create a production build.

## Usage


Choose **Reveal 3 Cards** for a traditional past‑present‑future spread or **Unlimited Clarity** to pull cards one after another.  Use **Reveal Next Card** to continue drawing until satisfied.  In unlimited mode you can return to the choice screen any time via **Back to Central Scroll**.


## Project Structure

- `src/App.js` – main application component handling card selection and display
- `src/GalacticScroll.jsx` – introductory animation
- `src/index.css` – base styles and Tailwind utilities
- `public/` – static assets including tarot imagery and sacred text data

## Contributing

Pull requests are welcome.  Feel free to open an issue to discuss improvements or report problems.


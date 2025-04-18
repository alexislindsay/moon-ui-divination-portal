import { useState } from "react";

const tarotDeck = [
  { card: "The Wheel of Fortune", value: 0, image: "https://i.ibb.co/mFqBFXY2/The-WHEEL-OF-FORTUNE.png" },
  { card: "The World", value: 1, image: "https://i.ibb.co/MxvQhn7J/The-World.png" },
  { card: "The Sun", value: 2, image: "https://i.ibb.co/JjsM7mbV/The-Sun.jpg" },
  { card: "The Moon", value: 3, image: "https://i.ibb.co/qqscFVy/THE-MOON.png" },
  { card: "The Star", value: 4, image: "https://i.ibb.co/2165T0x4/The-Star.jpg" },
  { card: "The Tower", value: 5, image: "https://i.ibb.co/1JfK3BtS/The-Tower.jpg" },
  { card: "The Devil", value: 6, image: "https://i.ibb.co/tpqhJyPM/The-Devil.png" },
  { card: "Temperance", value: 7, image: "https://i.ibb.co/VYtZS7r8/Temperance.jpg" },
  { card: "Death", value: 8, image: "https://i.ibb.co/4RBMRZ4r/Death.jpg" },
  { card: "Stillness", value: 9, image: "https://i.ibb.co/LdRvQ2Jz/THE-HANGED-MAN.png" },
  { card: "Justice", value: 10, image: "https://i.ibb.co/SXWSh2V3/Justice.jpg" },
  { card: "The Hermit", value: 11, image: "https://i.ibb.co/wrzzYwhb/THE-HERMIT.png" },
  { card: "Strength", value: 12, image: "https://i.ibb.co/C5246HJK/Strength.jpg" },
  { card: "The Chariot", value: 13, image: "https://i.ibb.co/LDf79PX5/The-Chariot.png" },
  { card: "The Emperor", value: 14, image: "https://i.ibb.co/yF9Qf6f2/The-Emperor.png" },
  { card: "The High Priestess", value: 15, image: "https://i.ibb.co/0xRcHdK/THE-HIGH-PRIESTESS.png" },
  { card: "The Fool", value: 16, image: "https://i.ibb.co/tp2NtQt6/The-Fool.jpg" },
  { card: "The Lovers", value: 17, image: "https://i.ibb.co/kgFszpnj/The-Lovers.jpg" },
  { card: "Judgement", value: 18, image: "https://i.ibb.co/wj4Npph/Judgement-2.png" },
  { card: "The Hierophant", value: 19, image: "https://i.ibb.co/C5SxKkhz/The-Hierophant.png" },
  { card: "The Empress", value: 20, image: "https://i.ibb.co/v4vrsx83/The-Empress.png" },
  { card: "The Magician", value: 21, image: "https://i.ibb.co/BH3gBxZP/The-Magician.png" }
];

// Tao Te Ching chapters (1–81)
const taoChapters = Array.from({ length: 81 }, (_, i) => `Chapter ${i + 1}`);
// Sequentially grouped into three swaths of 27 chapters each
const taoGroups = [
  taoChapters.slice(0, 27),
  taoChapters.slice(27, 54),
  taoChapters.slice(54, 81)
];

// Definitions for card positions and corresponding Tao group phases
const positionMeanings = [
  'Phase I (Past): Chapters 1–27, reflecting origins and foundations.',
  'Phase II (Present): Chapters 28–54, reflecting current flow and balance.',
  'Phase III (Future): Chapters 55–81, reflecting potentials and unfoldings.'
];

export default function App() {
  const [cards, setCards] = useState([]);
  const [taoVerse, setTaoVerse] = useState(null);

  function handleDrawCard() {
    // Draw three distinct cards
    let selected;
    do {
      const shuffled = [...tarotDeck].sort(() => 0.5 - Math.random());
      selected = shuffled.slice(0, 3);
    } while (new Set(selected.map(c => c.value)).size < 3);

    setCards(selected);

    // For each card position, pick a random Tao verse from its group
    const phaseVerses = selected.map((c, i) => {
      const group = taoGroups[i];
      const idx = Math.floor(Math.random() * group.length);
      return group[idx];
    });
    setTaoVerse(phaseVerses);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 to-black text-white text-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Background and host now use same image */}
        <div className="w-full h-full bg-[url('https://i.imgur.com/5PYUMQe.gif')] bg-cover opacity-20" />
        <img
          src="https://i.imgur.com/5PYUMQe.gif"
          alt="Madam Fortuna"
          className="absolute bottom-0 right-0 w-64 opacity-70"
        />
      </div>
      <div className="relative z-10">
        <h1 className="text-4xl font-bold tracking-wide mb-4 drop-shadow-lg">🔮 Moon UI Divination Portal</h1>
        {cards.length === 0 ? (
          <>
            <p className="text-xl italic mb-6">Welcome, traveler. Shall we draw three cards?</p>
            <button onClick={handleDrawCard} className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 text-white font-bold rounded shadow">
              Yes, reveal my fate
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-center gap-4 mb-6">
              {cards.map((c, i) => (
                <img key={i} src={c.image} alt={c.card} className="w-48 h-auto rounded shadow-lg" />
              ))}
            </div>
            <div className="mb-4 text-left max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-2">Card Roles & Tao Group</h2>
              <ul className="list-disc list-inside text-indigo-300">
                {cards.map((c, i) => (
                  <li key={i}>
                    <strong>{c.card}:</strong> {positionMeanings[i]}<br />
                    <em>{taoVerse[i]}</em>
                  </li>
                ))}
              </ul>
              <p className="mt-4 italic text-indigo-400">Take a moment: weave your own connection between these verses and your life’s journey.</p>
            </div>
            <button onClick={handleDrawCard} className="mt-4 text-sm text-indigo-300 underline hover:text-indigo-100">
              Draw again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

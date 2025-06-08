import { useState, useEffect } from "react";
import GalacticScroll from "./GalacticScroll.jsx";
import deckTarot from "./data/deckTarot.json";

function getImagePath(card) {
  return card.img ? `/MinorArcana/${card.img.trim()}` : "/MinorArcana/placeholder.jpg";
}

function getRandomFromObject(obj) {
  const keys = Object.keys(obj);
  return obj[keys[Math.floor(Math.random() * keys.length)]];
}

function getAvestaLine(avesta) {
  const line = getRandomFromObject(avesta);
  return `🔥 Fargard ${line.fargard}, Verse ${line.verse} — ${line.text}`;
}

function getTaoLine(tao) {
  const validKeys = Object.keys(tao).filter(k => Number(k) <= 1104);
  const key = validKeys[Math.floor(Math.random() * validKeys.length)];
  const line = tao[key];
  return `📜 Chapter ${line.chapter} — ${line.text}`;
}

function getIChingSummary(iching) {
  const hex = getRandomFromObject(iching);
  return `💮 Hexagram — ${hex.name}\n☯️ Judgment: ${hex.judgment}\n🌬 Image: ${hex.image}`;
}

function getMeaning(card) {
  const lights = card.meanings?.light || [];
  return lights.map(line => `🌞 ${line}`).join("\n");
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [texts, setTexts] = useState({ tao: "", iching: "", avesta: "" });
  const [showIntro, setShowIntro] = useState(true);
  const [userHash, setUserHash] = useState(null);

  useEffect(() => {
    fetch('/api/userHash')
      .then(r => r.json())
      .then(data => setUserHash(data.userHash))
      .catch(console.error);
  }, []);

  useEffect(() => {
    getFreshTexts();
  }, []);

  function getFreshTexts() {
    Promise.all([
      fetch("/data/avesta.json").then(res => res.json()),
      fetch("/data/tao464.json").then(res => res.json()),
      fetch("/data/iching.json").then(res => res.json())
    ])
      .then(([avestaData, taoData, ichingData]) => {
        setTexts({
          avesta: getAvestaLine(avestaData),
          tao: getTaoLine(taoData),
          iching: getIChingSummary(ichingData)
        });
      })
      .catch(err => {
        console.error("Failed to load sacred texts:", err);
      });
  }

  function handleDrawThree() {
    let firstCard;
    if (userHash) {
      firstCard = deckTarot.cards.find(
        c => c.hash64.substring(0, 4) === userHash.substring(0, 4)
      );
    }

    const remainingCards = deckTarot.cards.filter(c => c !== firstCard);
    const shuffled = remainingCards.sort(() => 0.5 - Math.random());
    const selectedCards = firstCard ? [firstCard, ...shuffled.slice(0, 2)] : shuffled.slice(0, 3);
    
    setCards(selectedCards);
    getFreshTexts();
  }

  const labels = ["Avesta (Past)", "Tao Te Ching (Present)", "I Ching (Future)"];

  return showIntro ? (
    <GalacticScroll onComplete={() => setShowIntro(false)} />
  ) : (
    <div className="portal-container">
      <div className="infinity-bg">
        <div
          className="infinity-overlay"
          style={{ backgroundImage: "url('/TarotCards/Infinity.png')" }}
        />
        <img
          src="/TarotCards/Infinity.png"
          alt="Guide of Infinity"
          className="infinity-guide"
        />
      </div>

      <div className="portal-content">
        <h1 className="portal-title">🔮 Moon UI Divination Portal</h1>

        {cards.length === 0 ? (
          <>
            <p className="portal-subtext">Shall we draw wisdom from the unseen?</p>
            <button className="portal-button" onClick={handleDrawThree}>
              Reveal 3 Cards
            </button>
          </>
        ) : (
          <div className="card-group">
            {cards.map((card, i) => (
              <div key={card.img || i} className="card-box">
                <h2 className="card-title">{labels[i]} — {card.name}</h2>
                <div className="card-inner">
                  <img src={getImagePath(card)} alt={card.name} className="card-image" />
                  <div className="card-texts">
                    <pre className="card-meaning">{getMeaning(card)}</pre>
                    <p className="card-sacred-text fade-in">{Object.values(texts)[i]}</p>
                  </div>
                </div>
              </div>
            ))}
            <button className="draw-again" onClick={handleDrawThree}>
              Draw 3 new cards
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

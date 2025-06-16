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
  const [revealed, setRevealed] = useState(0);
  const [texts, setTexts] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const [userHash, setUserHash] = useState(null);
  const [mode, setMode] = useState("three");

  useEffect(() => {
    fetch('/api/userHash')
      .then(r => r.json())
      .then(data => setUserHash(data.userHash))
      .catch(console.error);
  }, []);

  useEffect(() => {
    // load initial sacred texts for first draw
    fetchTextSet().then(({ avesta, tao, iching }) => {
      setTexts([avesta, tao, iching]);
    });
  }, []);

  function fetchTextSet() {
    return Promise.all([
      fetch("/data/avesta.json").then(res => res.json()),
      fetch("/data/tao464.json").then(res => res.json()),
      fetch("/data/iching.json").then(res => res.json())
    ])
      .then(([avestaData, taoData, ichingData]) => ({
        avesta: getAvestaLine(avestaData),
        tao: getTaoLine(taoData),
        iching: getIChingSummary(ichingData)
      }))
      .catch(err => {
        console.error("Failed to load sacred texts:", err);
        return { avesta: "", tao: "", iching: "" };
      });
  }

  function handleDrawThree() {
    let firstCard;
    if (userHash) {
      firstCard = deckTarot.cards.find(
        c => c.hash64 && c.hash64.substring(0, 4) === userHash.substring(0, 4)
      );
    }

    const remainingCards = deckTarot.cards.filter(c => c !== firstCard);
    const shuffled = remainingCards.sort(() => 0.5 - Math.random());
    const selectedCards = firstCard ? [firstCard, ...shuffled.slice(0, 2)] : shuffled.slice(0, 3);
    
    setCards(selectedCards);
    setRevealed(1);
    setMode("three");
    fetchTextSet().then(({ avesta, tao, iching }) => {
      setTexts([avesta, tao, iching]);
    });
  }

  function handleDrawUnlimited() {
    const shuffled = [...deckTarot.cards].sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setRevealed(1);
    setMode("unlimited");
    fetchTextSet().then(({ avesta, tao, iching }) => {
      const options = [avesta, tao, iching];
      setTexts([options[Math.floor(Math.random() * options.length)]]);
    });

  }

  function handleBackToScroll() {
    setCards([]);
    setRevealed(0);
    setTexts([]);
    setMode("three");

  }

  function handleRevealNext() {
    setRevealed(r => {
      const next = Math.min(r + 1, cards.length);
      if (mode === "unlimited" && next > texts.length) {
        fetchTextSet().then(({ avesta, tao, iching }) => {
          const opts = [avesta, tao, iching];
          setTexts(prev => [...prev, opts[Math.floor(Math.random() * opts.length)]]);
        });
      }
      return next;
    });
  }

  const labels = ["Avesta (Past)", "Tao Te Ching (Present)", "I Ching (Future)"];

  function getLabel(index) {
    if (mode === "three") {
      return labels[index] || `Card ${index + 1}`;
    }
    return `Card ${index + 1}`;
  }

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
        <h1 className="portal-title"> Divination 🔮 Portal</h1>

        {cards.length === 0 ? (
          <>
            <p className="portal-subtext">Shall we draw wisdom from the unseen?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="portal-button" onClick={handleDrawThree}>
                Reveal 3 Cards
              </button>
              <button className="portal-button" onClick={handleDrawUnlimited}>
                Unlimited Clarity
              </button>
            </div>
          </>
        ) : (
          <div className="card-group">
            {cards.slice(0, revealed).map((card, i) => (
              <div key={card.img || i} className="card-box float-in">
                <h2 className="card-title">{getLabel(i)} — {card.name}</h2>
                <div className="card-inner">
                  <img src={getImagePath(card)} alt={card.name} className="card-image" />
                  <div className="card-texts">
                    <pre className="card-meaning">{getMeaning(card)}</pre>
                    {texts[i] && (
                      <p className="card-sacred-text fade-in">{texts[i]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {revealed < cards.length ? (
              <button className="portal-button next-card" onClick={handleRevealNext}>
                Reveal Next Card
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="draw-again" onClick={handleDrawThree}>
                  Draw 3 new cards
                </button>
                <button className="draw-again" onClick={handleDrawUnlimited}>
                  Unlimited draw
                </button>
              </div>

            )}
            {mode === "unlimited" && (
              <button className="draw-again" onClick={handleBackToScroll}>
                Back to Central Scroll
              </button>

            )}
          </div>
        )}
      </div>

      <footer className="mt-12 flex flex-col items-center space-y-4">

     
        <a
          href="https://github.com/alexislindsay/moon-ui-divination-portal"
          className="draw-again"
          target="_blank"
          rel="noopener noreferrer"
        >
          View source on GitHub
        </a>

        <a
          href="https://www.alexislindsay.com"
          className="glyph-gate"
          target="_blank"
          rel="noopener noreferrer"
          data-hover="Back to the Glyph Gate"
        >
          <img
            src="/TarotCards/glyphgateicon.png"
            alt="Glyph Gate icon"
            className="glyph-icon"
          />
        </a>

      </footer>
    </div>
  );
}

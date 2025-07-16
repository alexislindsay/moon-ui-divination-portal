"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GalacticScroll from "./GalacticScroll.jsx"
import deckTarot from "./data/deckTarot.json"
import ParticleField from "./components/ParticleField"
import "./App.css"

function getImagePath(card) {
  return card.img ? `/MinorArcana/${card.img.trim()}` : "/MinorArcana/placeholder.jpg"
}

function getRandomFromObject(obj) {
  const keys = Object.keys(obj)
  return obj[keys[Math.floor(Math.random() * keys.length)]]
}

function getAvestaLine(avesta) {
  const line = getRandomFromObject(avesta)
  return `🔥 Fargard ${line.fargard}, Verse ${line.verse} — ${line.text}`
}

function getTaoLine(tao) {
  const validKeys = Object.keys(tao).filter((k) => Number(k) <= 1104)
  const key = validKeys[Math.floor(Math.random() * validKeys.length)]
  const line = tao[key]
  return `📜 Chapter ${line.chapter} — ${line.text}`
}

function getIChingSummary(iching) {
  const hex = getRandomFromObject(iching)
  return `💮 Hexagram — ${hex.name}\n☯️ Judgment: ${hex.judgment}\n🌬 Image: ${hex.image}`
}

function getMeaning(card) {
  const lights = card.meanings?.light || []
  return lights.map((line) => `🌞 ${line}`).join("\n")
}

export default function App() {
  const [cards, setCards] = useState([])
  const [revealed, setRevealed] = useState(0)
  const [texts, setTexts] = useState({ tao: "", iching: "", avesta: "" })
  const [textRevealed, setTextRevealed] = useState([false, false, false])
  const [showIntro, setShowIntro] = useState(true)
  const [userHash, setUserHash] = useState(null)

  useEffect(() => {
    // Generate a simple user hash for demo purposes
    setUserHash(Math.random().toString(36).substring(2, 15))
  }, [])

  useEffect(() => {
    getFreshTexts()
  }, [])

  function getFreshTexts() {
    Promise.all([
      fetch("/data/avesta.json").then((res) => res.json()),
      fetch("/data/tao464.json").then((res) => res.json()),
      fetch("/data/iching.json").then((res) => res.json()),
    ])
      .then(([avestaData, taoData, ichingData]) => {
        setTexts({
          avesta: getAvestaLine(avestaData),
          tao: getTaoLine(taoData),
          iching: getIChingSummary(ichingData),
        })
      })
      .catch((err) => {
        console.error("Failed to load sacred texts:", err)
      })
  }

  function handleDrawThree() {
    let firstCard
    if (userHash) {
      firstCard = deckTarot.cards.find((c) => c.hash64 && c.hash64.substring(0, 4) === userHash.substring(0, 4))
    }

    const remainingCards = deckTarot.cards.filter((c) => c !== firstCard)
    const shuffled = remainingCards.sort(() => 0.5 - Math.random())
    const selectedCards = firstCard ? [firstCard, ...shuffled.slice(0, 2)] : shuffled.slice(0, 3)

    setCards(selectedCards)
    setRevealed(1)
    setTextRevealed([false, false, false])
    getFreshTexts()
  }

  function handleRevealNext() {
    setRevealed((r) => Math.min(r + 1, cards.length))
  }

  function toggleTextReveal(index) {
    setTextRevealed((prev) => {
      const newState = [...prev]
      newState[index] = !newState[index]
      return newState
    })
  }

  const labels = ["Avesta (Past)", "Tao Te Ching (Present)", "I Ching (Future)"]

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
      rotateY: 180,
      x: Math.random() * 400 - 200,
      y: Math.random() * 400 - 200,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 1.2,
      },
    },
    hover: {
      scale: 1.05,
      rotateX: 5,
      rotateY: 5,
      transition: { duration: 0.3 },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const floatingTextVariants = {
    hover: {
      y: -5,
      textShadow: "0 0 20px rgba(147, 51, 234, 0.8)",
      transition: { duration: 0.3 },
    },
  }

  return showIntro ? (
    <GalacticScroll onComplete={() => setShowIntro(false)} />
  ) : (
    <div className="portal-container">
      <ParticleField />

      <div className="infinity-bg">
        <div className="infinity-overlay" style={{ backgroundImage: "url('/TarotCards/Infinity.png')" }} />
        <img src="/TarotCards/Infinity.png" alt="Guide of Infinity" className="infinity-guide" />
      </div>

      <div className="portal-content">
        <motion.h1 className="portal-title" variants={floatingTextVariants} whileHover="hover">
          🌌 Cosmic Divination Portal 🔮
        </motion.h1>

        {cards.length === 0 ? (
          <>
            <motion.p className="portal-subtext" variants={floatingTextVariants} whileHover="hover">
              Shall we draw wisdom from the cosmic void?
            </motion.p>
            <motion.button
              className="portal-button"
              onClick={handleDrawThree}
              whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(147, 51, 234, 0.6)" }}
              whileTap={{ scale: 0.95 }}
            >
              Reveal 3 Cards
            </motion.button>
          </>
        ) : (
          <div className="card-group">
            <AnimatePresence>
              {cards.slice(0, revealed).map((card, i) => (
                <motion.div
                  key={card.img || i}
                  className="card-box"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  custom={i}
                >
                  <motion.h2 className="card-title" variants={floatingTextVariants} whileHover="hover">
                    {labels[i]} — {card.name}
                  </motion.h2>

                  <div className="card-inner">
                    <motion.img
                      src={getImagePath(card)}
                      alt={card.name}
                      className="card-image"
                      whileHover={{
                        scale: 1.1,
                        filter: "brightness(1.2) saturate(1.3)",
                      }}
                    />

                    <div className="card-texts">
                      <motion.pre className="card-meaning" variants={floatingTextVariants} whileHover="hover">
                        {getMeaning(card)}
                      </motion.pre>

                      <motion.button
                        className="reveal-button"
                        onClick={() => toggleTextReveal(i)}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 0 15px rgba(147, 51, 234, 0.5)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {textRevealed[i] ? "🌙 Hide Sacred Text" : "✨ Reveal Sacred Text"}
                      </motion.button>

                      <AnimatePresence>
                        {textRevealed[i] && (
                          <motion.p
                            className="card-sacred-text"
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                          >
                            {Object.values(texts)[i]}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {revealed < cards.length ? (
              <motion.button
                className="portal-button next-card"
                onClick={handleRevealNext}
                whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(147, 51, 234, 0.6)" }}
                whileTap={{ scale: 0.95 }}
              >
                Reveal Next Card
              </motion.button>
            ) : (
              <motion.button
                className="draw-again"
                onClick={handleDrawThree}
                whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(147, 51, 234, 0.6)" }}
                whileTap={{ scale: 0.95 }}
              >
                Draw 3 New Cards
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

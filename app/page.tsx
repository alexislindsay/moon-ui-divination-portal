"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ParticleField from "@/components/particle-field"
import "@/app/globals.css"

/* ---------- tiny helper utils ---------- */
function getRandomFromObject<T>(obj: Record<string, T>): T {
  const keys = Object.keys(obj)
  return obj[keys[Math.floor(Math.random() * keys.length)]]
}
const getImagePath = (card: TarotCard) =>
  card.img ? `/MinorArcana/${card.img.trim()}` : "/MinorArcana/placeholder.jpg"

/* ---------- data helpers ---------- */
function getAvestaLine(avesta: AvestaJSON) {
  const line = getRandomFromObject(avesta)
  return `🔥 Fargard ${line.fargard}, Verse ${line.verse} — ${line.text}`
}
function getTaoLine(tao: TaoJSON) {
  const valid = Object.keys(tao).filter((k) => Number(k) <= 1104)
  const line = tao[valid[Math.floor(Math.random() * valid.length)]]
  return `📜 Chapter ${line.chapter} — ${line.text}`
}
function getIChingSummary(iching: IChingJSON) {
  const hex = getRandomFromObject(iching)
  return `💮 Hexagram — ${hex.name}\n☯️ Judgment: ${hex.judgment}\n🌬 Image: ${hex.image}`
}
const getMeaning = (card: TarotCard) => (card.meanings?.light ?? []).map((l) => `🌞 ${l}`).join("\n")

/* ---------- React page component ---------- */
export default function Page() {
  const [deck, setDeck] = useState<TarotCard[]>([])
  const [cards, setCards] = useState<TarotCard[]>([])
  const [revealed, setRevealed] = useState(0)
  const [texts, setTexts] = useState({ avesta: "", tao: "", iching: "" })
  const [textOpen, setTextOpen] = useState([false, false, false])

  /* load static JSON assets */
  useEffect(() => {
    fetch("/data/deckTarot.json")
      .then((r) => r.json())
      .then((d) => setDeck(d.cards ?? []))
      .catch(console.error)

    Promise.all([
      fetch("/data/avesta.json").then((r) => r.json()),
      fetch("/data/tao464.json").then((r) => r.json()),
      fetch("/data/iching.json").then((r) => r.json()),
    ]).then(([av, ta, ic]) =>
      setTexts({ avesta: getAvestaLine(av), tao: getTaoLine(ta), iching: getIChingSummary(ic) }),
    )
  }, [])

  /* draw three cards */
  const handleDraw = () => {
    if (deck.length < 3) return
    const shuffled = [...deck].sort(() => 0.5 - Math.random())
    setCards(shuffled.slice(0, 3))
    setRevealed(1)
    setTextOpen([false, false, false])
  }
  const revealNext = () => setRevealed((r) => Math.min(r + 1, cards.length))
  const toggleText = (i: number) => setTextOpen((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  const labels = ["Avesta (Past)", "Tao Te Ching (Present)", "I Ching (Future)"]

  /* animation variants */
  const cardV = {
    hidden: { opacity: 0, scale: 0.3, y: 100 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
    hover: { scale: 1.05 },
  }
  const textV = {
    collapsed: { height: 0, opacity: 0 },
    open: { height: "auto", opacity: 1 },
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <ParticleField />

      <h1 className="text-3xl font-bold mb-6 tracking-wide bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
        🌌 Cosmic Divination Portal 🔮
      </h1>

      {cards.length === 0 ? (
        <motion.button
          className="portal-button px-6 py-3 rounded-md bg-purple-600 hover:bg-purple-500"
          onClick={handleDraw}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          Reveal 3 Cards
        </motion.button>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-3">
            <AnimatePresence>
              {cards.slice(0, revealed).map((card, i) => (
                <motion.div
                  key={card.img ?? i}
                  variants={cardV}
                  initial="hidden"
                  animate="show"
                  whileHover="hover"
                  exit="hidden"
                  className="bg-white/10 backdrop-blur rounded-xl p-4 w-72"
                >
                  <h2 className="text-lg mb-2 text-center">
                    {labels[i]} — {card.name}
                  </h2>
                  <img
                    src={getImagePath(card) || "/placeholder.svg"}
                    alt={card.name}
                    className="w-full h-48 object-cover rounded-md mb-3 shadow-lg"
                  />
                  <pre className="whitespace-pre-wrap text-sm mb-2">{getMeaning(card)}</pre>

                  <motion.button
                    className="text-cyan-300 underline mb-2"
                    onClick={() => toggleText(i)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {textOpen[i] ? "Hide Sacred Text" : "Reveal Sacred Text"}
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {textOpen[i] && (
                      <motion.p
                        key="txt"
                        className="text-sm whitespace-pre-wrap"
                        variants={textV}
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                      >
                        {Object.values(texts)[i]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {revealed < cards.length ? (
            <motion.button
              className="mt-6 px-5 py-2 bg-purple-600 rounded-md"
              onClick={revealNext}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Reveal Next Card
            </motion.button>
          ) : (
            <motion.button
              className="mt-6 px-5 py-2 bg-purple-600 rounded-md"
              onClick={handleDraw}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              Draw Again
            </motion.button>
          )}
        </>
      )}
    </main>
  )
}

/* ---------- type helpers ---------- */
type TarotCard = {
  name: string
  img?: string
  hash64?: string
  meanings?: { light?: string[] }
}
type AvestaJSON = Record<string, { fargard: string; verse: string; text: string }>
type TaoJSON = Record<string, { chapter: string; text: string }>
type IChingJSON = Record<string, { name: string; judgment: string; image: string }>

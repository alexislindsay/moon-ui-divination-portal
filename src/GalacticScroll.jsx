import { useEffect } from "react";
import "./GalacticScroll.css";

export default function GalacticScroll({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const stars = Array.from({ length: 60 });

  return (
    <div className="galactic-container" data-testid="galactic-scroll">
      <div className="galactic-message">Entering the Cosmic Current...</div>
      <div className="star-field">
        {stars.map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              "--tx": `${Math.random() * 200 - 100}vw`,
              "--ty": `${Math.random() * 200 - 100}vh`,
              animationDelay: `${Math.random() * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

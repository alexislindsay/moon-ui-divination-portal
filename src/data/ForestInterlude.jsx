import { useEffect, useRef } from "react";
import poemForest from "./poemForest.json";
import "./ForestInterlude.css";

export default function ForestInterlude({ onComplete }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("hidden");
            entry.target.classList.add("fade-in-mist");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const lines = containerRef.current.querySelectorAll(".forest-line");
    lines.forEach(line => {
      line.classList.add("hidden"); // start hidden
      observer.observe(line);
    });

    return () => observer.disconnect();
  }, []);

  console.log("poemForest:", poemForest);

  return (
    <div className="forest-container">
      <div className="forest-overlay">
        <h2 className="forest-title">✧ From the KaOs of the Infinite ✧</h2>
        <div className="forest-lines" ref={containerRef}>
          {poemForest.map((line, idx) => (
            <div key={idx} className="forest-line">
              <p className="forest-it">◩ {line.it}</p>
              <p className="forest-en">◫ {line.en}</p>
            </div>
          ))}
        </div>
        <button className="continue-button" onClick={onComplete}>
          ➤ Continue Your Journey
        </button>
      </div>
    </div>
  );
}

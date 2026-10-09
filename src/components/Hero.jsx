import { ArrowDownRight, Play } from "lucide-react";
export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg" />
      <div className="noise" />
      <div className="hero-content">
        <div className="eyebrow">
          <span /> FIVEM PHOTOGRAPHY / PHNOM PENH
        </div>
        <h1>
          YOUR STORY.
          <br />
          <em>YOUR FRAME.</em>
        </h1>
        <p>
          Premium FiveM screenshots and short cinematic videos made for
          characters, couples, crews and gangs.
        </p>
        <div className="hero-actions">
          <a href="#book" className="btn primary">
            BOOK A SHOOT <ArrowDownRight size={17} />
          </a>
          <a href="#gallery" className="btn ghost">
            VIEW GALLERY <Play size={14} fill="currentColor" />
          </a>
        </div>
      </div>
      <div className="hero-bottom">
        <span>EST. 2026</span>
        <span>SCROLL TO EXPLORE ↓</span>
        <span>PHOTO / VIDEO / EDIT</span>
      </div>
    </section>
  );
}

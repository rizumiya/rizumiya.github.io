---
title: Projects
date: 2025-10-13
---

# My Projects

Welcome to my projects section! Here you can find various games and applications I've built.

## Available Projects

<style>
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.1rem;
    margin: 1.5rem 0 2rem;
    padding: 1.25rem;
    border: 1px solid #ebe8f2;
    border-radius: 22px;
    background: linear-gradient(135deg, #f4f6ff 0%, #fbf4f7 52%, #f3faf8 100%);
  }

  .project-card {
    background: #fff;
    border: 1px solid #e8e6ef;
    border-radius: 16px;
    padding: 1.35rem;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    text-decoration: none;
    color: #394258;
    position: relative;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(53, 57, 79, 0.045);
  }

  .project-card::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: #b9b8e8;
  }

  .project-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 24px rgba(53, 57, 79, 0.1);
    border-color: #c9c6e5;
    text-decoration: none;
  }

  .project-card:focus-visible {
    outline: 3px solid #8d8acb;
    outline-offset: 3px;
  }

  .project-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #45466f;
    border-bottom: none;
    padding-bottom: 0;
  }

  .project-desc {
    font-size: 0.95rem;
    line-height: 1.65;
    color: #5f6678;
    margin-bottom: 1.2rem;
    flex-grow: 1;
  }

  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
  }

  .project-tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.7rem;
    border-radius: 99px;
    background: #f0eff8;
    border: 1px solid #e5e3f0;
    color: #575775;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .tag-game { background: #fff0ed; color: #985d52; border-color: #f2ddd8; }
  .tag-canvas { background: #edf5ff; color: #4f6f94; border-color: #dce9f7; }
  .tag-ai { background: #f3efff; color: #6d5b96; border-color: #e7def8; }
  .tag-multiplayer { background: #eaf6ef; color: #4f795f; border-color: #d9ebdf; }

  .more-projects {
    text-align: center;
    margin-top: 2.5rem;
    font-style: italic;
    color: #73788a;
    font-weight: 500;
  }

  @media (max-width: 600px) {
    .projects-grid {
      grid-template-columns: 1fr;
      gap: 0.85rem;
      padding: 0.75rem;
      border-radius: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .project-card {
      transition: none;
    }
  }
</style>

<div class="projects-grid">
  <a href="glyph-forge/" class="project-card">
    <h3 class="project-title">Glyph Forge — Puzzle Kode</h3>
    <p class="project-desc">Rakit simbol rahasia dari bentuk SVG yang dibuat dengan kode. Pilih objek satu per satu, putar bentuknya, dan cocokkan tumpukannya dengan target.</p>
    <div class="project-tags">
      <span class="project-tag tag-game">Game</span>
      <span class="project-tag tag-canvas">SVG</span>
      <span class="project-tag">Puzzle</span>
    </div>
  </a>

  <a href="spot-the-differences/" class="project-card">
    <h3 class="project-title">Spot the Differences</h3>
    <p class="project-desc">An interactive web-based game challenging players to find differences between two dynamic radar displays. Features scoring and responsive canvas rendering.</p>
    <div class="project-tags">
      <span class="project-tag tag-game">Game</span>
      <span class="project-tag tag-canvas">HTML5 Canvas</span>
    </div>
  </a>

  <a href="guessing-game/" class="project-card">
    <h3 class="project-title">Guessing Game</h3>
    <p class="project-desc">A word guessing game with multiple categories, difficulty levels, and hint systems. Questions are securely stored using Caesar cipher encryption.</p>
    <div class="project-tags">
      <span class="project-tag tag-game">Game</span>
      <span class="project-tag">Logic</span>
    </div>
  </a>

  <a href="number-guessing/" class="project-card">
    <h3 class="project-title">Number Guessing</h3>
    <p class="project-desc">A classic Bulls and Cows style logic game. Try to guess the secret 4-digit number using hints about correct digits and positions across multiple attempts.</p>
    <div class="project-tags">
      <span class="project-tag tag-game">Game</span>
      <span class="project-tag">Bulls & Cows</span>
    </div>
  </a>

  <a href="my-memories/" class="project-card">
    <h3 class="project-title">My Memories</h3>
    <p class="project-desc">A fun and interactive game to play and explore memories.</p>
    <div class="project-tags">
      <span class="project-tag tag-game">Game</span>
      <span class="project-tag">Fun</span>
    </div>
  </a>

  <a href="one-of-us/" class="project-card">
    <h3 class="project-title">One of Us (Tebak Spy)</h3>
    <p class="project-desc">A real-time multiplayer social deduction game. Hosted via local network or online, featuring AI-generated secret words to find the hidden Spy amongst players.</p>
    <div class="project-tags">
      <span class="project-tag tag-game">Game</span>
      <span class="project-tag tag-multiplayer">Multiplayer</span>
      <span class="project-tag tag-ai">Gemini AI</span>
    </div>
  </a>
</div>

<p class="more-projects">More projects will be added soon!</p>
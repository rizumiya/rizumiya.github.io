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
    gap: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .project-card {
    /* Menggunakan gradient agar background tidak terlalu flat */
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
    backdrop-filter: blur(10px); /* Efek kaca elegan */
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    text-decoration: none;
    color: inherit;
    position: relative;
    overflow: hidden;
    /* Base shadow untuk kedalaman */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
  }

  /* Glassmorphism subtle glow */
  .project-card::before {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 50%; height: 100%;
    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
    transform: skewX(-25deg);
    transition: all 0.75s ease;
  }
  
  .project-card:hover {
    transform: translateY(-5px);
    /* Shadow lebih gelap + sedikit glow biru agar elegan */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3), 0 0 15px rgba(168, 199, 250, 0.15);
    border-color: rgba(168, 199, 250, 0.4); /* Border menyala halus saat di-hover */
    text-decoration: none;
  }

  .project-card:hover::before {
    left: 200%;
  }

  .project-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #2065aaff;
    border-bottom: none;
    padding-bottom: 0;
    transition: color 0.2s ease;
  }

  .project-card:hover .project-title {
    color: var(--link-hover-color, #60a5fa); /* Warna biru yang lebih kaya */
  }

  .project-desc {
    font-size: 0.95rem;
    line-height: 1.5;
    color: #94a3b8; /* Abu-abu kebiruan solid, lebih tajam daripada pakai opacity */
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
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15); /* Tambahan border agar tag lebih tegas */
    color: #cbd5e1;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  /* Warna tag dibuat sedikit lebih vibrant dengan border senada */
  .tag-game { background: rgba(248, 113, 113, 0.15); color: #fca5a5; border-color: rgba(248, 113, 113, 0.3); }
  .tag-canvas { background: rgba(56, 189, 248, 0.15); color: #7dd3fc; border-color: rgba(56, 189, 248, 0.3); }
  .tag-ai { background: rgba(167, 139, 250, 0.15); color: #c4b5fd; border-color: rgba(167, 139, 250, 0.3); }
  .tag-multiplayer { background: rgba(74, 222, 128, 0.15); color: #86efac; border-color: rgba(74, 222, 128, 0.3); }
  
  /* Prevent theme markdown styles from overriding links inside cards */
  .projects-grid a:hover {
    background-color: transparent;
  }
  
  .more-projects {
      text-align: center;
      margin-top: 3rem;
      font-style: italic;
      color: #64748b;
      font-weight: 500;
  }
</style>

<div class="projects-grid">
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
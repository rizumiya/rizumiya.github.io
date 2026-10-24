---
title: Projects
date: 2025-10-13
---

<div class="projects-heading">
  <div>
    <h1><span data-lang-content="id">Proyek Saya</span><span data-lang-content="en" hidden>My Projects</span></h1>
    <p><span data-lang-content="id">Berbagai game dan aplikasi yang saya buat.</span><span data-lang-content="en" hidden>A collection of games and applications I've built.</span></p>
  </div>
  <div class="language-switch" role="group" aria-label="Pilih bahasa / Choose language">
    <button type="button" class="language-button is-active" data-language="id" aria-pressed="true">Indonesia</button>
    <button type="button" class="language-button" data-language="en" aria-pressed="false">English</button>
  </div>
</div>

<h2 class="projects-subheading"><span data-lang-content="id">Game dan Aplikasi</span><span data-lang-content="en" hidden>Games and Apps</span></h2>

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

  .projects-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin: 1.25rem 0 0.5rem;
  }

  .projects-heading h1 {
    margin: 0 0 0.35rem;
    border: 0;
    padding: 0;
    color: #45466f;
    font-size: clamp(1.6rem, 4vw, 2rem);
  }

  .projects-heading p { margin: 0; color: #5f6678; }

  .language-switch {
    display: inline-flex;
    flex: 0 0 auto;
    gap: 0.25rem;
    padding: 0.25rem;
    border: 1px solid #e5e3f0;
    border-radius: 999px;
    background: #f4f3f9;
  }

  .language-button {
    border: 0;
    border-radius: 999px;
    padding: 0.5rem 0.8rem;
    background: transparent;
    color: #575775;
    font: inherit;
    font-size: 0.82rem;
    cursor: pointer;
  }

  .language-button.is-active {
    background: #fff;
    color: #45466f;
    box-shadow: 0 1px 4px rgba(53, 57, 79, 0.12);
  }

  .language-button:focus-visible { outline: 2px solid #8d8acb; outline-offset: 2px; }
  .projects-subheading { margin: 1.25rem 0 0.25rem; color: #45466f; }

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
    .projects-heading {
      align-items: flex-start;
      flex-direction: column;
    }

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
  <a href="mochi-pocket/" class="project-card">
    <h3 class="project-title"><span data-lang-content="id">Mochi Pocket — Teman Virtual</span><span data-lang-content="en" hidden>Mochi Pocket — Virtual Pet</span></h3>
    <p class="project-desc"><span data-lang-content="id">Konsol peliharaan virtual &amp; Tamagotchi minimalis dengan 6 wujud interaktif (Puni Mochi, Kucing Neko, Hamster, Anjing Shiba, Landak, dan Live2D), mini-game tangkap bintang, 6 tema konsol, serta penyimpanan IndexedDB.</span><span data-lang-content="en" hidden>A minimalist handheld virtual pet &amp; Tamagotchi console with 6 interactive forms (Puni Mochi, Neko Cat, Hamster, Shiba Dog, Hedgehog, and Live2D), a star-catching mini-game, 6 console themes, and IndexedDB persistence.</span></p>
    <div class="project-tags">
      <span class="project-tag tag-game"><span data-lang-content="id">Game</span><span data-lang-content="en" hidden>Game</span></span>
      <span class="project-tag tag-canvas">SVG &amp; Live2D</span>
      <span class="project-tag">Tamagotchi</span>
    </div>
  </a>

  <a href="glyph-forge/" class="project-card">
    <h3 class="project-title"><span data-lang-content="id">Glyph Forge — Puzzle Kode</span><span data-lang-content="en" hidden>Glyph Forge — Code Puzzle</span></h3>
    <p class="project-desc"><span data-lang-content="id">Rakit simbol rahasia dari bentuk SVG yang dibuat dengan kode. Pilih objek satu per satu, putar bentuknya, dan cocokkan tumpukannya dengan target.</span><span data-lang-content="en" hidden>Build a secret symbol from code-drawn SVG shapes. Select objects one at a time, rotate their shapes, and match the layered result to the target.</span></p>
    <div class="project-tags">
      <span class="project-tag tag-game"><span data-lang-content="id">Game</span><span data-lang-content="en" hidden>Game</span></span>
      <span class="project-tag tag-canvas">SVG</span>
      <span class="project-tag">Puzzle</span>
    </div>
  </a>

  <a href="spot-the-differences/" class="project-card">
    <h3 class="project-title"><span data-lang-content="id">Cari Perbedaan Radar</span><span data-lang-content="en" hidden>Spot the Radar Differences</span></h3>
    <p class="project-desc"><span data-lang-content="id">Temukan zona dengan partikel berbeda pada dua radar. Game ini dilengkapi sistem skor dan tampilan radar yang responsif.</span><span data-lang-content="en" hidden>Find the zone with a different particle across two radar displays. The game features scoring and responsive radar visuals.</span></p>
    <div class="project-tags">
      <span class="project-tag tag-game"><span data-lang-content="id">Game</span><span data-lang-content="en" hidden>Game</span></span>
      <span class="project-tag tag-canvas">HTML5 Canvas</span>
    </div>
  </a>

  <a href="guessing-game/" class="project-card">
    <h3 class="project-title"><span data-lang-content="id">Game Tebak Kata</span><span data-lang-content="en" hidden>Word Guessing Game</span></h3>
    <p class="project-desc"><span data-lang-content="id">Tebak kata dari berbagai kategori dan tingkat kesulitan dengan bantuan petunjuk. Pertanyaan disimpan menggunakan enkripsi sandi Caesar.</span><span data-lang-content="en" hidden>Guess words across multiple categories and difficulty levels with the help of hints. Questions are stored using Caesar cipher encryption.</span></p>
    <div class="project-tags">
      <span class="project-tag tag-game"><span data-lang-content="id">Game</span><span data-lang-content="en" hidden>Game</span></span>
      <span class="project-tag"><span data-lang-content="id">Logika</span><span data-lang-content="en" hidden>Logic</span></span>
    </div>
  </a>

  <a href="number-guessing/" class="project-card">
    <h3 class="project-title"><span data-lang-content="id">Tebak Angka</span><span data-lang-content="en" hidden>Number Guessing</span></h3>
    <p class="project-desc"><span data-lang-content="id">Game logika bergaya Bulls and Cows. Tebak angka rahasia 4 digit dengan petunjuk jumlah angka dan posisi yang benar dalam beberapa percobaan.</span><span data-lang-content="en" hidden>A classic Bulls and Cows logic game. Guess the secret 4-digit number using clues about correct digits and positions over multiple attempts.</span></p>
    <div class="project-tags">
      <span class="project-tag tag-game"><span data-lang-content="id">Game</span><span data-lang-content="en" hidden>Game</span></span>
      <span class="project-tag">Bulls & Cows</span>
    </div>
  </a>

  <a href="my-memories/" class="project-card">
    <h3 class="project-title"><span data-lang-content="id">Kenangan-Ku</span><span data-lang-content="en" hidden>My Memories</span></h3>
    <p class="project-desc"><span data-lang-content="id">Game interaktif yang mengajakmu bermain sambil menjelajahi kenangan.</span><span data-lang-content="en" hidden>A fun, interactive game where you can play and explore memories.</span></p>
    <div class="project-tags">
      <span class="project-tag tag-game"><span data-lang-content="id">Game</span><span data-lang-content="en" hidden>Game</span></span>
      <span class="project-tag"><span data-lang-content="id">Hiburan</span><span data-lang-content="en" hidden>Fun</span></span>
    </div>
  </a>

  <a href="one-of-us/" class="project-card">
    <h3 class="project-title"><span data-lang-content="id">Tebak Spy</span><span data-lang-content="en" hidden>One of Us (Spy Guessing Game)</span></h3>
    <p class="project-desc"><span data-lang-content="id">Game deduksi sosial multipemain secara real-time. Temukan Spy di antara para pemain dengan kata rahasia yang dibuat AI.</span><span data-lang-content="en" hidden>A real-time multiplayer social deduction game. Find the Spy among the players using AI-generated secret words.</span></p>
    <div class="project-tags">
      <span class="project-tag tag-game"><span data-lang-content="id">Game</span><span data-lang-content="en" hidden>Game</span></span>
      <span class="project-tag tag-multiplayer"><span data-lang-content="id">Multipemain</span><span data-lang-content="en" hidden>Multiplayer</span></span>
      <span class="project-tag tag-ai">Gemini AI</span>
    </div>
  </a>
</div>

<p class="more-projects"><span data-lang-content="id">Proyek lainnya akan segera ditambahkan!</span><span data-lang-content="en" hidden>More projects will be added soon!</span></p>

<script src="./project-language.js" defer></script>
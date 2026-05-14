from pathlib import Path
out=Path('output')
out.mkdir(exist_ok=True)
html='''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Swami Vivekananda Tribute</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="hero">
    <div class="overlay"></div>
    <div class="hero-inner container">
      <p class="badge">Tribute Page</p>
      <h1>Swami Vivekananda</h1>
      <p class="hero-text">A monk, philosopher, and inspiring voice of strength, service, and self-belief.</p>
      <a class="hero-btn" href="#about">Explore His Life</a>
    </div>
  </header>

  <main class="container">
    <section class="intro-card glass">
      <img class="portrait" src="https://cdn.britannica.com/51/195551-050-9F66C031/Vivekananda-1897.jpg" alt="Swami Vivekananda" />
      <div>
        <h2>Why he inspires millions</h2>
        <p>Swami Vivekananda was a Hindu monk and a powerful teacher who introduced India’s spiritual wisdom to the world. His message of courage, discipline, and service continues to inspire students, leaders, and dreamers everywhere.</p>
      </div>
    </section>

    <section class="grid two-col" id="about">
      <article class="glass card">
        <h3>Early Life</h3>
        <p>Born in Kolkata in 1863, Narendranath Datta later became Swami Vivekananda. He showed sharp intelligence, curiosity, and a deep interest in spiritual questions from a young age. [web:10][web:12]</p>
      </article>
      <article class="glass card">
        <h3>Chicago Address</h3>
        <p>He gained global recognition after his famous address at the Parliament of Religions in Chicago in 1893, where he represented Hinduism and spoke about universal harmony. [web:13][web:16]</p>
      </article>
    </section>

    <section class="glass card quote-block">
      <h3>Famous Thought</h3>
      <p class="quote">“Arise, awake, and stop not until the goal is reached.”</p>
      <p class="source">— Swami Vivekananda [web:11][web:14]</p>
    </section>

    <section class="grid three-col">
      <article class="glass card highlight">
        <h3>Teachings</h3>
        <p>He taught strength, self-confidence, service to humanity, and the idea that each person has limitless inner power. [web:10][web:13]</p>
      </article>
      <article class="glass card highlight">
        <h3>Legacy</h3>
        <p>He remains one of India’s most respected spiritual leaders and an inspiration for youth across the world. [web:16][web:19]</p>
      </article>
      <article class="glass card highlight">
        <h3>Impact</h3>
        <p>His work helped establish the Ramakrishna Mission and spread Vedanta philosophy internationally. [web:13][web:16]</p>
      </article>
    </section>

    <section class="timeline glass card">
      <h3>Life Timeline</h3>
      <ul>
        <li><strong>1863:</strong> Born in Kolkata. [web:12][web:15]</li>
        <li><strong>1881:</strong> Met Sri Ramakrishna for the first time. [web:12][web:15]</li>
        <li><strong>1893:</strong> Spoke at the Parliament of Religions in Chicago. [web:12][web:16]</li>
        <li><strong>1902:</strong> Passed away at the age of 39. [web:10][web:16]</li>
      </ul>
    </section>
  </main>

  <footer class="footer">
    <p>Made with respect for Swami Vivekananda.</p>
  </footer>
</body>
</html>'''
css='''* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(180deg, #0f172a, #111827 50%, #1f2937);
  color: #f8fafc;
  line-height: 1.7;
}

.container {
  width: min(1100px, 92%);
  margin: 0 auto;
}

.hero {
  min-height: 88vh;
  position: relative;
  display: grid;
  place-items: center;
  text-align: center;
  background: url('https://cdn.britannica.com/51/195551-050-9F66C031/Vivekananda-1897.jpg') center top/cover no-repeat;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.62), rgba(2, 6, 23, 0.95));
}

.hero-inner {
  position: relative;
  z-index: 1;
  padding: 28px 0;
}

.badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.15);
  color: #fcd34d;
  margin-bottom: 18px;
  font-size: 0.85rem;
}

.hero h1 {
  font-size: clamp(2.8rem, 7vw, 5.5rem);
  margin-bottom: 14px;
}

.hero-text {
  max-width: 720px;
  margin: 0 auto 26px;
  color: #e2e8f0;
  font-size: 1.08rem;
}

.hero-btn {
  display: inline-block;
  padding: 14px 24px;
  border-radius: 14px;
  text-decoration: none;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  font-weight: 700;
}

.glass {
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.intro-card {
  margin-top: -60px;
  border-radius: 28px;
  padding: 24px;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  align-items: center;
}

.portrait {
  width: 100%;
  max-width: 220px;
  border-radius: 24px;
  justify-self: center;
}

.intro-card h2,
.card h3,
.timeline h3 {
  font-size: 1.6rem;
  margin-bottom: 12px;
}

.intro-card p,
.card p,
.timeline li,
.footer p {
  color: #dbeafe;
}

.grid {
  display: grid;
  gap: 22px;
  margin: 24px 0;
}

.two-col {
  grid-template-columns: repeat(2, 1fr);
}

.three-col {
  grid-template-columns: repeat(3, 1fr);
}

.card {
  border-radius: 24px;
  padding: 26px;
}

.quote-block {
  text-align: center;
}

.quote {
  font-size: 1.35rem;
  font-style: italic;
  margin: 10px 0 6px;
  color: #fef3c7;
}

.source {
  color: #cbd5e1;
}

.timeline ul {
  list-style: none;
  display: grid;
  gap: 12px;
}

.timeline li {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.timeline li:last-child {
  border-bottom: 0;
}

.footer {
  text-align: center;
  padding: 30px 0 40px;
  color: #cbd5e1;
}

@media (max-width: 850px) {
  .intro-card,
  .two-col,
  .three-col {
    grid-template-columns: 1fr;
  }

  .intro-card {
    text-align: center;
  }
}
'''
readme='''# Swami Vivekananda Tribute Page

A responsive tribute website dedicated to Swami Vivekananda.

## Files
- `index.html`
- `style.css`

## How to run
1. Place both files in the same folder.
2. Open `index.html` in your browser.

## Features
- Hero section with background image
- Biography sections
- Quote highlight
- Timeline of important events
- Responsive design
'''
(out/'index.html').write_text(html,encoding='utf-8')
(out/'style.css').write_text(css,encoding='utf-8')
(out/'README.md').write_text(readme,encoding='utf-8')
print('done')
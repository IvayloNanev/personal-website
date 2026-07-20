"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ReelKey = "opening" | "builder" | "bring" | "work" | "process" | "capabilities" | "contact";

const reels: { key: ReelKey; number: string; label: string }[] = [
  { key: "opening", number: "01", label: "Opening" },
  { key: "builder", number: "02", label: "The Builder" },
  { key: "bring", number: "03", label: "What I Bring" },
  { key: "work", number: "04", label: "Selected Work" },
  { key: "process", number: "05", label: "My Process" },
  { key: "capabilities", number: "06", label: "Capabilities" },
  { key: "contact", number: "07", label: "Contact" },
];

const projects = [
  {
    title: "AI Strategy for Independent Coffee Shops",
    category: "AI Strategy • Product Thinking",
    image: "/projects/coffee-ai.webp",
    alt: "Specialty coffee cup surrounded by subtle AI strategy and analytics displays",
    description: "An AI adoption strategy for an independent coffee shop, identifying practical opportunities to improve customer experience, streamline daily operations, and support long-term growth.",
    technologies: "AI Strategy • Business Analysis • UX Thinking • Customer Experience",
    contribution: "Business analysis • AI opportunity mapping • Customer journey improvements • Implementation roadmap",
  },
  {
    title: "Cinematic Portfolio",
    category: "UX/UI Design • Front-End Development",
    image: "/projects/cinematic-portfolio.webp",
    alt: "Cinematic developer portfolio presented on a dark studio laptop",
    description: "A cinematic developer portfolio inspired by luxury brands, editorial layouts, and immersive digital storytelling—built around refined typography, interaction, and subtle motion.",
    technologies: "Next.js • React • Tailwind CSS • GSAP",
    contribution: "UI/UX design • Front-end development • Motion design • Responsive implementation",
  },
  {
    title: "Vintage Unit Converter",
    category: "Front-End Development",
    image: "/projects/vintage-converter.webp",
    alt: "Vintage Unit Converter presented across laptop, tablet, and phone devices",
    description: "A responsive conversion tool that transforms a simple utility into a polished experience through custom visual design, clear feedback, and considered interaction.",
    technologies: "HTML • CSS • JavaScript",
    contribution: "UI design • JavaScript logic • Responsive layout • User interaction design",
  },
];

const builder = [
  ["AI", "Building intelligent products that reduce friction, uncover possibilities, and solve real problems without losing human judgment."],
  ["Design", "Crafting elegant interfaces where hierarchy, rhythm, motion, and feedback guide attention with purpose."],
  ["Product", "Connecting strategy, design, and engineering to turn ambitious ideas into useful, resilient products."],
];

const bring = [
  ["Strategic Thinking", "Understanding problems before building solutions."],
  ["AI-Native Development", "Accelerating research, design, prototyping, and development."],
  ["Human-Centered Design", "Creating intuitive, accessible, emotionally engaging interfaces."],
  ["Engineering Excellence", "Building reliable, scalable, maintainable digital products."],
  ["Clear Communication", "Bridging technical ideas and business goals."],
  ["Continuous Learning", "Adapting quickly and constantly refining the craft."],
];

const process = [
  ["Discover", "Understand the problem, users, and business goals."],
  ["Define", "Clarify priorities and establish a clear direction."],
  ["Design", "Shape thoughtful interfaces and interaction systems."],
  ["Build", "Develop reliable products with modern, AI-assisted workflows."],
  ["Refine", "Test, iterate, and polish until every detail feels intentional."],
];

const capabilities = [
  ["AI & Product Strategy", "OpenAI • Prompt Engineering • AI Workflows • Product Strategy"],
  ["Front-End Development", "HTML • CSS • JavaScript • React • Next.js • Tailwind CSS"],
  ["Design & Experience", "Figma • UX Research • UI Design • Prototyping • Motion Design"],
  ["Collaboration & Workflow", "Git • GitHub • VS Code • Codex • Agile • Documentation"],
];

function Reel({ active, moving, index }: { active: boolean; moving: boolean; index: number }) {
  return (
    <span className={`reel-object ${active ? "is-loaded" : ""} ${moving ? "is-moving" : ""}`} aria-hidden="true">
      <svg className="machine-sketch" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" className="construction" />
        <circle cx="50" cy="50" r="5" />
        {index === 0 && <><circle cx="50" cy="50" r="25" /><path d="M50 25v50M25 50h50M32 32l36 36M68 32 32 68" /></>}
        {index === 1 && <><path d="M13 58c17-26 57-33 75-5-27-10-48-6-75 5Z" /><path d="M20 56 9 72m25-20-4 25m20-29v31m16-29 6 26m7-21 12 17" /></>}
        {index === 2 && <><circle cx="38" cy="53" r="20" /><circle cx="68" cy="42" r="14" /><path d="M38 27v8m0 36v8M12 53h8m36 0h8m4-29v6m0 24v6M50 42h4m28 0h5" /></>}
        {index === 3 && <><path d="M15 61h70L73 39H29L15 61Z" /><circle cx="30" cy="64" r="12" /><circle cx="70" cy="64" r="12" /><path d="M38 39 50 19l12 20M50 19v42" /></>}
        {index === 4 && <><path d="M13 68h74M20 68c12-38 48-38 60 0M26 58h48M34 45l-8 23m40-23 8 23M50 34v34" /></>}
        {index === 5 && <><path d="M20 76V27h39M33 27v49M20 42h13m-13 17h13M59 27l22 12-31 11M81 39 68 75" /><circle cx="68" cy="78" r="6" /></>}
        {index === 6 && <><path d="M50 18c21 0 32 15 32 32S68 82 50 82 18 68 18 50c0-13 10-23 23-23 14 0 24 10 24 23 0 10-7 17-16 17-8 0-14-6-14-14 0-6 5-11 11-11 5 0 9 4 9 9" /></>}
      </svg>
    </span>
  );
}

function ChapterLabel({ number, children }: { number: string; children: React.ReactNode }) {
  return <p className="chapter-label"><span>{number}</span>{children}</p>;
}

function ProjectScene({ scene, setScene }: { scene: number; setScene: (index: number) => void }) {
  const project = projects[scene];
  return (
    <div className="project-scene">
      <div className="project-image-wrap">
        <img src={project.image} alt={project.alt} />
        <span className="image-burn" aria-hidden="true" />
      </div>
      <div className="project-copy">
        <p className="eyebrow">{project.category}</p>
        <h2>{project.title}</h2>
        <p className="project-description">{project.description}</p>
        <dl>
          <div><dt>Technologies & Skills</dt><dd>{project.technologies}</dd></div>
          <div><dt>My Contributions</dt><dd>{project.contribution}</dd></div>
        </dl>
      </div>
      <div className="scene-controls" aria-label="Project scenes">
        {projects.map((item, index) => (
          <button key={item.title} onClick={() => setScene(index)} className={scene === index ? "is-active" : ""} aria-label={`Show ${item.title}`} aria-pressed={scene === index}>
            <span>0{index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectedChapter({ chapter, scene, setScene }: { chapter: ReelKey; scene: number; setScene: (index: number) => void }) {
  if (chapter === "opening") return (
    <div className="chapter opening-chapter">
      <ChapterLabel number="01">Opening · 2026</ChapterLabel>
      <p className="opening-name">Ivaylo Nanev</p>
      <h1><span>Every great product</span><span>starts with an idea.</span><em>I build the rest.</em></h1>
      <p className="opening-role">AI Product Designer<br />& Software Engineer</p>
    </div>
  );

  if (chapter === "builder") return (
    <div className="chapter text-chapter">
      <ChapterLabel number="02">Featured</ChapterLabel>
      <header className="chapter-intro"><h2>The Builder</h2><p>I build digital products where artificial intelligence, design, and engineering work together. Every interaction is intentional and every product is designed to create an experience people remember.</p></header>
      <div className="three-grid">{builder.map(([title, copy], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </div>
  );

  if (chapter === "bring") return (
    <div className="chapter text-chapter">
      <ChapterLabel number="03">Capability</ChapterLabel>
      <header className="chapter-intro compact"><h2>What I Bring</h2><p>Strategic thinking, design sensitivity, and engineering discipline—combined to create products that are intuitive, impactful, and built to last.</p></header>
      <div className="six-grid">{bring.map(([title, copy], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </div>
  );

  if (chapter === "work") return (
    <div className="chapter work-chapter">
      <ChapterLabel number="04">Selected Work · Scene 0{scene + 1}</ChapterLabel>
      <ProjectScene scene={scene} setScene={setScene} />
    </div>
  );

  if (chapter === "process") return (
    <div className="chapter text-chapter process-chapter">
      <ChapterLabel number="05">Process</ChapterLabel>
      <header className="chapter-intro compact"><h2>My Process</h2><p>Understanding the problem first, designing with intention, and delivering solutions that feel both functional and refined.</p></header>
      <ol className="process-strip">{process.map(([title, copy], i) => <li key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
    </div>
  );

  if (chapter === "capabilities") return (
    <div className="chapter text-chapter">
      <ChapterLabel number="06">Capabilities</ChapterLabel>
      <header className="chapter-intro compact"><h2>Capabilities</h2><p>Thoughtful strategy, elegant design, and reliable engineering—developed and refined as one connected practice.</p></header>
      <div className="capability-grid">{capabilities.map(([title, items], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{items}</p></article>)}</div>
    </div>
  );

  return (
    <div className="chapter contact-chapter">
      <ChapterLabel number="07">Contact · Final Frame</ChapterLabel>
      <div className="contact-main"><p className="eyebrow">Currently open to new opportunities</p><h2>Let&apos;s Build<br /><em>Together.</em></h2><p>Whether you&apos;re building a product, exploring an AI opportunity, or looking for a thoughtful collaborator, great work begins with a conversation.</p><a href="mailto:ethannanev@gmail.com?subject=Let's%20build%20together">Start the conversation <span>↗</span></a></div>
      <nav className="contact-list" aria-label="Contact links">
        <a href="mailto:ethannanev@gmail.com"><span>Email</span><strong>ethannanev@gmail.com</strong></a>
        <a href="https://www.linkedin.com/in/dr-ethan-nanev-67620688/" target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>Connect professionally ↗</strong></a>
        <a href="https://github.com/IvayloNanev" target="_blank" rel="noreferrer"><span>GitHub</span><strong>Explore my code ↗</strong></a>
      </nav>
      <div className="availability"><span className="status-dot" />Open to AI Product Development, Front-End Engineering, UX / Product Design, and Creative Technology.</div>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [movingReel, setMovingReel] = useState<number | null>(null);
  const [scene, setScene] = useState(0);
  const [changing, setChanging] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);

  const loadReel = useCallback((index: number) => {
    if (index === active || changing) return;
    setChanging(true);
    setMovingReel(index);
    window.setTimeout(() => { setActive(index); setScene(0); }, 230);
    window.setTimeout(() => {
      setChanging(false);
      setMovingReel(null);
    }, 780);
  }, [active, changing]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight"].includes(event.key)) loadReel((active + 1) % reels.length);
      if (["ArrowUp", "ArrowLeft"].includes(event.key)) loadReel((active - 1 + reels.length) % reels.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, loadReel]);

  const toggleSound = () => {
    if (soundOn) {
      audioRef.current?.close();
      audioRef.current = null;
      setSoundOn(false);
      return;
    }
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = new AudioCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.value = 47;
    gain.gain.value = 0.018;
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    audioRef.current = context;
    setSoundOn(true);
  };

  return (
    <main className="picture-house">
      <div className="projector-beam" aria-hidden="true" />
      <header className="topbar">
        <a href="#top" className="identity"><strong>IN</strong><span>Ivaylo Nanev</span></a>
        <p>Atelier Codex <span>•</span> Studies in Motion</p>
        <button className="sound-control" onClick={toggleSound} aria-pressed={soundOn}><i className={soundOn ? "is-on" : ""} />{soundOn ? "Workshop On" : "Workshop Hum"}</button>
      </header>

      <section className="projector-stage" id="top">
        <aside className="reel-shelf left-shelf" aria-label="Portfolio reels">
          {reels.map((reel, index) => <button className={`reel-control ${active === index ? "is-active" : ""}`} key={reel.key} onClick={() => loadReel(index)} aria-pressed={active === index}><span className="reel-meta"><b>{reel.number}</b>{reel.label}</span><Reel active={active === index} moving={movingReel === index} index={index} /></button>)}
        </aside>

        <div className="projection-unit">
          <div className="film-edge top-edge" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} />)}</div>
          <article className={`projection-screen ${changing ? "is-changing" : ""}`}>
            <div className="film-grain" aria-hidden="true" />
            <div className="scratches" aria-hidden="true" />
            <div className="codex-overlay" aria-hidden="true">
              <span className="measure measure-top">⅓ · ⅔ · proporzione</span>
              <span className="measure measure-side">motus perpetuus · fol. {reels[active].number}</span>
              <span className="codex-note note-a">la luce rivela<br />la forma</span>
              <span className="codex-note note-b">studio del moto</span>
              <i className="compass-arc" />
              <i className="construction-axis axis-x" />
              <i className="construction-axis axis-y" />
            </div>
            <ProjectedChapter chapter={reels[active].key} scene={scene} setScene={setScene} />
            <span className="frame-counter">FOLIO {reels[active].number} · STUDY {String(active + 1).padStart(2, "0")}</span>
          </article>
          <div className="film-edge bottom-edge" aria-hidden="true">{Array.from({ length: 9 }).map((_, i) => <i key={i} />)}</div>
        </div>

      </section>

      <footer className="bottombar"><p>Designed & built by Ivaylo Nanev</p><p><span>←</span> Select a mechanism or use arrow keys <span>→</span></p><p>Folio {reels[active].number} / 07 · {reels[active].label}</p></footer>
    </main>
  );
}

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import photo from './assets/bharath.webp';

/* ---------- CONTENT: edit this block to change the site ---------- */
const EMAIL = 'ybharathkumar2006@gmail.com';
const GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encodeURIComponent('Hello Bharath')}`;
const GITHUB = 'https://github.com/bharath609';
const LINKEDIN = 'https://www.linkedin.com/in/y-bharath-kumar-5990b4263/';
const WHATSAPP = `https://wa.me/918519828505?text=${encodeURIComponent('Hello Bharath')}`;
const PHOTO = photo;
const RESUME = import.meta.env.VITE_RESUME || `${import.meta.env.BASE_URL}resume.pdf`;

const projects = [
  { t: 'React · Operations research', h: 'optisolver.ai',
    d: 'An AI-powered operations research tool that turns plain-English planning problems into mathematically optimal decisions in seconds.',
    b: ['Built a browser-based solver for production planning, transportation, and game-theory problems using natural-language input.',
        'Combined AI model selection with the HiGHS optimization solver to return optimal quantities, costs, utilization, and reasoning.',
        'Designed a no-signup experience for manufacturing, logistics, retail planning, studios, agencies, and founders.'],
    s: ['React', 'FastAPI', 'HiGHS', 'Operations research'], f: ['Describe', 'Model', 'Optimize', 'Decide'], href: 'https://optiforge-ai.vercel.app/', linkLabel: 'Open live site ↗' },
  { t: 'Java · Desktop app', h: 'Live Score Board Application',
    d: 'A Java scoreboard that manages and shows real-time game scores through an interactive Swing interface.',
    b: ['Developed a Java-based scoreboard application to manage and display real-time game scores.',
        'Built an interactive, user-friendly interface using Java Swing, OOP concepts and event handling.',
        'Delivered dynamic score updates, with problem solving and debugging through end-to-end implementation.'],
    s: ['Java', 'Swing', 'OOP', 'Event handling'], f: ['Input score', 'Event', 'Update', 'Display'] },
  { t: 'Python · Billing', h: 'Grocery Store Billing System',
    d: 'A billing app that calculates subtotals and taxes, and generates timestamped receipts as items are picked.',
    b: ['Calculates subtotals and taxes, and generates timestamped receipts.',
        'Real-time item selection, dynamic quantity input and total computation.',
        'Full-cycle development with user-centric design principles.'],
    s: ['Python', 'Billing logic', 'Receipts'], f: ['Select item', 'Quantity', 'Subtotal + tax', 'Receipt'] },
];
const jobs = [
  { y: '6 weeks', r: 'Cyber Security Intern', c: 'IBM SkillsBuild',
    p: ['Explored cyber threat models, vulnerability assessments and basic encryption techniques', 'Built a steganography project to secure messages within images'] },
  { y: '12 weeks', r: 'AI Quality Data Analyst Intern', c: 'IBM',
    p: ['Assessed AI model performance and identified data inconsistencies', 'Worked with cross-functional teams to improve training dataset quality'] },
];
const education = [
  ['New Horizon College of Engineering', 'B.E., Information Science and Engineering · Bangalore', '2021–2025', 'CGPA 8.24'],
  ['Sri Gayatri Junior College', 'Class 12 · Intermediate · Vijayawada', '2019–2021', 'CGPA 9.62'],
  ['Saraswathi High School', 'Class 10 · Secondary · Uppugundur', '2019', 'CGPA 9.5'],
];
const stats = [['8.24', 'Degree CGPA'], ['2', 'IBM internships'], ['4', 'Certifications'], ['3', 'Projects']];
const skills = [
  ['Languages', ['Java', 'Python']],
  ['Web and frameworks', ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Spring Boot']],
  ['Cloud and data', ['Azure Cloud', 'VMware', 'MySQL']],
  ['AI and prompting', ['Prompt engineering', 'LLM basics', 'RAG', 'Model evaluation']],
  ['Tools and platforms', ['GitHub', 'VS Code', 'Eclipse IDE']],
];
const certs = [
  ['Udemy', 'Front End Development (HTML5, CSS3, JavaScript)'],
  ['Great Learning', 'Data Analytics using Excel and Python'],
  ['CVCORP', 'Full Stack Java Development'],
  ['Columbia+', 'Prompt Engineering & Programming with OpenAI'],
];
const steps = ['Understand', 'Design', 'Build', 'Test', 'Debug', 'Deliver'];
const marquee = ['Front End Development', 'Data Analytics', 'Full Stack Java', 'Prompt Engineering'];
const soft = ['Adaptability', 'Time management', 'Communication', 'Teamwork'];

/* ---------- small pieces ---------- */
const go = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
const Ext = ({ href, className = 'btn', children }) => (
  <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
);
const Flow = ({ items }) => items.map((x, i) => (
  <Fragment key={x}>{i > 0 && <span className="fa">→</span>}<div className="fn">{x}</div></Fragment>
));
const Chips = ({ items }) => <>{items.map((x) => <span className="chip" key={x}>{x}</span>)}</>;

function Modal({ p, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    addEventListener('keydown', esc);
    return () => { document.body.style.overflow = ''; removeEventListener('keydown', esc); };
  }, [onClose]);
  return (
    <div className="mb" onClick={onClose}>
      <div className="mo" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose} autoFocus>Close ×</button>
        <div className="ct">{p.t}</div>
        <h2>{p.h}</h2>
        {p.b.map((x) => <p key={x}>• {x}</p>)}
        <div className="fl"><Flow items={p.f} /></div>
        <div className="chips"><Chips items={p.s} /></div>
         <Ext href={p.href || GITHUB}>{p.linkLabel || 'More on GitHub ↗'}</Ext>
      </div>
    </div>
  );
}

/* ---------- page ---------- */
function App() {
  const [hidden, setHidden] = useState(false);
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState(null);
  const rail = useRef(null);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => { const y = scrollY; setHidden(y > 80 && y > last.current); last.current = y; };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = rail.current;
    const onWheel = (e) => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0 || innerWidth <= 960 || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      const s = el.scrollLeft;
      if ((e.deltaY > 0 && s < max - 1) || (e.deltaY < 0 && s > 1)) { e.preventDefault(); el.scrollLeft += e.deltaY; }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const nav = (id) => { go(id); setMenu(false); };

  return (
    <>
      <div className="grain" />
      <header className={`nav ${hidden ? 'hide' : ''}`}>
        <button className="brand" onClick={() => nav('#home')} aria-label="Back to top"><i />Y Bharath Kumar</button>
        <nav className={`links ${menu ? 'open' : ''}`}>
          <button onClick={() => nav('#about')}>About</button>
          <button onClick={() => nav('#intern')}>Internships</button>
          <button onClick={() => nav('#work')}>Projects</button>
          <button onClick={() => nav('#skills')}>Skills</button>
          <button className="cta" onClick={() => nav('#contact')}>Let's talk ↗</button>
        </nav>
        <button className="burger" aria-label="Menu" onClick={() => setMenu(!menu)}><span /><span /></button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="ghost" aria-hidden="true">BHARATH</div>
          <figure className="stage">
            <div className="core"><div className="glow" /><div className="ring r2" /><div className="ring r1" />
            <svg className="wires" viewBox="0 0 100 100" aria-hidden="true">{[[10.7, 22.5], [50, 2], [89.3, 22.5], [89.3, 77.5], [10.7, 77.5]].map(([x, y]) => <line key={`${x}-${y}`} x1={x} y1={y} x2="50" y2="50" />)}</svg>
            <div className="orb"><div className="pic"><img src={PHOTO} alt="Portrait of Y Bharath Kumar" width="560" height="734" /></div></div></div>
            <div className="node n5">Prompt engineering<small>LLMs · RAG · AI basics</small></div>
            <div className="node n1">Java<small>Spring Boot</small></div>
            <div className="node n2">React.js<small>HTML · CSS · JS</small></div>
            <div className="node n3">Azure<small>Cloud · VMware</small></div>
            <div className="node n4">Python<small>Data analytics</small></div>
          </figure>
          <div className="hl">
            <p className="tag">Full-stack developer · B.E. Information Science</p>
            <h1>Turning ideas into <em>intelligent software.</em></h1>
          </div>
          <div className="info">
            <p className="lede">Java, Python and React developer who also works with AI: prompt engineering, LLM basics and AI-assisted building. Two IBM internships, in cybersecurity and in AI data quality.</p>
            <div className="act">
              <div className="row">
                <button className="btn solid" onClick={() => go('#work')}>See my projects ↓</button>
                <button className="btn" onClick={() => nav('#contact')}>Let&apos;s talk ↗</button>
              </div>
              <p className="status"><i />Open to full-time developer roles</p>
            </div>
          </div>
        </section>

        <section className="alt" id="about">
          <div className="lab">About me</div>
          <div className="about">
            <div>
              <h2>Learning fast. <em>Building steady.</em></h2>
              <p>I'm an Information Science and Engineering graduate (B.E., 2021–2025) who enjoys turning ideas into working software, from Java desktop apps to Python tools and React front-ends.</p>
              <p>My IBM internships added two habits I rely on: thinking about security before shipping, and checking that data is trustworthy before drawing conclusions from it.</p>
            </div>
            <div>
              <div className="edu">
                {education.map(([n, d, y, g]) => (
                  <div key={n}><p><b>{n}</b><span>{d}</span></p><div className="yr">{y}<br />{g}</div></div>
                ))}
              </div>
              <div className="stats">{stats.map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
            </div>
          </div>
        </section>

        <section id="intern">
          <div className="lab">Internships</div>
          <h2>Hands-on, <em>from the start.</em></h2>
          <div className="tl">
            {jobs.map((j) => (
              <article className="ti" key={j.r}>
                <div className="ty">{j.y}</div><div className="td" />
                <div className="tb"><h3>{j.r}</h3><h4>{j.c}</h4>{j.p.map((x) => <p key={x}>{x}</p>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="alt">
          <div className="lab">How I work</div>
          <div className="sig">
            <div><small>From idea</small><h2>to interface.</h2></div>
            <div className="ar">→</div>
            <div><small>From data</small><h2>to decisions.</h2></div>
          </div>
          <div className="pipe">{steps.map((x, i) => <div key={x}><span>0{i + 1}</span><b>{x}</b></div>)}</div>
        </section>

        <section id="work">
          <div className="lab">Projects</div>
          <h2>Built to be <em>used.</em></h2>
          <div className="rail" ref={rail}>
            {projects.map((p, i) => (
              <article className="card" key={p.h}>
                <div className="vis"><Flow items={p.f} /></div>
                <div className="cb">
                  <div className="ct">{p.t}</div><h3>{p.h}</h3><p>{p.d}</p>
                  <div className="chips"><Chips items={p.s} /></div>
                  <button className="more" onClick={() => setOpen(i)}>View details<span>↗</span></button>
                </div>
              </article>
            ))}
          </div>
          <div className="hint"><span>Scroll sideways to see all projects</span><span>→ → →</span></div>
        </section>

        <section className="alt" id="skills">
          <div className="lab">Skills</div>
          <h2>Tools I <em>work with.</em></h2>
          <div className="skills">
            {skills.map(([g, items], i) => <div className="sg" key={g}><span className="num">0{i + 1}</span><h3>{g}</h3><div className="chips"><Chips items={items} /></div></div>)}
          </div>
          <div className="soft"><b>Soft skills</b>{soft.map((x) => <span key={x}>{x}</span>)}</div>
        </section>

        <section>
          <div className="lab">Certifications</div>
          <div className="mq"><div className="mt">{[...marquee, ...marquee].map((w, i) => <span key={i}>{w}</span>)}</div></div>
          <div className="certs">{certs.map(([a, b]) => <div className="cert" key={b}><span>{a}</span><b>{b}</b></div>)}</div>
        </section>

        <section className="contact" id="contact">
          <div className="bg" aria-hidden="true">SAY HELLO</div>
          <div className="ci">
            <div className="lab">Contact</div>
            <h2>Let's build <em>something useful.</em></h2>
            <p>I'm looking for my first full-time role in software development. If your team works with Java, Python, full-stack web or cloud, I'd love to hear from you.</p>
            <div className="row">
              <Ext className="btn solid" href={GMAIL}>Email me ↗</Ext>
              <Ext href={GITHUB}>GitHub ↗</Ext>
              <Ext href={LINKEDIN}>LinkedIn ↗</Ext>
              <Ext href={RESUME}>Resume ↗</Ext>
              <Ext href={WHATSAPP}>WhatsApp ↗</Ext>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <b>Y Bharath Kumar</b>
        <span><a href={GMAIL} target="_blank" rel="noopener noreferrer">Email</a> · <a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a> · <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a> · © 2026</span>
      </footer>
      {open !== null && <Modal p={projects[open]} onClose={() => setOpen(null)} />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

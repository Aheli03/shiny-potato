// ============================================================
//  PORTFOLIO STUDIO — script.js
// ============================================================

// ---- Default projects ----
let projects = [
  {
    title: 'Bloom Design System',
    desc: 'A comprehensive component library built for accessibility and delight.',
    tags: 'Figma, React, Storybook',
    emoji: '🌸',
    link: 'https://github.com/'
  },
  {
    title: 'Lumina App',
    desc: 'A mood-tracking app with beautiful micro-animations and daily insights.',
    tags: 'React Native, Motion, Firebase',
    emoji: '✨',
    link: 'https://github.com/'
  },
  {
    title: 'Palette Generator',
    desc: 'AI-powered color palette tool that generates harmonious pastel schemes.',
    tags: 'Vue, CSS, OpenAI',
    emoji: '🎨',
    link: 'https://github.com/'
  }
];

// ---- Skill colours (cycling) ----
const pillColors = [
  { bg: 'rgba(249,168,212,0.18)', border: 'rgba(249,168,212,0.45)', color: '#be185d' },
  { bg: 'rgba(196,181,253,0.18)', border: 'rgba(196,181,253,0.45)', color: '#6d28d9' },
  { bg: 'rgba(110,231,183,0.18)', border: 'rgba(110,231,183,0.45)', color: '#065f46' },
  { bg: 'rgba(253,211,77,0.18)',  border: 'rgba(253,211,77,0.45)',  color: '#92400e' },
  { bg: 'rgba(147,197,253,0.18)', border: 'rgba(147,197,253,0.45)', color: '#1e40af' },
  { bg: 'rgba(254,205,211,0.18)', border: 'rgba(254,205,211,0.45)', color: '#9f1239' },
];

// ============================================================
//  CUSTOM CURSOR
// ============================================================
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  trailX += (e.clientX - trailX) * 0.12;
  trailY += (e.clientY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
});

// Smooth trail loop
function animTrail() {
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animTrail);
}
animTrail();

// ============================================================
//  ACCENT COLOR SYNC
// ============================================================
document.getElementById('e-accent').addEventListener('input', e => {
  document.documentElement.style.setProperty('--accent', e.target.value);
});

// ============================================================
//  EDITOR: PROJECT LIST
// ============================================================
function renderProjectList() {
  const container = document.getElementById('projects-list');
  container.innerHTML = '';
  projects.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'project-item';
    div.innerHTML = `
      <button class="remove-proj" onclick="removeProject(${i})" title="Remove">✕</button>
      <input class="field" type="text" placeholder="Project title" value="${p.title}" oninput="projects[${i}].title=this.value" />
      <textarea class="field" placeholder="Short description" rows="2" oninput="projects[${i}].desc=this.value">${p.desc}</textarea>
      <input class="field" type="text" placeholder="Tags (comma-sep)" value="${p.tags}" oninput="projects[${i}].tags=this.value" />
      <input class="field" type="text" placeholder="Emoji icon" value="${p.emoji}" oninput="projects[${i}].emoji=this.value" />
      <input class="field" type="text" placeholder="Link URL" value="${p.link}" oninput="projects[${i}].link=this.value" />
    `;
    container.appendChild(div);
  });
}

function addProject() {
  projects.push({ title: 'New Project', desc: 'Describe your project here.', tags: 'Tag1, Tag2', emoji: '🚀', link: 'https://github.com/' });
  renderProjectList();
}

function removeProject(i) {
  projects.splice(i, 1);
  renderProjectList();
}

// ============================================================
//  GENERATE PORTFOLIO
// ============================================================
function generatePortfolio() {
  const name    = document.getElementById('e-name').value.trim()    || 'Your Name';
  const role    = document.getElementById('e-role').value.trim()    || 'Your Role';
  const bio     = document.getElementById('e-bio').value.trim()     || '';
  const avatar  = document.getElementById('e-avatar').value.trim()  || '?';
  const skills  = document.getElementById('e-skills').value.trim()  || '';
  const email   = document.getElementById('e-email').value.trim()   || '';
  const github  = document.getElementById('e-github').value.trim()  || '';
  const linkedin= document.getElementById('e-linkedin').value.trim()|| '';

  // Page title
  document.getElementById('page-title').textContent = name + ' — Portfolio';

  // Nav
  document.getElementById('nav-name').textContent = name;

  // Hero
  document.getElementById('p-name').textContent   = name;
  document.getElementById('p-role').textContent   = role;
  document.getElementById('p-bio').textContent    = bio;
  document.getElementById('p-avatar').textContent = avatar;

  // Skills
  const skillsEl = document.getElementById('p-skills');
  skillsEl.innerHTML = '';
  skills.split(',').map(s => s.trim()).filter(Boolean).forEach((s, i) => {
    const pill = document.createElement('span');
    pill.className = 'skill-pill reveal';
    const c = pillColors[i % pillColors.length];
    pill.style.background   = c.bg;
    pill.style.borderColor  = c.border;
    pill.style.color        = c.color;
    pill.style.animationDelay = (i * 0.07) + 's';
    pill.textContent = s;
    skillsEl.appendChild(pill);
  });

  // Projects
  const projEl = document.getElementById('p-projects');
  projEl.innerHTML = '';
  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.style.animationDelay = (i * 0.1) + 's';
    const tags = p.tags.split(',').map(t => `<span class="card-tag">${t.trim()}</span>`).join('');
    card.innerHTML = `
      <span class="card-emoji">${p.emoji || '🚀'}</span>
      <div class="card-title">${p.title}</div>
      <div class="card-desc">${p.desc}</div>
      <div class="card-tags">${tags}</div>
      ${p.link ? `<a href="${p.link}" target="_blank" class="card-link">View project →</a>` : ''}
    `;
    projEl.appendChild(card);
  });

  // Contact
  document.getElementById('p-contact-sub').textContent = `Have a project in mind? Drop me a message at ${email || 'your email'}.`;
  const linksEl = document.getElementById('p-contact-links');
  linksEl.innerHTML = '';
  if (email) {
    linksEl.innerHTML += `<a href="mailto:${email}" class="contact-link">✉ Email me</a>`;
  }
  if (github) {
    linksEl.innerHTML += `<a href="${github}" target="_blank" class="contact-link">⌨ GitHub</a>`;
  }
  if (linkedin) {
    linksEl.innerHTML += `<a href="${linkedin}" target="_blank" class="contact-link">☞ LinkedIn</a>`;
  }

  // Footer
  document.getElementById('p-footer-name').textContent = name;

  // Re-trigger scroll reveal
  setTimeout(initReveal, 100);
}

// ============================================================
//  EDITOR TOGGLE
// ============================================================
function toggleEditor() {
  const panel     = document.getElementById('editor-panel');
  const portfolio = document.getElementById('portfolio');
  const nav       = document.getElementById('nav');

  panel.classList.toggle('hidden');
  portfolio.classList.toggle('full-width');
  nav.classList.toggle('full-width');
}

// ============================================================
//  SCROLL REVEAL (Intersection Observer)
// ============================================================
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}

// ============================================================
//  NAV SCROLL HIGHLIGHT
// ============================================================
const sections = ['about', 'skills', 'work', 'contact'];
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--text)' : '';
  });
});

// ============================================================
//  INIT
// ============================================================
renderProjectList();
generatePortfolio();
initReveal();
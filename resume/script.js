// ============================================================
//  AHELI DATTA — Portfolio  |  script.js
// ============================================================

// ---- Custom Cursor ----
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  tx += (e.clientX - tx) * 0.12;
  ty += (e.clientY - ty) * 0.12;
});

(function trailLoop() {
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top  = ty + 'px';
  requestAnimationFrame(trailLoop);
})();

// Grow cursor on interactive elements
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '22px';
    cursor.style.height = '22px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
  });
});

// ---- Photo Upload ----
function handlePhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img     = document.getElementById('avatar-img');
    const initials = document.getElementById('avatar-initials');
    const removeBtn = document.getElementById('remove-photo-btn');

    img.src = e.target.result;
    img.style.display = 'block';
    initials.style.display = 'none';

    // Show remove button
    if (!removeBtn) {
      const btn = document.createElement('button');
      btn.id = 'remove-photo-btn';
      btn.title = 'Remove photo';
      btn.textContent = '✕';
      btn.style.cssText = 'position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:white;border:1.5px solid rgba(200,170,200,.22);font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(180,140,180,.2);z-index:10;color:#7c6f7d;transition:color .2s;';
      btn.onclick = removePhoto;
      document.getElementById('avatar-wrap').appendChild(btn);
    } else {
      removeBtn.style.display = 'flex';
    }

    // Update upload hint text
    document.querySelector('.upload-hint span:last-child').textContent = 'Change photo';
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  const img      = document.getElementById('avatar-img');
  const initials = document.getElementById('avatar-initials');
  const btn      = document.getElementById('remove-photo-btn');

  img.src = '';
  img.style.display = 'none';
  initials.style.display = 'block';
  if (btn) btn.style.display = 'none';
  document.getElementById('photo-input').value = '';
  document.querySelector('.upload-hint span:last-child').textContent = 'Click to upload photo';
}

// ---- Scroll Reveal (Intersection Observer) ----
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ---- Nav active link highlight on scroll ----
const navSections = ['about', 'skills', 'work', 'education', 'contact'];
window.addEventListener('scroll', () => {
  let current = '';
  navSections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 150) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    const isActive = a.getAttribute('href') === '#' + current;
    a.style.color = isActive ? 'var(--text)' : '';
    if (isActive) {
      a.style.setProperty('--underline-w', '100%');
    }
  });
});

// ---- Stagger pill animations ----
document.querySelectorAll('.skill-pill').forEach((pill, i) => {
  pill.style.animationDelay = (i * 0.06) + 's';
});

// ---- Init ----
initReveal();
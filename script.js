const loader = document.getElementById('loader');
setTimeout(() => {
  loader.classList.add('hide');
  document.body.style.overflow = '';
}, 2800);

document.body.style.overflow = 'hidden';
loader.addEventListener('transitionend', () => loader.remove());

const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .book-cover').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorRing.style.opacity = '1';
});

window.addEventListener('scroll', () => {
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const prog = (window.scrollY / docH) * 100;
  document.getElementById('progress-bar').style.width = prog + '%';
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

async function handleSubmit(e) {
  e.preventDefault();

  const btn  = document.getElementById('rec-submit');
  const form = document.getElementById('rec-form');

  btn.disabled = true;
  btn.innerHTML = 'Enviando... <span>⏳</span>';

  const data = new FormData(form);

  try {
    const res = await fetch('https://formsubmit.co/ajax/f070bc0187f540333a68c6a376d3e207', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: data
    });

    if (res.ok) {
      document.getElementById('rec-form-body').style.display = 'none';
      document.getElementById('rec-success').classList.add('show');
    } else {
      throw new Error('Falha no envio');
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = 'Tentar novamente <span>→</span>';
    alert('Ops! Não foi possível enviar. Tente novamente.');
  }
}
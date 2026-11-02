const imgs = [...document.querySelectorAll('.gallery img')];
const box = document.getElementById('lightbox');
const big = document.getElementById('lb-img');
const cap = document.getElementById('lb-caption');
let current = 0;

function show(i) {
  current = (i + imgs.length) % imgs.length;
  big.src = imgs[current].src;
  big.alt = imgs[current].alt;
  cap.textContent = imgs[current].alt;
  box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');
}
function close() {
  box.classList.remove('open');
  box.setAttribute('aria-hidden', 'true');
}

imgs.forEach((img, i) => img.addEventListener('click', () => show(i)));
box.querySelector('.lb-close').onclick = close;
box.querySelector('.lb-prev').onclick = () => show(current - 1);
box.querySelector('.lb-next').onclick = () => show(current + 1);
box.addEventListener('click', e => { if (e.target === box) close(); });
document.addEventListener('keydown', e => {
  if (!box.classList.contains('open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});
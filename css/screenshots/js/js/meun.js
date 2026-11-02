const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('main-nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  toggle.innerHTML = open ? '&times;' : '&#9776;';
});

// close the menu after tapping a link
nav.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '&#9776;';
  })
);
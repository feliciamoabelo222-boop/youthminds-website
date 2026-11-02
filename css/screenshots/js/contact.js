// The recipient of the email, as stated in the code
const RECIPIENT = 'hello@youngandheard.org.za';

const form = document.getElementById('contact-form');
const preview = document.getElementById('email-preview');

function setError(id, msg) {
  document.getElementById(id + '-error').textContent = msg;
  document.getElementById(id).classList.toggle('invalid', msg !== '');
  return msg === '';
}

function validate() {
  const v = id => document.getElementById(id).value.trim();
  let ok = true;

  ok = setError('c-name',
    v('c-name').length < 2 ? 'Please enter your full name (at least 2 characters).' :
    !/^[A-Za-z\s'-]+$/.test(v('c-name')) ? 'Use letters, spaces, hyphens or apostrophes only.' : '') && ok;

  ok = setError('c-email',
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('c-email')) ? 'Enter a valid email, e.g. name@example.com.' : '') && ok;

  ok = setError('c-phone',
    !/^(\+27|0)\d{9}$/.test(v('c-phone').replace(/\s/g, '')) ?
    'Enter a valid South African number, e.g. 0821234567 or +27821234567.' : '') && ok;

  ok = setError('c-type', v('c-type') === '' ? 'Please choose a type of message.' : '') && ok;

  const len = v('c-message').length;
  ok = setError('c-message',
    len < 20 ? `Message too short (${len}/20 characters minimum).` :
    len > 1000 ? 'Message too long (1000 characters maximum).' : '') && ok;

  return ok;
}

form.querySelectorAll('input, select, textarea').forEach(el =>
  el.addEventListener('blur', validate));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  preview.innerHTML = '';
  if (!validate()) {
    const p = document.createElement('p');
    p.className = 'msg-error';
    p.textContent = 'Please fix the errors above and try again.';
    preview.appendChild(p);
    return;
  }

  const v = id => document.getElementById(id).value.trim();
  const subject = `${v('c-type')} from ${v('c-name')}`;
  const body =
`Hello Young and Heard team,

${v('c-message')}

Message type: ${v('c-type')}
Name: ${v('c-name')}
Email: ${v('c-email')}
Phone: ${v('c-phone')}`;

  const mailto = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Build the preview with textContent so user input is never run as HTML
  const box = document.createElement('div');
  box.className = 'msg-success';

  const h = document.createElement('h3');
  h.textContent = 'Your email is ready';
  const to = document.createElement('p');
  to.innerHTML = '<strong>To:</strong> ';
  to.append(RECIPIENT);
  const sub = document.createElement('p');
  sub.innerHTML = '<strong>Subject:</strong> ';
  sub.append(subject);
  const pre = document.createElement('pre');
  pre.className = 'email-body';
  pre.textContent = body;

  const send = document.createElement('a');
  send.href = mailto;
  send.className = 'cta-button';
  send.textContent = 'Send Email';

  const copy = document.createElement('button');
  copy.type = 'button';
  copy.textContent = 'Copy Email Text';
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(`To: ${RECIPIENT}\nSubject: ${subject}\n\n${body}`);
      copy.textContent = 'Copied!';
    } catch (err) {
      copy.textContent = 'Copy failed, select the text manually';
    }
  });

  const note = document.createElement('p');
  note.textContent = 'Clicking "Send Email" opens your email app with this message ready to send. Nothing is sent until you press send there.';

  box.append(h, to, sub, pre, send, copy, note);
  preview.appendChild(box);
  box.scrollIntoView({ behavior: 'smooth' });
});
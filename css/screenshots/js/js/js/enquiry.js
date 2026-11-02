const form = document.getElementById('enquiry-form');
const responseBox = document.getElementById('enquiry-response');
const today = new Date().toISOString().split('T')[0];
document.getElementById('start').min = today;

function setError(id, msg) {
  document.getElementById(id + '-error').textContent = msg;
  document.getElementById(id).classList.toggle('invalid', msg !== '');
  return msg === '';
}

function validate() {
  const v = id => document.getElementById(id).value.trim();
  let ok = true;

  ok = setError('fullname',
    v('fullname').length < 2 ? 'Please enter your full name (at least 2 characters).' :
    !/^[A-Za-z\s'-]+$/.test(v('fullname')) ? 'Use letters, spaces, hyphens or apostrophes only.' : '') && ok;

  ok = setError('email',
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email')) ? 'Enter a valid email, e.g. name@example.com.' : '') && ok;

  ok = setError('phone',
    !/^(\+27|0)\d{9}$/.test(v('phone').replace(/\s/g, '')) ?
    'Enter a valid South African number, e.g. 0821234567 or +27821234567.' : '') && ok;

  const age = Number(v('age'));
  ok = setError('age',
    v('age') === '' ? 'Please enter your age.' :
    (!Number.isInteger(age) || age < 13 || age > 24) ? 'Age must be a whole number between 13 and 24.' : '') && ok;

  ok = setError('reason', v('reason') === '' ? 'Please choose what you are enquiring about.' : '') && ok;

  ok = setError('start',
    v('start') === '' ? 'Please choose a start date.' :
    v('start') < today ? 'The date cannot be in the past.' : '') && ok;

  const len = v('message').length;
  ok = setError('message',
    len < 20 ? `Message too short (${len}/20 characters minimum).` :
    len > 500 ? 'Message too long (500 characters maximum).' : '') && ok;

  return ok;
}

// validate each field when the user leaves it
form.querySelectorAll('input, select, textarea').forEach(el =>
  el.addEventListener('blur', validate));

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validate()) {
    responseBox.innerHTML = '<p class="msg-error">Please fix the errors above and try again.</p>';
    return;
  }
  responseBox.innerHTML = '<p>Checking details...</p>';

  // AJAX: get cost and availability without reloading the page
  let info;
  try {
    const res = await fetch('data/services.json');
    if (!res.ok) throw new Error('Could not load data');
    info = await res.json();
  } catch (err) {
    responseBox.innerHTML = '<p class="msg-error">Sorry, we could not load the details right now. Please try again or use our Contact page.</p>';
    return;
  }

  const name = document.getElementById('fullname').value.trim();
  const start = document.getElementById('start').value;
  const item = info[document.getElementById('reason').value];

  responseBox.innerHTML = `
    <div class="msg-success">
      <h2>Thank you, ${name.replace(/</g, '&lt;')}!</h2>
      <p><strong>${item.name}</strong></p>
      <p>Cost: ${item.cost}</p>
      <p>Availability: ${item.availability}</p>
      <p>Requested start date: ${start}</p>
      <p>We will be in touch by email or phone soon.</p>
    </div>`;
  form.reset();
}); 
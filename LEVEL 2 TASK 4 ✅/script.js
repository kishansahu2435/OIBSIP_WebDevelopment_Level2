const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const msg = document.getElementById('msg');
const dashboard = document.getElementById('dashboard');
const authCard = document.querySelector('.auth-card');
const logoutBtn = document.getElementById('logoutBtn');

function showTab(tabName) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
  loginForm.classList.toggle('active-form', tabName === 'login');
  registerForm.classList.toggle('active-form', tabName === 'register');
  msg.textContent = '';
}

tabs.forEach(tab => tab.addEventListener('click', () => showTab(tab.dataset.tab)));

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  const user = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value
  };
  localStorage.setItem('oasis_user', JSON.stringify(user));
  msg.textContent = 'Registration successful. You can now login.';
  showTab('login');
  registerForm.reset();
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const saved = JSON.parse(localStorage.getItem('oasis_user'));
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (saved && saved.email === email && saved.password === password) {
    document.getElementById('userName').textContent = saved.name;
    document.getElementById('userEmail').textContent = saved.email;
    authCard.classList.add('hidden');
    dashboard.classList.remove('hidden');
    msg.textContent = '';
  } else {
    msg.textContent = 'Invalid email or password.';
  }
});

logoutBtn.addEventListener('click', () => {
  dashboard.classList.add('hidden');
  authCard.classList.remove('hidden');
  loginForm.reset();
  msg.textContent = 'Logged out successfully.';
  showTab('login');
});
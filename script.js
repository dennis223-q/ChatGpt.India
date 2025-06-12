const messagesEl = document.getElementById('messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('input');
const darkModeToggle = document.getElementById('darkModeToggle');

let isDarkMode = false;

darkModeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark', isDarkMode);
  darkModeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
});

function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  messagesEl.appendChild(msg);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage(message) {
  addMessage(message, 'user');
  input.value = '';
  addMessage('Typing...', 'bot');

  try {
    const res = await fetch('/chat', {  // ✅ Serverless rewrite from vercel.json
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: message })
    });

    const data = await res.json();
    messagesEl.lastChild.textContent = data.reply;

  } catch (error) {
    messagesEl.lastChild.textContent = 'Error: ' + error.message;
  }
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const msg = input.value.trim();
  if (msg) sendMessage(msg);
});

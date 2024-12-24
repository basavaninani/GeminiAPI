async function sendMessage() {
  const userInput = document.getElementById('user-input').value;
  if (!userInput) return;

  appendMessage('user', userInput);
  document.getElementById('user-input').value = ''; // Clear the input field

  addToHistory(userInput);
  // Add loading dots
  const loadingDots = appendLoadingDots();

  try {
      const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ prompt: userInput })
      });

      if (response.status === 429) {
          removeLoadingDots(loadingDots);
          appendMessage('bot', 'You have exceeded your quota.');
          return;
      }

      const data = await response.json();
      const botReply = data.reply;

      removeLoadingDots(loadingDots);
      appendMessageWithTypingEffect('bot', botReply);
  } catch (error) {
      console.error('Error:', error);
      removeLoadingDots(loadingDots);
      appendMessage('bot', 'An error occurred. Please try again later.');
  }
}

function appendMessage(role, message) {
  const chatBox = document.getElementById('chat-box');
  const messageElement = document.createElement('div');
  messageElement.className = `message ${role}`;
  
  // Replace newline characters with <br> tags
  message = message.replace(/\n/g, '<br>');

  messageElement.innerHTML = message; // Use innerHTML instead of innerText
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;}

function appendMessageWithTypingEffect(role, message) {
  const chatBox = document.getElementById('chat-box');
  const messageElement = document.createElement('div');
  messageElement.className = `message ${role}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;

  typeMessage(message, messageElement);
}

function typeMessage(message, element) {
  let i = 0;
  const speed = 30; // Adjust the typing speed here

  function type() {
      if (i < message.length) {
          element.innerHTML += message.charAt(i);
          i++;
          setTimeout(type, speed);
      }
  }
  type();
}

function appendLoadingDots() {
  const chatBox = document.getElementById('chat-box');
  const loadingDotsElement = document.createElement('div');
  loadingDotsElement.className = 'loading-dots';
  loadingDotsElement.innerHTML = '<span></span><span></span><span></span>';
  chatBox.appendChild(loadingDotsElement);
  chatBox.scrollTop = chatBox.scrollHeight;
  return loadingDotsElement;
}

function addToHistory(searchQuery) {
  const historyList = document.getElementById('history-list');
  const historyItem = document.createElement('li');
  historyItem.innerText = searchQuery;
  historyList.appendChild(historyItem);
  historyItem.addEventListener('click', () => {
      document.getElementById('user-input').value = searchQuery;
      sendMessage();
  });
}

function removeLoadingDots(loadingDotsElement) {
  loadingDotsElement.remove();
}

document.getElementById('user-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
      sendMessage();
  }
});
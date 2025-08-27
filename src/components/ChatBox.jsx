import React, { useState, useRef, useEffect } from 'react';
import './component-style/ChatBox.css';

export default function ChatBox({
  variant = 'embedded',
  showHeader = false,
  placeholder = 'Fai una domanda...'
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const messagesRef             = useRef(null);

  // auto-scroll in fondo ai messaggi
  useEffect(() => {
    const m = messagesRef.current;
    if (m) m.scrollTop = m.scrollHeight;
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // push messaggio utente
    setMessages(m => [...m, { from: 'user', text: input }]);
    const prompt = input;
    setInput('');

    // simulazione risposta bot (qui andrà la chiamata all'API)
    setTimeout(() => {
      const reply = 'Risposta generica del bot';
      setMessages(m => [...m, { from: 'bot', text: reply }]);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // blocca newline
      handleSubmit(e);
    }
  };

  return (
    <div className={`chat-box ${variant === 'standalone' ? 'standalone' : 'embedded'}`}>
      {showHeader && <div className="chat-header">ChatAI</div>}

      <div className="messages" ref={messagesRef} aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <textarea
          className="chat-input"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button type="submit" className="send-button" aria-label="Invia">➤</button>
      </form>
    </div>
  );
}

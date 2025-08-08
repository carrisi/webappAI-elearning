// src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import './component-style/ChatBox.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const messagesRef             = useRef();

  // scroll automatico in fondo solo della lista messaggi
  useEffect(() => {
    const m = messagesRef.current;
    if (m) {
      m.scrollTop = m.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!input.trim()) return;

    // aggiungo messaggio utente
    setMessages(m => [...m, { from: 'user', text: input }]);
    const prompt = input;
    setInput('');

    // qui andrebbe la chiamata all'API AI, simuliamo risposta
    const reply = 'Risposta generica del bot';
    setMessages(m => [...m, { from: 'bot', text: reply }]);
  };

  return (
    <div className="chat-box">
      <div className="chat-header">ChatAI</div>
      <div className="messages" ref={messagesRef}>
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Fai una domanda..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="send-button">➤</button>
      </form>
    </div>
  );
};

export default ChatBox;

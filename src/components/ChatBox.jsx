// src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import './component-style/ChatBox.css';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const endRef                  = useRef();

  // scroll automatico in fondo
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!input.trim()) return;

    // aggiungo messaggio utente
    setMessages(m => [...m, { from: 'user', text: input }]);
    const prompt = input;
    setInput('');

    // chiamo l’API OpenAI
    const reply = await fetchChatResponse(prompt);
    setMessages(m => [...m, { from: 'bot', text: reply }]);
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.from}`}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
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

// src/components/ChatBox.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';  // modal montato nel <body>
import './component-style/ChatBox.css';

export default function ChatBox({
  variant = 'embedded',
  showHeader = false,
  placeholder = 'Fai una domanda...',
  expandable = true
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const messagesRef             = useRef(null);
  const [isOpen, setIsOpen]     = useState(false);

  useEffect(() => {
    const m = messagesRef.current;
    if (m) m.scrollTop = m.scrollHeight;
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(m => [...m, { from: 'user', text: input }]);
    const prompt = input;
    setInput('');

    setTimeout(() => {
      const reply = 'Risposta generica del bot';
      setMessages(m => [...m, { from: 'bot', text: reply }]);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const ChatUI = (
    <>
      {showHeader && (
        <div className="chat-header">
          <span>ChatAI</span>
          {expandable && !isOpen && (
            <button
              type="button"
              className="chat-icon-button"
              aria-label="Apri in popup"
              onClick={() => setIsOpen(true)}
              title="Apri in popup"
            >
              ⤢
            </button>
          )}
        </div>
      )}

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
    </>
  );

  return (
    <div className={`chat-box ${variant === 'standalone' ? 'standalone' : 'embedded'}`}>
      {ChatUI}

      {expandable && isOpen &&
        createPortal(
          <div className="chat-modal-backdrop" role="dialog" aria-modal="true">
            <div className="chat-modal" role="document">
              {/* Solo bottone chiusura, niente header */}
              <button
                type="button"
                className="chat-close-button"
                aria-label="Chiudi popup"
                onClick={() => setIsOpen(false)}
                title="Chiudi"
              >
                ✕
              </button>

              <div className="chat-modal-body">
                <div className="chat-box standalone">{ChatUI}</div>
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </div>
  );
}

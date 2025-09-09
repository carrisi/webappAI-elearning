import React, { useState } from "react";
import { Card, Form, Button, ButtonGroup } from "react-bootstrap";
import ChatBox from "../components/ChatBox";
import "./Style/StudentChatAI.css";
import "../student/Style/MyCourses.css";

export default function StudentChatAI() {
  const [uploaded, setUploaded] = useState([]);      // [{name, size}] per file
  const [videoLinks, setVideoLinks] = useState([]);  // [{url, source}]
  const [mode, setMode] = useState("file");          // "file" | "link"
  const [videoUrl, setVideoUrl] = useState("");

  const suggestions = [
    "Riassumi il PDF in 5 punti",
    "Spiega il teorema con un esempio",
    "Trova definizioni e formule chiave",
    "Genera 5 quiz a risposta multipla",
  ];

  const insertIntoComposer = (text) => {
    const ta = document.querySelector(".composer-input");
    if (ta) {
      ta.value = text;
      ta.dispatchEvent(new Event("input", { bubbles: true }));
      ta.focus();
    }
  };

  const onUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploaded((prev) => [
      ...prev,
      ...files.map((f) => ({ name: f.name, size: f.size }))
    ]);
  };

  // Riconosce alcune piattaforme comuni, altrimenti "link"
  const detectSource = (url) => {
    try {
      const u = new URL(url);
      if (/youtube\.com|youtu\.be/i.test(u.hostname)) return "YouTube";
      if (/vimeo\.com/i.test(u.hostname)) return "Vimeo";
      return "Link";
    } catch { return "Link"; }
  };

  const isValidUrl = (url) => {
    try {
      const u = new URL(url);
      return !!u.protocol && !!u.hostname;
    } catch { return false; }
  };

  const addVideoLink = (e) => {
    e.preventDefault();
    const url = videoUrl.trim();
    if (!isValidUrl(url)) return;
    setVideoLinks((prev) => [...prev, { url, source: detectSource(url) }]);
    setVideoUrl("");
  };

  return (
    <main className="student-chatai">
      {/* HERO */}
      <section className="glass-hero text-white mb-2 chatai-hero">
        <h1 className="hero-title mb-1">ChatAI</h1>
        <p className="hero-subtitle mb-0">
          Fai domande sui tuoi materiali didattici (PDF, Word, slide, testi, immagini) o su un link video.
        </p>
      </section>

      {/* SELETTORE: File o Link video + relativo pannello */}
      <section className="glass-card chatai-topbar" aria-label="Allegati e suggerimenti">
        <div className="mode-switch">
          <span className="mode-label">Sorgente:</span>
          <ButtonGroup>
            <Button
              variant={mode === "file" ? "light" : "outline-light"}
              className={`mode-btn ${mode === "file" ? "active" : ""}`}
              onClick={() => setMode("file")}
            >
              File
            </Button>
            <Button
              variant={mode === "link" ? "light" : "outline-light"}
              className={`mode-btn ${mode === "link" ? "active" : ""}`}
              onClick={() => setMode("link")}
            >
              Link video
            </Button>
          </ButtonGroup>
        </div>

        {/* Pannello FILE */}
        {mode === "file" && (
          <div className="topbar-col">
            <div className="upload-title">Carica materiali</div>
            <Form.Group controlId="student-chatai-upload" className="mb-2">
              <Form.Control
                type="file"
                multiple
                onChange={onUpload}
                accept={
                  ".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.rtf," +
                  ".jpg,.jpeg,.png,.gif,.webp"
                }
              />
            </Form.Group>
            <small className="text-white-50">
              Supportati: PDF, Word/PowerPoint, TXT/MD, immagini (jpg/png/gif/webp). Niente video.
            </small>

            {uploaded.length > 0 && (
              <ul className="upload-list">
                {uploaded.map((f, idx) => (
                  <li key={`${f.name}-${idx}`} title={f.name}>
                    <span className="dot" aria-hidden="true" /> {f.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Pannello LINK */}
        {mode === "link" && (
          <div className="topbar-col">
            <div className="upload-title">Inserisci link video</div>
            <Form onSubmit={addVideoLink} className="video-link-form">
              <Form.Control
                type="url"
                placeholder="Incolla URL (es. https://youtu.be/...)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
              <Button type="submit" className="landing-btn primary add-link-btn">
                Aggiungi link
              </Button>
            </Form>
            <small className="text-white-50">
              Accettiamo link YouTube, Vimeo o URL diretti (verranno indicizzati per le risposte).
            </small>

            {videoLinks.length > 0 && (
              <ul className="upload-list">
                {videoLinks.map((v, idx) => (
                  <li key={`${v.url}-${idx}`} title={v.url}>
                    <span className="dot" aria-hidden="true" /> [{v.source}] {v.url}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Suggerimenti (sempre sotto la sezione di allegato scelto) */}
        <div className="topbar-col mt-3">
          <div className="suggestions-title">Suggerimenti</div>
          <div className="suggestions-grid">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                className="prompt-chip"
                onClick={() => insertIntoComposer(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CHAT */}
      <Card className="glass-card chatai-card">
        <Card.Body className="p-0">
          <div className="chat-container" style={{ minHeight: "70vh" }}>
            <ChatBox
              variant="standalone"
              showHeader
              placeholder="Chiedi alla ChatAI..."
            />
          </div>
        </Card.Body>
      </Card>
    </main>
  );
}

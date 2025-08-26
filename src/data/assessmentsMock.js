// Mock centralizzato per valutazioni (Esami, Esoneri, Esercitazioni)

const assessmentsMock = {
  esami: [
    {
      id: "ex-1",
      titolo: "Appello Giugno",
      data: "2025-06-20",
      peso: 1.0,
      valutazioni: [
        { studente: "Mario Rossi", matricola: "12345", voto: 27, note: "" },
        { studente: "Giulia Bianchi", matricola: "67890", voto: 30, note: "lode" },
      ],
    },
    {
      id: "ex-2",
      titolo: "Appello Luglio",
      data: "2025-07-22",
      peso: 1.0,
      valutazioni: [],
    },
  ],
  esoneri: [
    {
      id: "esn-1",
      titolo: "Esonero 1 – Algoritmi",
      data: "2025-05-10",
      peso: 0.5,
      valutazioni: [{ studente: "Mario Rossi", matricola: "12345", voto: 26, note: "" }],
    },
  ],
  esercitazioni: [
    {
      id: "exr-1",
      titolo: "Esercitazione SQL",
      data: "2025-04-28",
      peso: 0.2,
      valutazioni: [],
    },
  ],
};

export default assessmentsMock;

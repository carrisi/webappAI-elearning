// src/data/mockCourses.js

const mockCourses = [
  {
    id: 1,
    titolo: 'React Base',
    descrizione: 'Fondamenti di React: JSX, componenti, props, state, lifecycle e hook.',
    stato: 'attivo',
    instructor: 'Mario Rossi',
    durata: '8 settimane',
    livello: 'Principiante',
    tags: ['React', 'JavaScript', 'Front-end'],
    imageUrl: '/assets/react-base.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof./Prof.ssa [NOME COGNOME]',
      degree: 'CdS in Informatica',
      semester: 'primo semestre',
      credits: 6,
      notes: 'Le date e gli orari delle lezioni sono riportati nel manifesto/regolamento.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours:
        'Martedì dalle 12 alle 13 su appuntamento in studio/da remoto (prenotazione via email).'
    },
    sections: [
      {
        id: 1,
        title: 'Introduzione a React',
        description: 'Panoramica sul framework e setup iniziale con Create React App.',
        lessons: [
          { id: 1, title: 'Cos’è React?', type: 'video', duration: '10 min' },
          { id: 2, title: 'JSX e Virtual DOM', type: 'video', duration: '15 min' },
          { id: 3, title: 'Primo componente', type: 'hands-on', duration: '20 min' }
        ]
      },
      {
        id: 2,
        title: 'State e Props',
        description: 'Gestione dei dati e comunicazione fra componenti.',
        lessons: [
          { id: 1, title: 'Props immutabili', type: 'reading', duration: '10 min' },
          { id: 2, title: 'useState e useEffect', type: 'video', duration: '18 min' },
          { id: 3, title: 'Esercizio pratico', type: 'hands-on', duration: '25 min' }
        ]
      }
    ]
  },
  {
    id: 2,
    titolo: 'AI e Machine Learning',
    descrizione: 'Introduzione a modelli ML, Python, scikit-learn e integrazione con API AI.',
    stato: 'completato',
    instructor: 'Luisa Bianchi',
    durata: '10 settimane',
    livello: 'Intermedio',
    tags: ['AI', 'Machine Learning', 'Python'],
    imageUrl: '/assets/ai-ml.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof./Prof.ssa [NOME COGNOME]',
      degree: 'CdS in Informatica',
      semester: 'primo semestre',
      credits: 6,
      notes: 'Le date e gli orari delle lezioni sono riportati nel manifesto/regolamento.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours:
        'Martedì dalle 12 alle 13 su appuntamento in studio/da remoto (prenotazione via email).'
    },
    sections: [
      {
        id: 1,
        title: 'Python per ML',
        description: 'Setup ambiente, numpy e pandas per il data processing.',
        lessons: [
          { id: 1, title: 'Installazione e virtualenv', type: 'hands-on', duration: '15 min' },
          { id: 2, title: 'Manipolazione array', type: 'video', duration: '20 min' },
          { id: 3, title: 'DataFrame con pandas', type: 'video', duration: '25 min' }
        ]
      },
      {
        id: 2,
        title: 'Modelli supervisionati',
        description: 'Regressione e classificazione con scikit-learn.',
        lessons: [
          { id: 1, title: 'Regressione lineare', type: 'reading', duration: '12 min' },
          { id: 2, title: 'Classificazione k-NN', type: 'video', duration: '18 min' }
        ]
      }
    ]
  },
  {
    id: 3,
    titolo: 'Design UI/UX',
    descrizione: 'Principi di design, wireframing, prototipazione e test di usabilità.',
    stato: 'attivo',
    instructor: 'Giulia Verdi',
    durata: '6 settimane',
    livello: 'Principiante',
    tags: ['UI', 'UX', 'Design'],
    imageUrl: '/assets/ui-ux.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof./Prof.ssa [NOME COGNOME]',
      degree: 'CdS in Informatica',
      semester: 'primo semestre',
      credits: 6,
      notes: 'Le date e gli orari delle lezioni sono riportati nel manifesto/regolamento.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours:
        'Martedì dalle 12 alle 13 su appuntamento in studio/da remoto (prenotazione via email).'
    },
    sections: [
      {
        id: 1,
        title: 'Teoria del colore e tipografia',
        description: 'Scelta palette e principi tipografici.',
        lessons: [
          { id: 1, title: 'Teoria del colore', type: 'video', duration: '14 min' },
          { id: 2, title: 'Font e leggibilità', type: 'reading', duration: '10 min' }
        ]
      },
      {
        id: 2,
        title: 'Wireframe e prototipi',
        description: 'Uso di Sketch e Figma per prototipi interattivi.',
        lessons: [
          { id: 1, title: 'Sketch Basics', type: 'hands-on', duration: '30 min' },
          { id: 2, title: 'Test di usabilità', type: 'reading', duration: '12 min' }
        ]
      }
    ]
  },
  {
    id: 4,
    titolo: 'Programmazione I',
    descrizione: 'Fondamenti di programmazione imperativa e OOP in Java.',
    stato: 'attivo',
    instructor: 'Alessandro Neri',
    durata: '8 settimane',
    livello: 'Principiante',
    tags: ['Java', 'OOP', 'Programmazione'],
    imageUrl: '/assets/programmazione1.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof./Prof.ssa [NOME COGNOME]',
      degree: 'CdS in Informatica',
      semester: 'primo semestre',
      credits: 6,
      notes: 'Le date e gli orari delle lezioni sono riportati nel manifesto/regolamento.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours:
        'Martedì dalle 12 alle 13 su appuntamento in studio/da remoto (prenotazione via email).'
    },
    sections: [
      {
        id: 1,
        title: 'Sintassi di base',
        description: 'Variabili, tipi, operatori e controllo del flusso.',
        lessons: [
          { id: 1, title: 'Variabili e tipi', type: 'video', duration: '15 min' },
          { id: 2, title: 'Condizionali e cicli', type: 'hands-on', duration: '20 min' }
        ]
      },
      {
        id: 2,
        title: 'Classi e oggetti',
        description: 'Incapsulamento, ereditarietà, polimorfismo.',
        lessons: [
          { id: 1, title: 'Creare classi', type: 'video', duration: '18 min' },
          { id: 2, title: 'Esercizio OOP', type: 'hands-on', duration: '30 min' }
        ]
      }
    ]
  },
  {
    id: 5,
    titolo: 'Basi di Dati',
    descrizione: 'Progettazione di basi relazionali, normalizzazione e SQL avanzato.',
    stato: 'completato',
    instructor: 'Francesca Russo',
    durata: '7 settimane',
    livello: 'Intermedio',
    tags: ['SQL', 'Database', 'Relazionale'],
    imageUrl: '/assets/basi-dati.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof./Prof.ssa [NOME COGNOME]',
      degree: 'CdS in Informatica',
      semester: 'primo semestre',
      credits: 6,
      notes: 'Le date e gli orari delle lezioni sono riportati nel manifesto/regolamento.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours:
        'Martedì dalle 12 alle 13 su appuntamento in studio/da remoto (prenotazione via email).'
    },
    sections: [
      {
        id: 1,
        title: 'Modello relazionale',
        description: 'Entità, relazioni, chiavi primarie e esterne.',
        lessons: [
          { id: 1, title: 'Diagrammi ER', type: 'reading', duration: '12 min' },
          { id: 2, title: 'Normalizzazione', type: 'video', duration: '18 min' }
        ]
      },
      {
        id: 2,
        title: 'Query avanzate',
        description: 'JOIN, subquery, view, stored procedure.',
        lessons: [
          { id: 1, title: 'JOIN multipli', type: 'hands-on', duration: '25 min' },
          { id: 2, title: 'Stored procedure', type: 'video', duration: '15 min' }
        ]
      }
    ]
  },
  {
    id: 6,
    titolo: 'Ingegneria della Conoscenza',
    descrizione: 'Modellazione della conoscenza, ontologie e sistemi esperti.',
    stato: 'attivo',
    instructor: 'Marco Gialli',
    durata: '5 settimane',
    livello: 'Avanzato',
    tags: ['Ontologie', 'AI', 'Conoscenza'],
    imageUrl: '/assets/ingegneria-conoscenza.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof./Prof.ssa [NOME COGNOME]',
      degree: 'CdS in Informatica',
      semester: 'primo semestre',
      credits: 6,
      notes: 'Le date e gli orari delle lezioni sono riportati nel manifesto/regolamento.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours:
        'Martedì dalle 12 alle 13 su appuntamento in studio/da remoto (prenotazione via email).'
    },
    sections: [
      {
        id: 1,
        title: 'Ontologie e RDF',
        description: 'Struttura e serializzazione di ontologie.',
        lessons: [
          { id: 1, title: 'Introduzione a RDF', type: 'video', duration: '20 min' },
          { id: 2, title: 'OWL e ontologie', type: 'reading', duration: '15 min' }
        ]
      },
      {
        id: 2,
        title: 'Motori di inferenza',
        description: 'Forward e backward chaining.',
        lessons: [
          { id: 1, title: 'Regole esperte', type: 'hands-on', duration: '30 min' },
          { id: 2, title: 'Esempi pratici', type: 'video', duration: '22 min' }
        ]
      }
    ]
  },
  {
    id: 7,
    titolo: 'Architettura degli Elaboratori',
    descrizione: 'Studio dell’architettura di CPU, memoria, bus e periferiche.',
    stato: 'completato',
    instructor: 'Laura Blu',
    durata: '6 settimane',
    livello: 'Intermedio',
    tags: ['Hardware', 'CPU', 'Memoria'],
    imageUrl: '/assets/architettura-elaboratori.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof./Prof.ssa [NOME COGNOME]',
      degree: 'CdS in Informatica',
      semester: 'primo semestre',
      credits: 6,
      notes: 'Le date e gli orari delle lezioni sono riportati nel manifesto/regolamento.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours:
        'Martedì dalle 12 alle 13 su appuntamento in studio/da remoto (prenotazione via email).'
    },
    sections: [
      {
        id: 1,
        title: 'Struttura della CPU',
        description: 'ALU, registri e unità di controllo.',
        lessons: [
          { id: 1, title: 'Ciclo fetch-decode-execute', type: 'video', duration: '18 min' },
          { id: 2, title: 'Pipeline', type: 'reading', duration: '12 min' }
        ]
      },
      {
        id: 2,
        title: 'Gerarchie di memoria',
        description: 'Cache, RAM, memoria di massa.',
        lessons: [
          { id: 1, title: 'Cache e latenza', type: 'hands-on', duration: '20 min' },
          { id: 2, title: 'Gestione memoria', type: 'video', duration: '15 min' }
        ]
      }
    ]
  },
  {
    id: 8,
    titolo: 'Interazione Uomo-Macchina',
    descrizione: 'Principi di design centrato sull’utente, ergonomia e accessibilità.',
    stato: 'attivo',
    instructor: 'Stefania Viola',
    durata: '5 settimane',
    livello: 'Principiante',
    tags: ['HCI', 'Accessibilità', 'UX'],
    imageUrl: '/assets/human-computer.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof./Prof.ssa [NOME COGNOME]',
      degree: 'CdS in Informatica',
      semester: 'primo semestre',
      credits: 6,
      notes: 'Le date e gli orari delle lezioni sono riportati nel manifesto/regolamento.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours:
        'Martedì dalle 12 alle 13 su appuntamento in studio/da remoto (prenotazione via email).'  
    },
    sections: [
      {
        id: 1,
        title: 'Usabilità e testing',
        description: 'Metodologie di test con utenti reali.',
        lessons: [
          { id: 1, title: 'Test di usabilità', type: 'video', duration: '20 min' },
          { id: 2, title: 'Report e metriche', type: 'reading', duration: '15 min' }
        ]
      },
      {
        id: 2,
        title: 'Linee guida WCAG',
        description: 'Standard per accessibilità web.',
        lessons: [
          { id: 1, title: 'WCAG 2.1 principi', type: 'reading', duration: '18 min' },
          { id: 2, title: 'Implementazione', type: 'hands-on', duration: '25 min' }
        ]
      }
    ]
  },
  {
    id: 9,
    titolo: 'Sviluppo Web Avanzato',
    descrizione: 'Framework moderni (Next.js, Nuxt.js), ottimizzazione e SEO.',
    stato: 'attivo',
    instructor: 'Davide Arancio',
    durata: '7 settimane',
    livello: 'Avanzato',
    tags: ['Next.js', 'SPA', 'Performance'],
    imageUrl: '/assets/web-avanzato.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof./Prof.ssa [NOME COGNOME]',
      degree: 'CdS in Informatica',
      semester: 'primo semestre',
      credits: 6,
      notes: 'Le date e gli orari delle lezioni sono riportati nel manifesto/regolamento.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours:
        'Martedì dalle 12 alle 13 su appuntamento in studio/da remoto (prenotazione via email).'  
    },
    sections: [
      {
        id: 1,
        title: 'Server-Side Rendering',
        description: 'Next.js SSR e SSG.',
        lessons: [
          { id: 1, title: 'SSR con Next.js', type: 'video', duration: '22 min' },
          { id: 2, title: 'Static Generation', type: 'hands-on', duration: '25 min' }
        ]
      },
      {
        id: 2,
        title: 'Ottimizzazione e SEO',
        description: 'Analisi performance, Lighthouse e meta tag.',
        lessons: [
          { id: 1, title: 'Performance web', type: 'reading', duration: '15 min' },
          { id: 2, title: 'SEO basics', type: 'video', duration: '18 min' }
        ]
      }
    ]
  },
  {
    id: 10,
    titolo: 'Sicurezza Informatica',
    descrizione: 'Principi di crittografia, sicurezza di rete, penetration testing.',
    stato: 'completato',
    instructor: 'Eleonora Nera',
    durata: '9 settimane',
    livello: 'Intermedio',
    tags: ['Sicurezza', 'Crittografia', 'Networking'],
    imageUrl: '/assets/security.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof./Prof.ssa [NOME COGNOME]',
      degree: 'CdS in Informatica',
      semester: 'primo semestre',
      credits: 6,
      notes: 'Le date e gli orari delle lezioni sono riportati nel manifesto/regolamento.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours:
        'Martedì dalle 12 alle 13 su appuntamento in studio/da remoto (prenotazione via email).'  
    },
    sections: [
      {
        id: 1,
        title: 'Crittografia simmetrica',
        description: 'AES e protocolli TLS.',
        lessons: [
          { id: 1, title: 'AES e chiavi segrete', type: 'video', duration: '20 min' },
          { id: 2, title: 'TLS handshake', type: 'reading', duration: '15 min' }
        ]
      },
      {
        id: 2,
        title: 'Pentesting di rete',
        description: 'Strumenti di scansione e analisi.',
        lessons: [
          { id: 1, title: 'Nmap basics', type: 'hands-on', duration: '30 min' },
          { id: 2, title: 'Report vulnerabilità', type: 'video', duration: '15 min' }
        ]
      }
    ]
  }
];

export default mockCourses;

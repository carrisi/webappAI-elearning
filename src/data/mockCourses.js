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
          {
            id: 1,
            title: 'Cos’è React?',
            type: 'video',
            duration: '10 min',
            fileTypes: ['video'],
            description: 'Panoramica sulle caratteristiche principali di React e sugli scenari in cui è vantaggioso.'
          },
          {
            id: 2,
            title: 'JSX e Virtual DOM',
            type: 'video',
            duration: '15 min',
            fileTypes: ['video'],
            description: 'Spiegazione di JSX, come viene compilato e il funzionamento del Virtual DOM.'
          },
          {
            id: 3,
            title: 'Primo componente',
            type: 'hands-on',
            duration: '20 min',
            fileTypes: ['video', 'pdf'],
            description: 'Creazione del primo componente React passo a passo, con esempi pratici.'
          }
        ]
      },
      {
        id: 2,
        title: 'State e Props',
        description: 'Gestione dei dati e comunicazione fra componenti.',
        lessons: [
          {
            id: 1,
            title: 'Props immutabili',
            type: 'reading',
            duration: '10 min',
            fileTypes: ['pdf'],
            description: 'Approfondimento sul concetto di props e sulla loro natura immutabile.'
          },
          {
            id: 2,
            title: 'useState e useEffect',
            type: 'video',
            duration: '18 min',
            fileTypes: ['video'],
            description: 'Utilizzo dei principali hook di React per gestire lo stato e gli effetti collaterali.'
          },
          {
            id: 3,
            title: 'Esercizio pratico',
            type: 'hands-on',
            duration: '25 min',
            fileTypes: ['pdf'],
            description: 'Esercizio guidato per applicare useState e useEffect in un componente funzionale.'
          }
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
          {
            id: 1,
            title: 'Installazione e virtualenv',
            type: 'hands-on',
            duration: '15 min',
            fileTypes: ['pdf'],
            description: 'Configurazione dell’ambiente Python e gestione delle virtualenv.'
          },
          {
            id: 2,
            title: 'Manipolazione array',
            type: 'video',
            duration: '20 min',
            fileTypes: ['video'],
            description: 'Lavorare con numpy per creare e manipolare array multidimensionali.'
          },
          {
            id: 3,
            title: 'DataFrame con pandas',
            type: 'video',
            duration: '25 min',
            fileTypes: ['video'],
            description: 'Introduzione a pandas e alle operazioni fondamentali sui DataFrame.'
          }
        ]
      },
      {
        id: 2,
        title: 'Modelli supervisionati',
        description: 'Regressione e classificazione con scikit-learn.',
        lessons: [
          {
            id: 1,
            title: 'Regressione lineare',
            type: 'reading',
            duration: '12 min',
            fileTypes: ['pdf'],
            description: 'Teoria della regressione lineare e implementazione con scikit-learn.'
          },
          {
            id: 2,
            title: 'Classificazione k-NN',
            type: 'video',
            duration: '18 min',
            fileTypes: ['video'],
            description: 'Spiegazione del k-NN e casi d’uso pratici per la classificazione.'
          }
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
          {
            id: 1,
            title: 'Teoria del colore',
            type: 'video',
            duration: '14 min',
            fileTypes: ['video'],
            description: 'Come scegliere palette cromatiche efficaci per il web.'
          },
          {
            id: 2,
            title: 'Font e leggibilità',
            type: 'reading',
            duration: '10 min',
            fileTypes: ['pdf'],
            description: 'Importanza della tipografia e best practice per il web.'
          }
        ]
      },
      {
        id: 2,
        title: 'Wireframe e prototipi',
        description: 'Uso di Sketch e Figma per prototipi interattivi.',
        lessons: [
          {
            id: 1,
            title: 'Sketch Basics',
            type: 'hands-on',
            duration: '30 min',
            fileTypes: ['pdf'],
            description: 'Primi passi con Sketch: strumenti e funzionalità principali.'
          },
          {
            id: 2,
            title: 'Test di usabilità',
            type: 'reading',
            duration: '12 min',
            fileTypes: ['pdf'],
            description: 'Metodologie per condurre test di usabilità con utenti reali.'
          }
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
          {
            id: 1,
            title: 'Variabili e tipi',
            type: 'video',
            duration: '15 min',
            fileTypes: ['video'],
            description: 'Definizione di variabili e tipi di dato in Java.'
          },
          {
            id: 2,
            title: 'Condizionali e cicli',
            type: 'hands-on',
            duration: '20 min',
            fileTypes: ['pdf'],
            description: 'Esercizi pratici con if, switch, for e while.'
          }
        ]
      },
      {
        id: 2,
        title: 'Classi e oggetti',
        description: 'Incapsulamento, ereditarietà e polimorfismo.',
        lessons: [
          {
            id: 1,
            title: 'Creare classi',
            type: 'video',
            duration: '18 min',
            fileTypes: ['video'],
            description: 'Come definire classi e costruttori in Java.'
          },
          {
            id: 2,
            title: 'Esercizio OOP',
            type: 'hands-on',
            duration: '30 min',
            fileTypes: ['pdf'],
            description: 'Implementazione di un semplice esempio OOP.'
          }
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
          {
            id: 1,
            title: 'Diagrammi ER',
            type: 'reading',
            duration: '12 min',
            fileTypes: ['pdf'],
            description: 'Creazione e lettura di diagrammi Entità-Relazione.'
          },
          {
            id: 2,
            title: 'Normalizzazione',
            type: 'video',
            duration: '18 min',
            fileTypes: ['video'],
            description: 'Principi di normalizzazione e forme normali.'
          }
        ]
      },
      {
        id: 2,
        title: 'Query avanzate',
        description: 'JOIN, subquery, view, stored procedure.',
        lessons: [
          {
            id: 1,
            title: 'JOIN multipli',
            type: 'hands-on',
            duration: '25 min',
            fileTypes: ['pdf'],
            description: 'Esercizi pratici con join tra più tabelle.'
          },
          {
            id: 2,
            title: 'Stored procedure',
            type: 'video',
            duration: '15 min',
            fileTypes: ['video'],
            description: 'Creazione e utilizzo di stored procedure in SQL.'
          }
        ]
      }
    ]
  }
];

export default mockCourses;

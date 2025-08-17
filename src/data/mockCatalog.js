// src/data/mockCatalog.js
// Catalogo di TUTTI i corsi disponibili: include i corsi di mockCourses (iscritti)
// più alcuni corsi extra non ancora iscritti.

import enrolled from './mockCourses';

const extra = [
  {
    id: 6,
    titolo: 'Sistemi Operativi',
    descrizione: 'Processi, thread, scheduling, memoria virtuale, file system.',
    instructor: 'Paolo Marchetti',
    durata: '9 settimane',
    livello: 'Intermedio',
    tags: ['OS', 'Processi', 'Memoria'],
    imageUrl: '/assets/sistemi-operativi.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof. Paolo Marchetti',
      degree: 'CdS in Informatica',
      semester: 'secondo semestre',
      credits: 9,
      notes: 'Esoneri in itinere.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours: 'Giovedì 10–12 in studio.'
    }
  },
  {
    id: 7,
    titolo: 'Algoritmi e Strutture Dati',
    descrizione: 'Liste, alberi, grafi, ricerca e ordinamento; analisi di complessità.',
    instructor: 'Chiara De Luca',
    durata: '10 settimane',
    livello: 'Intermedio',
    tags: ['Algoritmi', 'Strutture Dati'],
    imageUrl: '/assets/algoritmi-sd.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Prof.ssa Chiara De Luca',
      degree: 'CdS in Informatica',
      semester: 'primo semestre',
      credits: 9,
      notes: 'Laboratorio settimanale.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours: 'Lunedì 14–16 online.'
    }
  },
  {
    id: 8,
    titolo: 'Sviluppo Mobile con React Native',
    descrizione: 'Componenti, navigazione, integrazione API e pubblicazione su store.',
    instructor: 'Davide Serra',
    durata: '6 settimane',
    livello: 'Avanzato',
    tags: ['React Native', 'Mobile', 'API'],
    imageUrl: '/assets/react-native.jpg',
    introduzione: {
      academicYear: '2024/2025',
      professor: 'Ing. Davide Serra',
      degree: 'CdS in Informatica',
      semester: 'secondo semestre',
      credits: 6,
      notes: 'Project work finale.',
      officeHoursTitle: 'Ricevimento studenti',
      officeHours: 'Mercoledì 11–12 su Teams.'
    }
  }
];

// Catalogo = iscritti + extra (id univoci)
const catalog = [...enrolled, ...extra];

export default catalog;

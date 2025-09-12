# Webapp AI E-Learning

Piattaforma e-learning con interfacce Studente/Docente, integrazione Firebase (Auth + Firestore) e visualizzazione contenuti (video/PDF) con chat AI.  
Questo repository è **già configurato** per puntare al progetto Firebase associato (tramite variabili `VITE_`).


## Requisiti

- **Node.js**: versione **20 LTS** (consigliato)
- **npm**: versione **9+**
- **Browser** moderno (Chrome/Edge/Firefox/Safari)
- **Accesso rete**: necessario per Firebase


## Verifica versioni

Scrivere nel terminare:
```
node -v
npm -v
```


## Configurazione ambiente
Il progetto è pronto per l’uso con il Firebase già impostato.


## Avvio sviluppo
```
npm install
//avvio locale in modalità sviluppo (Vite)  
npm run dev

Apri l’URL indicato in console
(es. http://localhost:5173).
```


## Build produzione e anteprima
```
// genera la build in dist/
npm run build

// in locale
npm run preview
```
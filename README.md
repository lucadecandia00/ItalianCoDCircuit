# Italian CoD Circuit

Prototipo completo del sito pubblico bilingue dell'ASD Italian CoD Circuit.

## Architettura

### Pagine

- **Home**: hero esports, prossimo evento, indicatori del circuito, tornei e ranking in evidenza.
- **Tornei**: calendario filtrabile, card complete e pagina di dettaglio per ciascun torneo.
- **Players**: ranking ricercabile con profili, piattaforma, team e statistiche.
- **Eventi**: appuntamenti in presenza futuri e archivio degli eventi passati.
- **Regolamento**: documenti generali, standard competitivi e ruleset dei tornei.
- **Chi siamo**: missione, valori e dati dell'associazione.
- **Contatti**: canali diretti e modulo di contatto funzionante lato interfaccia.

La navigazione usa route hash, quindi il prototipo funziona senza configurare rewrite sul server. L'header fisso include menu completo, selettore IT/EN, login e registrazione; su mobile diventa un menu dedicato.

### Componenti principali

`Header`, `Footer`, `TournamentCard`, `PlayerCard`, `StatusPill`, `SectionHeading` e `AuthModal` sono componenti riutilizzabili. Le pagine consumano dati tipizzati separati dalla UI, mentre il dizionario centralizzato traduce ogni testo dell'interfaccia.

### Modello dati

`Tournament` comprende identificativo, gioco, data/ora, formato, piattaforma, capienza, iscritti, montepremi, stato, location, contenuti localizzati, regole e programma. `Player` comprende username, avatar, paese, piattaforma, ruolo, team e statistiche. `CircuitEvent` comprende stato, data, luogo, immagine e descrizione localizzata.

Questi contratti possono essere usati direttamente come DTO di un'API futura. I dati dimostrativi sono in `src/data.ts`; le traduzioni sono in `src/content.ts`.

## Tecnologia

- React 19 e TypeScript
- Vite
- Lucide React per le icone
- CSS responsive con dark mode, accessibilità e reduced motion
- `localStorage` per persistere la lingua
- Struttura pronta per API di autenticazione, profili, iscrizioni e gestione tornei

## Avvio

```bash
npm install
npm run dev
```

Build di produzione:

```bash
npm run build
```

## Pubblicazione su GitHub Pages

Il repository include il workflow `.github/workflows/deploy-pages.yml`. A ogni push sul branch `main`, GitHub compila il progetto e pubblica automaticamente la cartella `dist`.

1. Crea un repository GitHub e invia il progetto sul branch `main`.
2. In GitHub apri **Settings → Pages**.
3. In **Build and deployment → Source** seleziona **GitHub Actions**.
4. Apri la scheda **Actions** e attendi il completamento del workflow **Deploy to GitHub Pages**.

Il sito sarà disponibile all'indirizzo:

```text
https://NOME-UTENTE.github.io/NOME-REPOSITORY/
```

Per gli aggiornamenti successivi basta eseguire un nuovo push su `main`.

I form di login, registrazione e contatto sono prototipi frontend: validano e completano il flusso UI, ma richiedono un servizio backend per persistenza, email e autenticazione reale.

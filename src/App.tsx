import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Download,
  Gamepad2,
  Globe2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { content, type SiteContent } from "./content";
import { events, players, tournaments } from "./data";
import type { Language, Player, Tournament, TournamentStatus } from "./models";

type MainRoute = "home" | "tournaments" | "players" | "events" | "rules" | "about" | "contact";
type Route = { page: MainRoute } | { page: "tournament"; id: string };
type AuthMode = "login" | "register" | null;

const navRoutes: MainRoute[] = ["home", "tournaments", "players", "events", "rules", "about", "contact"];

function parseRoute(): Route {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "tournaments" && parts[1]) return { page: "tournament", id: parts[1] };
  if (navRoutes.includes(parts[0] as MainRoute)) return { page: parts[0] as MainRoute };
  return { page: "home" };
}

function routeHref(route: MainRoute) {
  return `#/${route}`;
}

function formatDate(date: string, language: Language, long = false) {
  return new Intl.DateTimeFormat(language === "it" ? "it-IT" : "en-GB", {
    day: "2-digit",
    month: long ? "long" : "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function SectionHeading({ eyebrow, title, body, action }: { eyebrow: string; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {body && <p>{body}</p>}
      </div>
      {action}
    </div>
  );
}

function StatusPill({ status, text }: { status: TournamentStatus | "upcoming" | "past"; text: SiteContent }) {
  return <span className={`status status-${status}`}><span />{text.status[status]}</span>;
}

function TournamentCard({ tournament, language, text }: { tournament: Tournament; language: Language; text: SiteContent }) {
  const spots = tournament.capacity - tournament.registered;
  return (
    <article className="tournament-card">
      <a className="card-image" href={`#/tournaments/${tournament.id}`} aria-label={`${text.tournaments.details}: ${tournament.name}`}>
        <img src={tournament.image} alt="" />
        <StatusPill status={tournament.status} text={text} />
      </a>
      <div className="card-content">
        <div className="card-date"><CalendarDays size={16} /> {formatDate(tournament.date, language, true)} · {tournament.time}</div>
        <h3><a href={`#/tournaments/${tournament.id}`}>{tournament.name}</a></h3>
        <p className="game-name">{tournament.game}</p>
        <dl className="card-specs">
          <div><dt>{text.common.format}</dt><dd>{tournament.format}</dd></div>
          <div><dt>{text.common.platform}</dt><dd>{tournament.platform}</dd></div>
          <div><dt>{text.common.prize}</dt><dd>{tournament.prizePool}</dd></div>
        </dl>
        <div className="card-progress" aria-label={`${tournament.registered} ${text.common.registered}`}>
          <span style={{ width: `${(tournament.registered / tournament.capacity) * 100}%` }} />
        </div>
        <div className="card-footer">
          <span>{spots} {text.tournaments.remaining}</span>
          <a className="text-link" href={`#/tournaments/${tournament.id}`}>{text.tournaments.details}<ArrowRight size={16} /></a>
        </div>
      </div>
    </article>
  );
}

function PlayerCard({ player, rank, text }: { player: Player; rank: number; text: SiteContent }) {
  return (
    <article className="player-card">
      <span className="player-rank">#{String(rank).padStart(2, "0")}</span>
      <img src={player.avatar} alt="" />
      <div className="player-main">
        <div className="player-country">{player.countryCode} · {player.platform}</div>
        <h3>{player.username}</h3>
        <p>{player.team ?? text.common.independent} · {player.role}</p>
      </div>
      <div className="player-stats">
        <span><strong>{player.points}</strong>{text.common.points}</span>
        <span><strong>{player.kd.toFixed(2)}</strong>K/D</span>
        <span><strong>{player.wins}</strong>{text.common.wins}</span>
      </div>
    </article>
  );
}

function Header({ language, setLanguage, text, route, setAuthMode }: { language: Language; setLanguage: (language: Language) => void; text: SiteContent; route: Route; setAuthMode: (mode: AuthMode) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activePage = route.page === "tournament" ? "tournaments" : route.page;

  return (
    <header className="site-header">
      <a className="brand" href="#/home" onClick={() => setMenuOpen(false)} aria-label="Italian CoD Circuit home">
        <span className="brand-mark"><span>I</span><span>C</span></span>
        <span className="brand-name">ITALIAN COD <b>CIRCUIT</b></span>
      </a>
      <nav className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Main navigation">
        {navRoutes.map((item) => (
          <a className={activePage === item ? "active" : ""} href={routeHref(item)} key={item} onClick={() => setMenuOpen(false)}>{text.nav[item]}</a>
        ))}
        <div className="mobile-auth">
          <button className="button ghost" onClick={() => setAuthMode("login")}>{text.auth.login}</button>
          <button className="button primary" onClick={() => setAuthMode("register")}>{text.auth.register}</button>
        </div>
      </nav>
      <div className="header-actions">
        <div className="language-switcher" aria-label="Language selector">
          {(["it", "en"] as const).map((item) => <button className={item === language ? "active" : ""} key={item} onClick={() => setLanguage(item)} aria-pressed={item === language}>{item.toUpperCase()}</button>)}
        </div>
        <button className="login-button" onClick={() => setAuthMode("login")}><CircleUserRound size={19} /><span>{text.auth.login}</span></button>
        <button className="button primary header-register" onClick={() => setAuthMode("register")}>{text.auth.register}</button>
        <button className="menu-button" aria-label={menuOpen ? text.auth.close : "Menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}

function Footer({ text }: { text: SiteContent }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div><a className="brand footer-brand" href="#/home"><span className="brand-mark"><span>I</span><span>C</span></span><span className="brand-name">ITALIAN COD <b>CIRCUIT</b></span></a><p>{text.footer.description}</p></div>
        <div><h3>{text.footer.explore}</h3>{navRoutes.slice(1).map((item) => <a href={routeHref(item)} key={item}>{text.nav[item]}</a>)}</div>
        <div><h3>{text.footer.community}</h3><a href="mailto:info@italiancodcircuit.it">Email</a><a href="https://discord.com" target="_blank" rel="noreferrer">Discord</a><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></div>
      </div>
      <div className="footer-bottom"><span>© 2026 {text.footer.rights}</span><span>{text.footer.disclaimer}</span></div>
    </footer>
  );
}

function AuthModal({ mode, setMode, text }: { mode: Exclude<AuthMode, null>; setMode: (mode: AuthMode) => void; text: SiteContent }) {
  const isRegister = mode === "register";
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setMode(null)}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="icon-button modal-close" onClick={() => setMode(null)} aria-label={text.auth.close}><X /></button>
        <span className="modal-icon"><Gamepad2 /></span>
        <h2 id="auth-title">{isRegister ? text.auth.registerTitle : text.auth.loginTitle}</h2>
        <form onSubmit={(event) => { event.preventDefault(); setMode(null); }}>
          {isRegister && <label>{text.auth.username}<input required autoComplete="username" /></label>}
          <label>{text.auth.email}<input type="email" required autoComplete="email" /></label>
          <label>{text.auth.password}<input type="password" required minLength={8} autoComplete={isRegister ? "new-password" : "current-password"} /></label>
          {isRegister && <label>{text.auth.platform}<select defaultValue=""><option value="" disabled>—</option><option>PlayStation 5</option><option>PC</option><option>Xbox</option></select></label>}
          <button className="button primary full" type="submit">{text.auth.continue}<ArrowRight size={17} /></button>
        </form>
        <p className="auth-switch">{isRegister ? text.auth.hasAccount : text.auth.noAccount} <button onClick={() => setMode(isRegister ? "login" : "register")}>{isRegister ? text.auth.login : text.auth.register}</button></p>
      </section>
    </div>
  );
}

function HomePage({ language, text, setAuthMode }: { language: Language; text: SiteContent; setAuthMode: (mode: AuthMode) => void }) {
  return (
    <>
      <section className="hero">
        <img className="hero-image" src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2200&q=90" alt="Esports competitors playing on stage" />
        <div className="hero-overlay" />
        <div className="hero-copy reveal">
          <p className="eyebrow">{text.hero.eyebrow}</p>
          <h1>{text.hero.title}</h1>
          <p className="hero-body">{text.hero.body}</p>
          <div className="hero-actions"><a className="button primary" href="#/tournaments">{text.hero.primary}<ArrowRight size={18} /></a><button className="button secondary" onClick={() => setAuthMode("register")}>{text.hero.secondary}</button></div>
        </div>
        <a className="next-event" href="#/tournaments/milano-open-2026">
          <span className="live-dot" />
          <span><small>{text.hero.next}</small><strong>Milano Open LAN</strong></span>
          <span><small>14 NOV · 09:30</small><strong><MapPin size={14} /> {text.hero.location}</strong></span>
          <ChevronRight />
        </a>
      </section>
      <section className="stats-band">
        <div><strong>12</strong><span>{text.hero.statEvents}</span></div><div><strong>680+</strong><span>{text.hero.statPlayers}</span></div><div><strong>7</strong><span>{text.hero.statCities}</span></div>
      </section>
      <section className="page-section">
        <SectionHeading eyebrow={text.home.tournamentsEyebrow} title={text.home.tournamentsTitle} body={text.home.tournamentsBody} action={<a className="text-link" href="#/tournaments">{text.common.viewAll}<ArrowRight size={16} /></a>} />
        <div className="tournament-grid">{tournaments.slice(0, 3).map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} language={language} text={text} />)}</div>
      </section>
      <section className="manifesto-band">
        <div className="manifesto-image"><img src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1600&q=85" alt="Competitive gaming team at an event" /></div>
        <div className="manifesto-copy"><ShieldCheck size={40} /><h2>{text.home.manifesto}</h2><p>{text.home.manifestoBody}</p><a className="text-link" href="#/about">{text.common.learnMore}<ArrowRight size={16} /></a></div>
      </section>
      <section className="page-section players-preview">
        <SectionHeading eyebrow={text.home.playersEyebrow} title={text.home.playersTitle} body={text.home.playersBody} action={<a className="text-link" href="#/players">{text.common.viewAll}<ArrowRight size={16} /></a>} />
        <div className="player-list">{players.slice(0, 4).map((player, index) => <PlayerCard key={player.id} player={player} rank={index + 1} text={text} />)}</div>
      </section>
    </>
  );
}

function TournamentsPage({ language, text }: { language: Language; text: SiteContent }) {
  const [filter, setFilter] = useState<"all" | "available" | "past">("all");
  const filtered = tournaments.filter((tournament) => filter === "all" || (filter === "past" ? tournament.status === "completed" : tournament.status === "open" || tournament.status === "limited"));
  return (
    <div className="page-shell">
      <section className="page-intro tournaments-intro"><div><p className="eyebrow">{text.tournaments.eyebrow}</p><h1>{text.tournaments.title}</h1><p>{text.tournaments.body}</p></div><Trophy size={84} /></section>
      <section className="page-section compact-top">
        <div className="filter-bar" role="group" aria-label="Tournament filters">{(["all", "available", "past"] as const).map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{text.tournaments[item]}</button>)}</div>
        <div className="tournament-grid">{filtered.map((tournament) => <TournamentCard key={tournament.id} tournament={tournament} language={language} text={text} />)}</div>
      </section>
      <section className="steps-band"><div><p className="eyebrow">01—03</p><h2>{text.tournaments.requirements}</h2></div>{text.tournaments.requirementItems.map((item, index) => <div className="step" key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</section>
    </div>
  );
}

function TournamentDetail({ tournament, language, text, setAuthMode }: { tournament: Tournament; language: Language; text: SiteContent; setAuthMode: (mode: AuthMode) => void }) {
  return (
    <div className="detail-page">
      <section className="detail-hero">
        <img src={tournament.image} alt="" />
        <div className="detail-overlay" />
        <div className="detail-copy"><a className="back-link" href="#/tournaments"><ArrowLeft size={18} />{text.common.back}</a><StatusPill status={tournament.status} text={text} /><p className="eyebrow">{tournament.game}</p><h1>{tournament.name}</h1><p>{tournament.description[language]}</p></div>
      </section>
      <section className="detail-facts">
        <div><CalendarDays /><span><small>{text.common.date}</small>{formatDate(tournament.date, language, true)}</span></div>
        <div><Clock3 /><span><small>{text.common.time}</small>{tournament.time}</span></div>
        <div><MapPin /><span><small>{text.common.location}</small>{tournament.location}</span></div>
        <div><Trophy /><span><small>{text.common.prize}</small>{tournament.prizePool}</span></div>
      </section>
      <section className="detail-layout page-section">
        <div className="detail-main">
          <h2>{text.tournaments.rules}</h2>
          <ul className="check-list">{tournament.rules.map((rule) => <li key={rule.it}><Check size={18} />{rule[language]}</li>)}</ul>
          <h2>{text.tournaments.schedule}</h2>
          <div className="schedule">{tournament.schedule.map((item) => <div key={item.time}><time>{item.time}</time><span>{item.label[language]}</span></div>)}</div>
          <h2>{text.tournaments.participation}</h2><p>{text.tournaments.participationBody}</p>
        </div>
        <aside className="registration-panel">
          <p className="eyebrow">{tournament.registered}/{tournament.capacity} {text.common.registered}</p><h2>{text.tournaments.registrationTitle}</h2><p>{text.tournaments.registrationBody}</p>
          <dl><div><dt>{text.common.format}</dt><dd>{tournament.format}</dd></div><div><dt>{text.common.platform}</dt><dd>{tournament.platform}</dd></div><div><dt>{text.common.capacity}</dt><dd>{tournament.capacity} {text.common.spots}</dd></div></dl>
          <button className="button primary full" disabled={tournament.status === "completed" || tournament.status === "closed"} onClick={() => setAuthMode("register")}>{tournament.status === "completed" ? text.status.completed : text.tournaments.register}<ArrowRight size={17} /></button>
        </aside>
      </section>
    </div>
  );
}

function PlayersPage({ text, setAuthMode }: { text: SiteContent; setAuthMode: (mode: AuthMode) => void }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const filtered = players.filter((player) => [player.username, player.team, player.country, player.platform].some((value) => value?.toLowerCase().includes(normalized)));
  return (
    <div className="page-shell">
      <section className="page-intro"><div><p className="eyebrow">{text.players.eyebrow}</p><h1>{text.players.title}</h1><p>{text.players.body}</p></div><Users size={84} /></section>
      <section className="page-section compact-top">
        <label className="search-field"><Search size={19} /><span className="sr-only">{text.common.search}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.players.placeholder} /></label>
        <div className="ranking-head"><span>{text.players.ranking}</span><span>{filtered.length} {text.players.player}</span></div>
        <div className="player-list full-list">{filtered.map((player) => <PlayerCard key={player.id} player={player} rank={players.indexOf(player) + 1} text={text} />)}{filtered.length === 0 && <p className="empty-state">{text.players.empty}</p>}</div>
      </section>
      <section className="join-band"><div><Gamepad2 size={44} /><h2>{text.players.joinTitle}</h2><p>{text.players.joinBody}</p></div><button className="button primary" onClick={() => setAuthMode("register")}>{text.auth.register}<ArrowRight size={17} /></button></section>
    </div>
  );
}

function EventsPage({ language, text }: { language: Language; text: SiteContent }) {
  return (
    <div className="page-shell">
      <section className="page-intro events-intro"><div><p className="eyebrow">{text.events.eyebrow}</p><h1>{text.events.title}</h1><p>{text.events.body}</p></div><MapPin size={84} /></section>
      {(["upcoming", "past"] as const).map((status) => <section className="page-section event-section" key={status}><SectionHeading eyebrow={`0${status === "upcoming" ? 1 : 2}`} title={text.events[status]} /><div className="event-grid">{events.filter((event) => event.status === status).map((event) => <article className="event-card" key={event.id}><div className="event-image"><img src={event.image} alt="" /><StatusPill status={event.status} text={text} /></div><div><p className="card-date">{formatDate(event.date, language, true)}</p><h3>{event.name[language]}</h3><p className="event-location"><MapPin size={16} />{event.location}</p><p>{event.description[language]}</p><button className="text-link">{status === "past" ? text.events.gallery : text.events.info}<ArrowRight size={16} /></button></div></article>)}</div></section>)}
    </div>
  );
}

function RulesPage({ language, text }: { language: Language; text: SiteContent }) {
  return (
    <div className="page-shell">
      <section className="page-intro"><div><p className="eyebrow">{text.rules.eyebrow}</p><h1>{text.rules.title}</h1><p>{text.rules.body}</p></div><ShieldCheck size={84} /></section>
      <section className="page-section rules-layout">
        <div className="rules-docs"><article><span>PDF · 1.2 MB</span><h2>{text.rules.general}</h2><p>{text.rules.generalBody}</p><small>{text.rules.updated}</small><button className="button secondary" onClick={() => window.print()}><Download size={17} />{text.rules.download}</button></article><article><span>PDF · 860 KB</span><h2>{text.rules.competitive}</h2><p>{text.rules.competitiveBody}</p><small>{text.rules.updated}</small><button className="button secondary" onClick={() => window.print()}><Download size={17} />{text.rules.download}</button></article></div>
        <aside className="principles-panel"><p className="eyebrow">ICDC STANDARD</p><ol>{text.rules.principles.map((principle, index) => <li key={principle}><span>0{index + 1}</span>{principle}</li>)}</ol></aside>
      </section>
      <section className="page-section tournament-rules"><SectionHeading eyebrow="RULESETS" title={text.rules.specific} />{tournaments.slice(0, 3).map((tournament) => <a href={`#/tournaments/${tournament.id}`} key={tournament.id}><span><strong>{tournament.name}</strong><small>{formatDate(tournament.date, language)}</small></span><ChevronRight /></a>)}</section>
    </div>
  );
}

function AboutPage({ text }: { text: SiteContent }) {
  return (
    <div className="about-page page-shell">
      <section className="about-hero"><div><p className="eyebrow">{text.about.eyebrow}</p><h1>{text.about.title}</h1><p>{text.about.body}</p></div><img src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1600&q=85" alt="Crowd watching an esports stage" /></section>
      <section className="mission page-section"><div><p className="eyebrow">01 · MISSION</p><h2>{text.about.missionTitle}</h2></div><p>{text.about.missionBody}</p></section>
      <section className="values page-section"><SectionHeading eyebrow="02 · VALUES" title={text.about.valuesTitle} /><div className="values-grid">{text.about.values.map((value, index) => <article key={value.title}><span>0{index + 1}</span><h3>{value.title}</h3><p>{value.body}</p></article>)}</div></section>
      <p className="legal-line">{text.about.legal}</p>
    </div>
  );
}

function ContactPage({ text }: { text: SiteContent }) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); event.currentTarget.reset(); };
  return (
    <div className="page-shell contact-page">
      <section className="page-intro"><div><p className="eyebrow">{text.contact.eyebrow}</p><h1>{text.contact.title}</h1><p>{text.contact.body}</p></div><Mail size={84} /></section>
      <section className="contact-layout page-section">
        <div className="contact-links"><a href="mailto:info@italiancodcircuit.it"><Mail /><span><small>{text.contact.email}</small><strong>info@italiancodcircuit.it</strong></span><ArrowRight /></a><a href="https://discord.com" target="_blank" rel="noreferrer"><MessageCircle /><span><small>{text.contact.discord}</small><strong>discord.gg/icdc</strong></span><ArrowRight /></a><a href="https://instagram.com" target="_blank" rel="noreferrer"><Camera /><span><small>{text.contact.social}</small><strong>@italiancodcircuit</strong></span><ArrowRight /></a></div>
        <form className="contact-form" onSubmit={submit}><h2>{text.contact.formTitle}</h2><div className="form-row"><label>{text.contact.name}<input required name="name" autoComplete="name" /></label><label>{text.contact.emailLabel}<input required type="email" name="email" autoComplete="email" /></label></div><label>{text.contact.topic}<select name="topic">{text.contact.topics.map((topic) => <option key={topic}>{topic}</option>)}</select></label><label>{text.contact.message}<textarea required name="message" rows={6} /></label><p className="privacy-note">{text.contact.privacy}</p>{sent && <p className="success-message" role="status"><Check size={17} />{text.common.success}</p>}<button className="button primary" type="submit">{text.common.submit}<ArrowRight size={17} /></button></form>
      </section>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem("icdc-language") === "en" ? "en" : "it");
  const [route, setRoute] = useState<Route>(parseRoute);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const text = content[language] as SiteContent;

  useEffect(() => {
    const handleRoute = () => { setRoute(parseRoute()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", handleRoute);
    if (!window.location.hash) window.location.hash = "/home";
    return () => window.removeEventListener("hashchange", handleRoute);
  }, []);

  useEffect(() => {
    localStorage.setItem("icdc-language", language);
    document.documentElement.lang = language;
    document.title = language === "it" ? "Italian CoD Circuit | Competizione dal vivo" : "Italian CoD Circuit | Live competition";
  }, [language]);

  let page: ReactNode;
  if (route.page === "tournament") {
    const tournament = tournaments.find((item) => item.id === route.id);
    page = tournament ? <TournamentDetail tournament={tournament} language={language} text={text} setAuthMode={setAuthMode} /> : <TournamentsPage language={language} text={text} />;
  } else {
    page = {
      home: <HomePage language={language} text={text} setAuthMode={setAuthMode} />,
      tournaments: <TournamentsPage language={language} text={text} />,
      players: <PlayersPage text={text} setAuthMode={setAuthMode} />,
      events: <EventsPage language={language} text={text} />,
      rules: <RulesPage language={language} text={text} />,
      about: <AboutPage text={text} />,
      contact: <ContactPage text={text} />,
    }[route.page];
  }

  return (
    <div className="app">
      <Header language={language} setLanguage={setLanguage} text={text} route={route} setAuthMode={setAuthMode} />
      <main>{page}</main>
      <Footer text={text} />
      {authMode && <AuthModal mode={authMode} setMode={setAuthMode} text={text} />}
    </div>
  );
}
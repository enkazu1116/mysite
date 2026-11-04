import { Link } from "react-router";

export default function Header() {
  return (
    <header className="portfolio-topbar" data-app-header>
      <Link className="topbar-home" to="/">
        <b>⌘</b> / home
      </Link>
      <nav aria-label="サイトナビゲーション" className="landing-nav">
        <Link to="/#about">About</Link>
        <Link to="/skills">Skills</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/books">Books</Link>
      </nav>
      <Link to="/#connect">
        contact
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </header>
  );
}

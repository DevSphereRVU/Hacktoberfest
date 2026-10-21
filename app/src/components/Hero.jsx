export default function Hero({ kicker, title, subtitle, count }) {
  return (
    <header className="hero">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-art" src="/hf-corner.png" alt="Hosted by Hacktoberfest 2026" />
      <div className="hero-inner">
        <div>
          {kicker && <p className="kicker">{kicker}</p>}
          <h1 className="title">{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
        {typeof count === "number" && (
          <div className="count" aria-label={`${count} contributors`}>
            <b>{count}</b>
            <span>{count === 1 ? "contributor" : "contributors"}</span>
          </div>
        )}
      </div>
    </header>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/Avatar";

export default function Wall({ profiles }) {
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return profiles;
    return profiles.filter((p) =>
      [p.name, p.username, p.github, p.role, p.bio].some((v) => v && v.toLowerCase().includes(s))
    );
  }, [q, profiles]);

  return (
    <>
      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Search names, roles, bios…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search contributors"
        />
        <span className="sortnote">Newest merges first</span>
        <a className="btn" href="#join">
          Add your card →
        </a>
      </div>

      <main className="wall">
        {shown.length === 0 && (
          <div className="empty">
            {profiles.length === 0 ? "The wall is empty. Be the first pull request!" : `No one matches “${q}”.`}
          </div>
        )}
        {shown.map((p, i) => (
          <Link key={p.username} href={`/u/${p.username}`} className="card" style={{ animationDelay: `${Math.min(i, 20) * 30}ms` }}>
            <div className="card-top">
              <Avatar src={p.photo} name={p.name} lazy />
              <div>
                <p className="name">
                  <span className="hl">{p.name}</span>
                </p>
                {p.role && <p className="role">{p.role}</p>}
              </div>
            </div>
            <p className="bio">{p.bio.length > 160 ? p.bio.slice(0, 157) + "…" : p.bio}</p>
            {p.pr && (
              <p className="prtime" title={`PR #${p.pr.number} opened ${p.pr.openedDay} ${p.pr.openedClock}, merged ${p.pr.mergedDay} ${p.pr.mergedClock} IST`}>
                <span className="dot" />
                PR #{p.pr.number} · merged <b>{p.pr.mergedClock}</b> IST
                <span className="took">opened {p.pr.openedClock} · {p.pr.took} to merge</span>
              </p>
            )}
            <div className="handle">
              <span>@{p.github}</span>
              {p.emoji && <span className="emoji">{p.emoji}</span>}
            </div>
          </Link>
        ))}
      </main>
    </>
  );
}

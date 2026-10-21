import Link from "next/link";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import Avatar from "@/components/Avatar";
import { getProfile, getProfiles, REPO_URL } from "@/lib/profiles";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProfiles().map((p) => ({ username: p.username }));
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  const p = getProfile(username);
  if (!p) return {};
  return { title: `${p.name} · RVU Contributors Wall`, description: p.bio.slice(0, 150) };
}

const LABELS = { github: "GitHub", linkedin: "LinkedIn", x: "X", website: "Website", instagram: "Instagram" };

export default async function ProfilePage({ params }) {
  const { username } = await params;
  const p = getProfile(username);
  if (!p) notFound();
  const links = { github: `https://github.com/${p.github}`, ...p.links };

  return (
    <>
      <Hero kicker="Hacktoberfest 2026 · RVU Contributors Wall" title={p.name} />
      <main className="profile">
        <Link className="back" href="/">
          ← Back to the wall
        </Link>
        <article className="profile-card">
          <Avatar src={p.photo} name={p.name} />
          <div>
            <h2 className="name">
              <span className="hl">{p.name}</span> {p.emoji}
            </h2>
            {p.role && <p className="role" style={{ fontSize: 15 }}>{p.role}</p>}
            <p className="bio">{p.bio}</p>
            <div className="links">
              {Object.entries(links).map(([k, url]) => (
                <a key={k} className="chip" href={url} target="_blank" rel="noopener noreferrer nofollow">
                  {LABELS[k] || k} ↗
                </a>
              ))}
            </div>
          </div>
        </article>
        <p style={{ fontSize: 13, marginTop: 18 }}>
          This card lives in{" "}
          <a href={`${REPO_URL}/tree/main/profiles/${p.username}`}>profiles/{p.username}</a>. Edit it with a pull request.
        </p>
      </main>
      <footer>Hacktoberfest 2026 · DevSphere × FOSS RVU</footer>
    </>
  );
}

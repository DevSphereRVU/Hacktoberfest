import Hero from "@/components/Hero";
import Wall from "@/components/Wall";
import { getProfiles, REPO_URL } from "@/lib/profiles";

export default function Home() {
  const profiles = getProfiles();
  return (
    <>
      <Hero
        kicker="DevSphere × FOSS RVU · RV University, Bengaluru"
        title="The Contributors Wall"
        subtitle="Every card on this wall is a merged pull request. Fork the repo, add your folder, open a pull request, and watch yourself show up here."
        count={profiles.length}
      />
      <Wall profiles={profiles} />

      <section className="join" id="join">
        <div className="join-box">
          <h2>Add your card in 4 steps</h2>
          <pre>
            <span className="c"># 1. Fork {REPO_URL.replace("https://", "")} on GitHub, then:</span>
            {"\n"}
            <span className="p">$ </span>git clone https://github.com/YOUR-USERNAME/Hacktoberfest.git
            {"\n"}
            <span className="p">$ </span>cd Hacktoberfest/profiles
            {"\n"}
            <span className="p">$ </span>cp -r test-user YOUR-USERNAME
            {"\n"}
            <span className="c"># 2. Edit the .md file, swap test.jpg for your photo</span>
            {"\n"}
            <span className="p">$ </span>git status
            {"\n"}
            <span className="p">$ </span>git add .
            {"\n"}
            <span className="p">$ </span>git commit -m "Add YOUR-USERNAME to the wall"
            {"\n"}
            <span className="p">$ </span>git push origin main
            {"\n"}
            <span className="c"># 3. Open a pull request on GitHub   4. Get merged, refresh this page</span>
          </pre>
        </div>
        <p style={{ marginTop: 16 }}>
          <a className="btn dark" href={`${REPO_URL}#readme`}>
            Full guide on GitHub →
          </a>
        </p>
      </section>

      <footer>Hacktoberfest 2026 · DevSphere × FOSS RVU · 23 October 2026</footer>
    </>
  );
}

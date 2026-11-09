import { useEffect, useState, type FormEvent } from "react";
import {
  CERTS,
  CODING_PROFILES,
  CONTACT,
  EXPERIENCE,
  formatTenure,
  HANDLES,
  LEARNING,
  PROFICIENCIES,
  PROFILE,
  PROJECTS,
  SKILL_LOADOUT,
  STATIONS,
  STATS_SNAPSHOT,
  type StationId,
} from "./data";
import { closePanel, game, useGame } from "./store";
import { sound } from "./sound";
import { useCodingStats } from "./stats";
import { ContribHeatmap } from "./ContribHeatmap";

const FORMSPREE_URL = "https://formspree.io/f/xandabjd";

/** Station panel shown over the 3D lobby. */
export function PanelOverlay() {
  const panel = useGame((s) => s.panel);

  useEffect(() => {
    if (!panel) return;
    // Esc can't re-grab the mouse (browsers don't count it as a user gesture), so it goes to the pause menu.
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") closePanel(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  if (!panel) return null;
  return (
    <div className="vl-panel-wrap">
      <SectionView
        station={panel.station}
        item={panel.item}
        onSwitch={(station) => game.set({ panel: { station } })}
        onClose={() => closePanel(true)}
        closeLabel="Back to lobby"
      />
    </div>
  );
}

/** The tabbed portfolio card. Used in the lobby and as the standalone browse page. */
export function SectionView({
  station,
  item,
  onSwitch,
  onClose,
  closeLabel,
}: {
  station: StationId;
  item?: number;
  onSwitch: (station: StationId) => void;
  onClose: () => void;
  closeLabel: string;
}) {
  return (
    <div className="vl-panel">
      <nav className="vl-panel__tabs">
        {STATIONS.map((st) => (
          <button
            key={st.id}
            className={`vl-tab ${station === st.id ? "is-active" : ""}`}
            onClick={() => {
              sound.uiClick();
              onSwitch(st.id);
            }}
            onMouseEnter={() => sound.uiHover()}
          >
            <kbd>{st.key}</kbd>
            {st.label}
          </button>
        ))}
        <button className="vl-panel__close" onClick={onClose}>
          {closeLabel} ✕
        </button>
      </nav>
      <div className="vl-panel__body" key={station}>
        {station === "projects" && <ProjectsPanel initial={item ?? 0} />}
        {station === "arsenal" && <ArsenalPanel highlight={item} />}
        {station === "trophies" && <TrophiesPanel highlight={item} />}
        {station === "profile" && <ProfilePanel onSwitch={onSwitch} />}
        {station === "comms" && <CommsPanel />}
        {station === "career" && <CareerPanel />}
        {station === "ranked" && <RankedPanel />}
      </div>
    </div>
  );
}

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const click = () => sound.uiClick();

function ProjectsPanel({ initial }: { initial: number }) {
  const [sel, setSel] = useState(initial);
  const p = PROJECTS[sel];
  return (
    <div className="vl-projects">
      <div className="vl-projects__detail">
        <div className="vl-projects__shot">
          <img src={p.image} alt={p.title} />
          <span className="vl-tag">{p.category}</span>
        </div>
        <p className="vl-kicker">
          Project {String(sel + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
        </p>
        <h2 className="vl-title">{p.title}</h2>
        <p className="vl-text">{p.description}</p>
        <div className="vl-chips">
          {p.technologies.map((t) => (
            <span key={t} className="vl-chip vl-chip--static">
              {t}
            </span>
          ))}
        </div>
        <div className="vl-actions">
          <a className="vl-btn vl-btn--primary" href={p.githubUrl} {...ext} onClick={click}>
            View code
          </a>
          {p.liveUrl && (
            <a className="vl-btn" href={p.liveUrl} {...ext} onClick={click}>
              Live demo ↗
            </a>
          )}
        </div>
      </div>
      <div className="vl-projects__grid">
        {PROJECTS.map((proj, i) => (
          <button
            key={proj.title}
            className={`vl-agentcard ${i === sel ? "is-active" : ""}`}
            onClick={() => {
              click();
              setSel(i);
            }}
            onMouseEnter={() => sound.uiHover()}
          >
            <img src={proj.image} alt="" />
            <span>{proj.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ArsenalPanel({ highlight }: { highlight?: number }) {
  return (
    <div className="vl-arsenal">
      <div>
        <p className="vl-kicker">Loadout</p>
        <h2 className="vl-title">Arsenal</h2>
        <div className="vl-loadout">
          {SKILL_LOADOUT.map((s, i) => (
            <div key={s.title} className={`vl-weapon ${highlight === i ? "is-active" : ""}`}>
              <div className="vl-weapon__head">
                <b>{s.weapon}</b>
                <small>{s.title}</small>
              </div>
              <div className="vl-chips">
                {s.skills.map((k) => (
                  <span key={k} className="vl-chip vl-chip--static">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="vl-kicker">Combat stats</p>
        <div className="vl-stats">
          {PROFICIENCIES.map((p, i) => (
            <div key={p.skill} className="vl-stat">
              <div className="vl-stat__label">
                <span>
                  {p.skill} <small>{p.detail}</small>
                </span>
                <b>{p.level}</b>
              </div>
              <div className="vl-stat__track">
                <i style={{ width: `${p.level}%`, animationDelay: `${i * 70}ms` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="vl-kicker vl-gap">Unlocking next</p>
        <div className="vl-chips">
          {LEARNING.map((l) => (
            <span key={l} className="vl-chip vl-chip--locked">
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrophiesPanel({ highlight }: { highlight?: number }) {
  return (
    <div>
      <p className="vl-kicker">Certificates & wins</p>
      <h2 className="vl-title">Trophies</h2>
      <div className="vl-trophies">
        {CERTS.map((c, i) => (
          <article key={c.title} className={`vl-trophy ${c.featured ? "is-featured" : ""} ${highlight === i ? "is-active" : ""}`}>
            <div className="vl-trophy__top">
              <span className="vl-tag">{c.badge}</span>
              <small>{c.date}</small>
            </div>
            <h3>{c.title}</h3>
            <p className="vl-trophy__issuer">{c.issuer}</p>
            <p className="vl-text">{c.summary}</p>
            <div className="vl-chips">
              {c.skills.map((s) => (
                <span key={s} className="vl-chip vl-chip--static">
                  {s}
                </span>
              ))}
            </div>
            {c.url && (
              <a className="vl-link" href={c.url} {...ext} onClick={click}>
                View credential ↗
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function ProfilePanel({ onSwitch }: { onSwitch: (s: StationId) => void }) {
  const job = EXPERIENCE[0];
  return (
    <div className="vl-profile">
      <div className="vl-profile__portrait">
        <img src="/profile.jpeg" alt={PROFILE.name} />
        <div className="vl-profile__class">
          <small>Class</small>
          <b>{PROFILE.agentClass}</b>
        </div>
      </div>
      <div>
        <p className="vl-kicker">Agent · {PROFILE.origin}</p>
        <h2 className="vl-title vl-title--huge">{PROFILE.name}</h2>
        <p className="vl-role">{PROFILE.role}</p>
        {job && (
          <button className="vl-now" onClick={() => onSwitch("career")} onMouseEnter={() => sound.uiHover()}>
            <i />
            Now: {job.role} at {job.company}
            <small>{formatTenure(job.start, job.end)}</small>
          </button>
        )}
        <div className="vl-profile__stats">
          {PROFILE.stats.map((s) => (
            <div key={s.label}>
              <b>{s.value}</b>
              <small>{s.label}</small>
            </div>
          ))}
        </div>
        <div className="vl-bio">
          {PROFILE.bio.map((b) => (
            <p key={b} className="vl-text">
              {b}
            </p>
          ))}
        </div>
        <p className="vl-kicker vl-gap">Origin story</p>
        <div className="vl-edu">
          {PROFILE.education.map((e) => (
            <div key={e.degree}>
              <b>{e.degree}</b>
              <span>{e.school}</span>
              <small>{e.period}</small>
            </div>
          ))}
        </div>
        <div className="vl-actions">
          <a className="vl-btn vl-btn--primary" href={CONTACT.resume} {...ext} onClick={click}>
            Download resume
          </a>
        </div>
      </div>
    </div>
  );
}

function CareerPanel() {
  return (
    <div>
      <p className="vl-kicker">Missions</p>
      <h2 className="vl-title">Career</h2>
      <div className="vl-missions">
        {EXPERIENCE.map((x) => (
          <article key={x.company + x.start} className={`vl-mission ${x.end ? "" : "is-active"}`}>
            <div className="vl-mission__head">
              <span className="vl-tag">{x.end ? "Completed" : "Active mission"}</span>
              <small>{formatTenure(x.start, x.end)}</small>
            </div>
            <h3>{x.role}</h3>
            <a className="vl-mission__company" href={x.companyUrl} {...ext} onClick={click}>
              {x.company} ↗
            </a>
            <p className="vl-text">{x.summary}</p>
            <div className="vl-chips">
              {x.stack.map((s) => (
                <span key={s} className="vl-chip vl-chip--static">
                  {s}
                </span>
              ))}
            </div>
          </article>
        ))}
        <article className="vl-mission">
          <div className="vl-mission__head">
            <span className="vl-tag vl-tag--muted">Training</span>
            <small>{PROFILE.education[0].period}</small>
          </div>
          <h3>{PROFILE.education[0].degree}</h3>
          <span className="vl-mission__company">{PROFILE.education[0].school}</span>
          <p className="vl-text">Hackathon winner (Paranox 2.0), 1,200+ problems solved across LeetCode, GFG and CodeChef.</p>
        </article>
      </div>
    </div>
  );
}

function RankedPanel() {
  const s = useCodingStats();
  const lc = s.leetcode;
  const gh = s.github;
  const lcTotal = lc.easy + lc.medium + lc.hard || 1;
  const solvedAll = lc.solved + s.gfg.solved + s.codechef.solved;

  return (
    <div>
      <div className="vl-ranked__head">
        <div>
          <p className="vl-kicker">Coding profiles</p>
          <h2 className="vl-title">Ranked</h2>
        </div>
        <div className="vl-ranked__total">
          <b>{solvedAll.toLocaleString()}</b>
          <small>problems solved</small>
        </div>
      </div>

      <div className="vl-ranked">
        <a className="vl-rankcard" href={`https://leetcode.com/u/${HANDLES.leetcode}/`} {...ext} onClick={click}>
          <div className="vl-rankcard__top">
            <b>LeetCode</b>
            <Freshness live={lc.live} />
          </div>
          <div className="vl-rankcard__big">{lc.solved}</div>
          <small>solved · rank #{lc.ranking.toLocaleString()}</small>
          <div className="vl-split">
            <i style={{ flex: lc.easy, background: "#00b8a3" }} />
            <i style={{ flex: lc.medium, background: "#ffc01e" }} />
            <i style={{ flex: lc.hard, background: "#ef4743" }} />
          </div>
          <div className="vl-split__legend">
            <span>Easy {lc.easy}</span>
            <span>Med {lc.medium}</span>
            <span>Hard {lc.hard}</span>
          </div>
          <small className="vl-rankcard__foot">
            {lc.activeDays} active days · {Math.round((lc.hard / lcTotal) * 100)}% hard
          </small>
        </a>

        <a className="vl-rankcard" href={`https://www.geeksforgeeks.org/user/${HANDLES.gfg}/`} {...ext} onClick={click}>
          <div className="vl-rankcard__top">
            <b>GeeksforGeeks</b>
            <Freshness live={false} />
          </div>
          <div className="vl-rankcard__big">{s.gfg.solved}</div>
          <small>solved · coding score {s.gfg.score}</small>
          <small className="vl-rankcard__foot">#{s.gfg.instituteRank.toLocaleString()} in LPU</small>
        </a>

        <a className="vl-rankcard" href={`https://www.codechef.com/users/${HANDLES.codechef}`} {...ext} onClick={click}>
          <div className="vl-rankcard__top">
            <b>CodeChef</b>
            <Freshness live={false} />
          </div>
          <div className="vl-rankcard__big">{s.codechef.solved}</div>
          <small>problems solved</small>
        </a>
      </div>

      <div className="vl-github">
        <div className="vl-github__head">
          <div>
            <b>GitHub</b> <small>@{HANDLES.github}</small> <Freshness live={gh.live} />
          </div>
          <div className="vl-github__nums">
            <span>
              <b>{gh.contributionsLastYear}</b> contributions this year
            </span>
            <span>
              <b>{gh.repoCount}</b> repos
            </span>
            <span>
              <b>{gh.followers}</b> followers
            </span>
          </div>
        </div>
        {gh.days ? (
          <ContribHeatmap days={gh.days} color="var(--accent)" />
        ) : (
          <p className="vl-text">Contribution graph is loading…</p>
        )}
        {gh.recent.length > 0 && (
          <>
            <p className="vl-kicker vl-gap">Recently pushed</p>
            <div className="vl-repos">
              {gh.recent.map((r) => (
                <a key={r.name} className="vl-repo" href={r.url} {...ext} onClick={click}>
                  <b>{r.name}</b>
                  <span>{r.description ?? "No description"}</span>
                  <small>
                    {r.language ?? "—"} · {new Date(r.pushedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </small>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="vl-chips vl-gap">
        {CODING_PROFILES.map((p) => (
          <a key={p.name} className="vl-chip" href={p.url} {...ext} onClick={click}>
            {p.name} ↗
          </a>
        ))}
      </div>
    </div>
  );
}

function Freshness({ live }: { live: boolean }) {
  return live ? <span className="vl-live">Live</span> : <span className="vl-snapshot">{STATS_SNAPSHOT.asOf}</span>;
}

function CommsPanel() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    click();
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value })),
    // Typing must not reach the lobby's movement and hotkey handlers.
    onKeyDown: (e: { stopPropagation: () => void }) => e.stopPropagation(),
  });

  return (
    <div className="vl-comms">
      <div>
        <p className="vl-kicker">Open channel</p>
        <h2 className="vl-title">Comms</h2>
        <p className="vl-text">Looking for a full-stack developer for your team, a role or a hackathon squad? Ping me.</p>
        <div className="vl-comms__list">
          <a href={`mailto:${CONTACT.email}`} onClick={click}>
            <small>Email</small>
            <b>{CONTACT.email}</b>
          </a>
          <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} onClick={click}>
            <small>Phone</small>
            <b>{CONTACT.phone}</b>
          </a>
          <div>
            <small>Location</small>
            <b>{CONTACT.location}</b>
          </div>
          {CONTACT.socials.map((s) => (
            <a key={s.label} href={s.url} {...ext} onClick={click}>
              <small>{s.label}</small>
              <b>{s.handle} ↗</b>
            </a>
          ))}
        </div>
      </div>
      <form className="vl-form" onSubmit={submit}>
        <p className="vl-kicker">Send a message</p>
        <label>
          <span>Name</span>
          <input required maxLength={80} {...field("name")} />
        </label>
        <label>
          <span>Email</span>
          <input required type="email" maxLength={120} {...field("email")} />
        </label>
        <label>
          <span>Message</span>
          <textarea required rows={5} maxLength={2000} {...field("message")} />
        </label>
        <div className="vl-actions">
          <button className="vl-btn vl-btn--primary" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send"}
          </button>
          <a className="vl-btn" href={CONTACT.resume} {...ext} onClick={click}>
            Resume
          </a>
        </div>
        {status === "sent" && <p className="vl-form__ok">Message sent. I'll get back to you soon.</p>}
        {status === "error" && <p className="vl-form__err">Couldn't send. Email me directly at {CONTACT.email}.</p>}
      </form>
    </div>
  );
}

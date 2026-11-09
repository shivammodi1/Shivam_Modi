import { useEffect, useState } from "react";
import { HANDLES, STATS_SNAPSHOT } from "./data";

// LeetCode has no CORS-enabled official API; this public mirror does (it sleeps when idle, hence the long timeout).
const LEETCODE_API = `https://alfa-leetcode-api.onrender.com/${HANDLES.leetcode}`;
const GITHUB_API = `https://api.github.com/users/${HANDLES.github}`;
const CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${HANDLES.github}?y=last`;
const CACHE_KEY = "sm-coding-stats-v2";
const CACHE_MS = 30 * 60 * 1000;
const RECENT_REPOS = 6;

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface Repo {
  name: string;
  url: string;
  language: string | null;
  description: string | null;
  stars: number;
  pushedAt: string;
}

export interface CodingStats {
  leetcode: typeof STATS_SNAPSHOT.leetcode & { live: boolean };
  gfg: typeof STATS_SNAPSHOT.gfg;
  codechef: typeof STATS_SNAPSHOT.codechef;
  github: typeof STATS_SNAPSHOT.github & { live: boolean; days: ContributionDay[] | null; recent: Repo[] };
}

const initial: CodingStats = {
  leetcode: { ...STATS_SNAPSHOT.leetcode, live: false },
  gfg: STATS_SNAPSHOT.gfg,
  codechef: STATS_SNAPSHOT.codechef,
  github: { ...STATS_SNAPSHOT.github, live: false, days: null, recent: [] },
};

let stats: CodingStats = readCache() ?? initial;
let inflight: Promise<void> | null = null;
const listeners = new Set<(s: CodingStats) => void>();

function publish(patch: (s: CodingStats) => CodingStats) {
  stats = patch(stats);
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), stats }));
  } catch {
    // Cache is an optimisation only.
  }
  listeners.forEach((l) => l(stats));
}

function readCache(): CodingStats | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, stats: cached } = JSON.parse(raw);
    return Date.now() - at < CACHE_MS ? cached : null;
  } catch {
    return null;
  }
}

async function getJson(url: string, timeoutMs: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

const num = (v: unknown, fallback: number) => (typeof v === "number" && Number.isFinite(v) ? v : fallback);

async function loadLeetcode() {
  const [solved, profile, calendar] = await Promise.allSettled([
    getJson(`${LEETCODE_API}/solved`, 45000),
    getJson(LEETCODE_API, 45000),
    getJson(`${LEETCODE_API}/calendar`, 45000),
  ]);
  if (solved.status !== "fulfilled" || typeof solved.value?.solvedProblem !== "number") return;
  const s = solved.value;
  const p = profile.status === "fulfilled" ? profile.value : null;
  const c = calendar.status === "fulfilled" ? calendar.value : null;
  publish((cur) => ({
    ...cur,
    leetcode: {
      solved: s.solvedProblem,
      easy: num(s.easySolved, cur.leetcode.easy),
      medium: num(s.mediumSolved, cur.leetcode.medium),
      hard: num(s.hardSolved, cur.leetcode.hard),
      ranking: num(p?.ranking, cur.leetcode.ranking),
      activeDays: num(c?.totalActiveDays, cur.leetcode.activeDays),
      streak: num(c?.streak, cur.leetcode.streak),
      live: true,
    },
  }));
}

async function loadGithub() {
  const [user, repoList, contrib] = await Promise.allSettled([
    getJson(GITHUB_API, 10000),
    getJson(`${GITHUB_API}/repos?per_page=100&sort=pushed`, 10000),
    getJson(CONTRIB_API, 15000),
  ]);
  const u = user.status === "fulfilled" && user.value?.login ? user.value : null;
  const list = repoList.status === "fulfilled" && Array.isArray(repoList.value) ? repoList.value : null;
  const c = contrib.status === "fulfilled" && Array.isArray(contrib.value?.contributions) ? contrib.value : null;
  if (!u && !list && !c) return;

  publish((cur) => ({
    ...cur,
    github: {
      repoCount: num(u?.public_repos, cur.github.repoCount),
      followers: num(u?.followers, cur.github.followers),
      contributionsLastYear: num(c?.total?.lastYear, cur.github.contributionsLastYear),
      days: c ? (c.contributions as ContributionDay[]) : cur.github.days,
      recent: list
        ? list
            // Skip forks and the profile-README repo.
            .filter((r) => !r.fork && r.name !== HANDLES.github)
            .slice(0, RECENT_REPOS)
            .map((r) => ({
              name: r.name,
              url: r.html_url,
              language: r.language,
              description: r.description,
              stars: num(r.stargazers_count, 0),
              pushedAt: r.pushed_at,
            }))
        : cur.github.recent,
      live: true,
    },
  }));
}

export function loadCodingStats() {
  if (!inflight) {
    const cached = readCache();
    // A fresh, fully live cache means this tab already fetched; don't spend the public APIs' rate limits again.
    inflight = cached?.leetcode.live && cached.github.live ? Promise.resolve() : Promise.allSettled([loadLeetcode(), loadGithub()]).then(() => undefined);
  }
  return inflight;
}

export function useCodingStats() {
  const [s, setS] = useState(stats);
  useEffect(() => {
    listeners.add(setS);
    setS(stats);
    void loadCodingStats();
    return () => {
      listeners.delete(setS);
    };
  }, []);
  return s;
}

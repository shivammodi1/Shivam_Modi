# Shivam Modi · Portfolio

A playable, Valorant-style portfolio. Visitors land on a game main menu, press **Play** and walk a first-person 3D lobby: they can shoot range bots, see other visitors in real time and chat with them, and open any part of the portfolio by aiming at a station and pressing **E**.

Live: https://shivam-modi-hxom.vercel.app/

## What's inside

| Station (key) | Shows |
| --- | --- |
| 1 Projects | Gallery of projects with screenshots, code and live links |
| 2 Arsenal | Skills as a weapon loadout, proficiency bars |
| 3 Trophies | Certificates and the Paranox 2.0 win |
| 4 Agent | About, education, resume |
| 5 Comms | Contact details and a message form (Formspree) |
| 6 Career | SDE Intern at PlatinumRx (since 15 Jun 2026) |
| 7 Ranked | Live LeetCode stats, GitHub contribution graph and recent repos, GFG and CodeChef snapshots |

- **Themes:** six agent colour themes (Vandal, Jett, Viper, Reyna, Phoenix, Sage), picked from the main menu or pause menu. They recolour the UI and the 3D room.
- **Sound:** all effects are synthesised with Web Audio (no audio files). `M` toggles sound.
- **Phones:** the lobby needs a mouse and keyboard, so touch devices get the same content as pages under `/browse/<section>`.

## Run locally

```sh
npm install
npm run dev            # site on http://localhost:8080

# optional, for multiplayer (in another terminal)
cd server
npm install
npm start              # lobby server on http://localhost:3001
```

In dev the site connects to `http://localhost:3001` automatically. Open two browser windows to see each other.

## Deploy

**Site (Vercel):** deploy as before. `vercel.json` rewrites every route to `index.html`, so `/play` and `/browse/...` links work on refresh.

**Multiplayer server (e.g. Render, Railway, Fly):**

1. New Web Service from this repo, root directory `server`, build `npm install`, start `npm start`.
2. Set `CLIENT_ORIGINS` to the site URL(s), comma-separated, e.g. `https://shivam-modi-hxom.vercel.app`.
3. In Vercel, set `VITE_LOBBY_SERVER_URL` to the server's URL and redeploy.

Without `VITE_LOBBY_SERVER_URL` the lobby runs in solo mode (no other players, no chat). Free hosts that sleep take a few seconds to wake; the HUD shows "Connecting…" meanwhile.

## Editing content

All portfolio text lives in `src/game/data.ts`: projects, skills, certificates, experience, contact details and the coding-stat snapshot used when a live API is unavailable.

## Stack

React 18, TypeScript, Vite, three.js with @react-three/fiber, Socket.io.

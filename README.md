# Undercover

A private, mobile-first dark-mode recreation of the party game **Undercover** for a single group of friends. One device gets passed around the room — players see their secret words, give clues, vote out impostors. Word pairs are crowdsourced from the group and synced through Supabase.

Built with Next.js 14 (App Router) + Tailwind + Supabase.

---

## 1. Setup

### Prereqs
- Node 18+
- A free Supabase project

### Install
```bash
npm install
cp .env.local.example .env.local
```

### Configure env
Open `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase Project Settings → API.
- `NEXT_PUBLIC_GROUP_PASSWORD` — the shared password your friends will type to enter the app.
- `NEXT_PUBLIC_ADMIN_PASSWORD` — separate password protecting `/admin`.

### Create the DB table
Two paths:

- **One-shot setup (manual):** paste [`supabase/migrations/20260520150000_init.sql`](supabase/migrations/20260520150000_init.sql) and [`supabase/migrations/20260520150100_seed_pt_words.sql`](supabase/migrations/20260520150100_seed_pt_words.sql) into the Supabase SQL editor and run them.
- **Auto-deploy on push (recommended):** wire up Supabase's GitHub integration so every new migration committed to `main` is applied automatically. See [Auto-deploy migrations](#5-auto-deploy-migrations) below.

### Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your phone (or use the LAN IP printed by Next dev).

---

## 2. Deploy

Easiest is **Vercel**:
1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add all four `NEXT_PUBLIC_*` env vars under Project Settings → Environment Variables.
4. Deploy. Share the URL with the group.

---

## 3. Directory map

```
app/
  layout.tsx              # Dark theme shell, GameProvider, AuthGate
  globals.css             # Tailwind + tiny utilities (safe-area, tap-target)
  page.tsx                # Main menu
  login/page.tsx          # Group password gate
  suggest/page.tsx        # "Suggest a pair" form (writes to Supabase)
  admin/page.tsx          # Admin pw gate + list/delete word pairs
  game/
    setup/page.tsx        # Player names + role counts
    reveal/page.tsx       # Pass-the-phone secret reveal
    round/page.tsx        # "X starts the clues" round screen
    vote/page.tsx         # Elimination grid + identity reveal modal
    mr-white/page.tsx     # Mr. White's guess
    end/page.tsx          # Winner + final roles

components/
  AuthGate.tsx            # Redirects unauthed users to /login
  ui/                     # Button, Input, Card, Modal (Tailwind primitives)

context/
  GameContext.tsx         # Reducer-based game state + LocalStorage persistence

lib/
  auth.ts                 # Group + admin password gates (localStorage / sessionStorage)
  game-logic.ts           # Role distribution, win evaluation, types
  supabase.ts             # Anon-key client + WordPair type
  utils.ts                # cn(), shuffle(), randomFrom()

supabase/
  config.toml             # Project ref + Postgres version for the CLI / GitHub integration
  migrations/             # Timestamped SQL applied in order
    20260520150000_init.sql            # Table, RLS policies, 5 EN seed pairs
    20260520150100_seed_pt_words.sql   # 60 PT-PT word pairs
```

---

## 4. How the game flow works

The game lives in one reducer in [context/GameContext.tsx](context/GameContext.tsx). Every state change is persisted to `localStorage` under `uc_game_state_v1`, so refreshing or accidentally closing the tab mid-round resumes exactly where you left off. The home screen shows a "Resume" card whenever a game is in progress.

**Phases:** `idle → reveal → round → vote → (mr_white_guess?) → round … → ended`

- **Role assignment** follows the official scaling (3–4: 1 UC; 5–6: 1 UC + 1 MW; 7+: 2 UC + 1 MW), but the host can tweak counts on the setup screen. Word pairs are drawn at random from Supabase at game start.
- **Reveal** shows one player at a time with a tap-to-reveal card; only the next player advances by tapping "I have seen my word", which prevents accidental peeking.
- **Round** picks a random surviving player to start clues each round (including round 1).
- **Vote** is an open ballot grid: tap the chosen player, confirm in a modal, and the eliminated player's true role + word flashes before the next round begins.
- **Mr. White** gets a dedicated mid-game screen with two manual outcome buttons (correct guess → MW wins; wrong → game continues).
- **Win conditions** are evaluated after every elimination: civilians win when all UC + MW are out; UC wins when UC + MW ≥ remaining civilians; MW wins on a correct guess.

---

## 5. Auto-deploy migrations

The schema lives in [supabase/migrations/](supabase/migrations/) using Supabase's `YYYYMMDDHHMMSS_name.sql` naming. To have every new migration applied to your Supabase project automatically when you push to `main`:

1. Open your Supabase project → **Settings → Integrations → GitHub**.
2. Connect this repo (`sousa16/undercover`) and pick the `main` branch as the production branch.
3. Set the **Supabase directory** to `supabase` (the default).
4. Open [supabase/config.toml](supabase/config.toml) and replace `your-project-ref` with your real project ref (Project Settings → General → Reference ID), then commit and push.

From then on:
- Add a new file under `supabase/migrations/` with a fresh timestamp prefix (`date -u +%Y%m%d%H%M%S` then `_my_change.sql`).
- Commit and push to `main`.
- Supabase applies it; if it fails, the push status check goes red and your DB stays untouched.

To generate new migrations locally with the Supabase CLI: `npx supabase migration new <name>`.

---

## 6. Adding word pairs

Two options for the group:
- **From any phone:** Main menu → *Suggest a pair* → submits straight into Supabase.
- **As admin:** `/admin` (enter admin password) shows the full pool with delete buttons next to each pair.

For permanent additions you'd want in source control, append them to a new migration file under `supabase/migrations/` (with a fresh timestamp) and push.

---

## 7. Security notes

- This app is gated by a single shared password and uses Supabase's anon key with permissive RLS. That's appropriate for a private group game and **not** for anything public. If you ever share the URL more widely, add real auth (Supabase Auth, Clerk, etc.) and tighten the RLS policies in the init migration.
- `NEXT_PUBLIC_GROUP_PASSWORD` ships to the client — anyone determined enough can read it from the bundle. That's a deliberate trade-off for friction-free friend access.

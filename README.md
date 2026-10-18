# Christmas Casino Night

A local-network party app: guests register on their phones, play casino-style games for virtual chips, and compete on a **TV leaderboard**. The host uses an **admin panel** to adjust balances after physical games.

## Quick start (Docker — recommended)

Your machine has Docker but may not have Node installed locally. This is the easiest path for both your PC demo and a VMware VM.

```powershell
cd C:\Users\RyanBelanger\Projects\christmas-casino-night
copy .env.example .env
# Edit .env — set ADMIN_PASSWORD before the party
docker compose up --build
```

Open:

| URL | Purpose |
|-----|---------|
| `http://<server-ip>:3000` | Guest phones — register & play |
| `http://<server-ip>:3000/dashboard` | TV — live leaderboard |
| `http://<server-ip>:3000/admin` | Host — manual chip adjustments |

Guest data (SQLite + photos) is stored in `./data` on the host via a Docker volume.

### VMware / LAN hosting

1. Deploy the project folder on the VM (or clone it there).
2. Run `docker compose up -d --build`.
3. Allow **TCP port 3000** on the VM firewall.
4. On the TV browser, use the VM’s LAN IP (e.g. `http://192.168.1.50:3000/dashboard`).
5. Guests connect to the same IP on Wi‑Fi (same subnet).

## Features

- **Registration** — name + camera photo for the leaderboard
- **Games** — Holiday Slots, Coin Flip (server-side outcomes; balances update atomically)
- **TV dashboard** — real-time updates via Server-Sent Events
- **Admin** — password-protected ±50 / +100 adjustments with transaction log

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_PASSWORD` | `party-admin` | Admin login (change this!) |
| `STARTING_BALANCE` | `500` | Chips for new guests |
| `ALLOW_REGISTRATION_WITHOUT_PHOTO` | `false` | Set `true` for quick testing |

## Development (optional)

If you install [Node.js 22+](https://nodejs.org/):

```powershell
npm install
npm run dev
```

Data is written to `./data` in the project directory.

## Party night checklist

1. Set a strong `ADMIN_PASSWORD` in `.env`.
2. Open `/dashboard` on the TV (fullscreen).
3. Share the guest URL (home page) verbally or via a QR code.
4. Use `/admin` when awarding chips from non-digital games.
5. Back up the `data/` folder if you want to keep records after the party.

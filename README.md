# Gun · Water · Snake

A browser-based take on Rock Paper Scissors with a twist — Gun beats Snake, Snake beats Water, Water beats Gun. Play against the CPU with a suspense animation, or pass the device for local two-player.

## Rules

| Pick | Beats |
|------|-------|
| 💧 Water | 🔫 Gun (rusts it) |
| 🔫 Gun | 🐍 Snake (shoots it) |
| 🐍 Snake | 💧 Water (drinks it) |

## Modes

**vs CPU** — Pick your move. The CPU side runs a slot-machine shuffle that slows down before landing, so there's actual suspense before the result reveals.

**2 Players (Pass & Play)** — Player 1 picks, a blind screen appears, device gets passed, Player 2 picks, then both reveal. No backend needed.

## Controls

| Key | Action |
|-----|--------|
| `W` | Pick Water |
| `G` | Pick Gun |
| `S` | Pick Snake |
| `Space` / `Enter` | Play again (after result) |
| `R` | Reset scores |

Keyboard shortcuts only work in vs CPU mode.

## Stack

Plain HTML, CSS, JavaScript. No libraries. Deployed as a static site on Vercel.

## Files

```
index.html   — markup and game structure
style.css    — all styling
script.js    — game logic, slot animation, PvP flow
vercel.json  — static deployment config
```

## Local dev

Open `index.html` in a browser. No build step.

## Deployment

Push to GitHub, connect to Vercel, deploys automatically.

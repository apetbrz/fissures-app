# Warframe Fissure Mission Tracker

## A quick tool to parse the Warframe public worldstate API for Void Fissure missions.

https://relics.apetbrz.dev/

### Setup:
- Requires `npm >= 11.3.0`
- `git clone https://github.com/apetbrz/fissures-app`
- `cd fissures-app`
- `npm install`
- for development, run `npm run dev` (requires `tmux`)
  - dev server runs on port 3000
  - client vite server runs on port 5173
- for production, run `npm run build` to build the client, and `npm run start` to start the server with the built files
  - prod server runs on port 4001
  - temporarily hardcoded to target my domain

# Warframe Fissure Mission Tracker

I wanted a quick and easy way to check the Warframe public worldstate API for specific missions. So I'm making this. And learning Node.js, Express.js, React, and Vite along the way.

Setup:
- Requires `npm >= 11.3.0`
- `git clone https://github.com/apetbrz/fissures-app`
- `cd fissures-app`
- `npm install`
- for development, run `npm run dev-server` and `npm run dev-client` (preferrably in a split terminal i.e. `tmux`)
  - dev server runs on port 3000
  - client vite server runs on port 5173
- for production, run `npm run build` to build the client, and `npm run start` to start the server with the built files
  - prod server runs on port 4000

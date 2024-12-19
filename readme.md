# Warframe Fissure Mission Tracker

I wanted a quick and easy way to check the Warframe public worldstate API for specific missions. So I'm making this. And learning Node.js, Express.js, React, and Vite along the way.

I'll have build scripts up soon. For now,

- `npm install`
- for development, run `npm run dev-server` and `npm run dev-client` (preferrably in a split terminal)
  - right now, the local server socket is hardcoded into the client
  - this will be fixed for deployment
- in `client` run `npm run build` to build the client js directly into where the server can access it (for testing endpoints directly instead of vite dev server)
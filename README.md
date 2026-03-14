# The Analyst's Terminal (Frontend)

One plain HTML file (`index.html`) simulates a restless market terminal:

- **Live feed:** five instruments drift every 400 ms and render tiny SVG trend lines.
- **Signal/log panels:** text events append on their own timers, and the three panels shuffle order so it feels like analysts rearranging surfaces.
- **Whisper alert:** when a price jump crosses a threshold, a banner shouts “ALERT: UNUSUAL ACTIVITY IN …”.
- **Ticker:** sticky strip at the bottom so prices are readable while the rest of the screen changes.

## Run locally

```bash
npm install
npm run dev -- --host
```

Open the URL Vite prints (usually `http://localhost:5173/`).  
`npm run build` produces the tiny static bundle in `dist/`.

# WestSide Studio — FiveM Photo Studio

React + Vite landing/booking site for a FiveM photography and cinematic video service.

## Run
```bash
npm install
npm run dev
```

The dev server serves the React app and payment confirmation API together.

## Payment confirmation setup

1. Copy `.env.example` to `.env` and set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Keep `.env` private; the bot token is only read by the server.
2. Add your real payment QR image at `public/payment-qr.png`.
3. Start with `npm run dev`. After a customer uploads a payment screenshot and clicks **Done**, the local server saves it under `uploads/` and sends the booking details plus image to the configured Telegram chat.

For Vercel, configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in the project's Environment Variables before deploying. The Vercel function forwards the booking and payment screenshot to Telegram; local `uploads/` storage is not persistent on Vercel.

The music player starts only after the visitor presses Play, as browsers block unsolicited audio. Its sample tracks are streamed from SoundHelix; visitors can select a track and adjust volume.

## Build
```bash
npm run build
```

## Main files
- `src/main.jsx` — page UI, calculator and booking form
- `src/styles.css` — responsive cinematic design
- `src/data/pricing.js` — package and add-on prices

## Pricing currently configured
- Single: $1
- Couple: $3
- Trio: $4
- Squad: $6
- Gang: $10 up to 8 people
- Extra person after 8: +$1
- Lightroom: +$2
- Short cinematic video: $15+
- Car / House / MLO / Props: custom quote

Add your own FiveM screenshots as `public/gallery/photo-01.jpg` through `public/gallery/photo-09.jpg`. Edit `src/data/contacts.js` to set the public Telegram, Discord, and Instagram contact links.

# SkillForge - Course Catalog (Vite + Tailwind)

## Features
- Responsive navbar with theme switch (light/dark)
- Courses grid with search, category, level chips, price and rating sliders
- Sorting (price, rating, newest)
- Sale popup with localStorage remember + promo code application
- Wishlist (localStorage) and Compare tray + comparison modal
- Quick View modal for course details
- Basic rule-based chatbot widget (no backend)
- Accessible, mobile-friendly UI (Tailwind)

## Tech
- Vite (vanilla JS)
- Tailwind CSS via PostCSS

## Setup
1. Install dependencies
```
npm install
```
2. Start dev server
```
npm run dev
```
3. Build production
```
npm run build
```
4. Preview build
```
npm run preview
```

## Deploy to Vercel
- Push this project to GitHub.
- Import the repo in Vercel.
- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Vite (auto-detected)

Alternatively, with Vercel CLI:
```
npm i -g vercel
vercel
```

## Notes
- All data is client-side, no backend required.
- Update `db` array in `src/main.js` to add more courses.

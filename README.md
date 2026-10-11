# Little Outside

A small app for getting off your screen, paying attention to the world around you, and finding better words for what you notice.

Built for the DEV Hacktoberfest 2026 **“Touch Grass”** challenge.

## Why Little Outside?

It is surprisingly easy to spend an entire day looking at a screen without really noticing what is happening around you. Little Outside gives you a reason to step away.

Instead of telling you to "go outside and relax," it gives you a small, specific adventure to try. You might be asked to notice five different sounds, find something that has changed with age, or take a short walk and pay attention to the things you normally pass by.

The fun part is **finding the right words for what you experienced.**

## How it works

```text
Choose what you want
        ↓
Get a small outdoor mission
        ↓
Go outside
        ↓
Write about what you noticed
        ↓
Discover a better word
        ↓
Rewrite your reflection using the word
        ↓
Save it to your journal
```

The vocabulary isn't presented as a traditional word list or flashcard exercise. The idea is to discover words through your own experiences.

For example:

> "The little shop had clothes, drinks, boxes and bags all packed together."

Little Outside might introduce a word like **clustered**, explain what it means, and then ask you to rewrite your observation using it.

Over time, your journal becomes a collection of things you've noticed and words you've discovered.

## Features

- **Outdoor missions** based on your available time, budget, activity preference, and social preference
- **Observation-based reflections** that turn real-world experiences into vocabulary practice
- **Contextual vocabulary** instead of random word lists
- **Rewrite practice** to help you actually use new words
- **Personal journal** of adventures, reflections, and words you've kept
- **Installable PWA** for a more app-like experience
- **Offline-first foundations** with local missions, vocabulary fallbacks, and local persistence
- **Storybook-inspired interface** designed to feel playful, warm, and tactile

## The idea behind the vocabulary

Little Outside isn't trying to teach you hundreds of words.

It's trying to help you find the word you were looking for but didn't know yet.

1. You notice something.
2. You describe it in your own words.
3. The app helps you find a more precise word.
4. Then you use that word yourself.

That small loop is the heart of the project.

## Tech Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- IndexedDB for local persistence
- Serwist for service worker / PWA support
- AI-assisted vocabulary suggestions when available
- Local deterministic vocabulary fallback for offline use

## Offline-first approach

Little Outside is designed so that its core experience doesn't depend entirely on an AI API being available.

Missions and the local vocabulary dataset are available locally, while IndexedDB is used to persist drafts and journal entries on the device.

When AI services are available, they can enhance the vocabulary experience.

The goal is simple:

> Going outside shouldn't stop working just because the internet does.

## Project Structure

```text
little-outside/
├── app/
│   ├── mission/       # Mission and reflection experience
│   ├── journal/       # Saved adventures and vocabulary
│   └── ...
├── lib/
│   ├── data/          # Local missions and vocabulary
│   ├── ai/            # AI client and vocabulary logic
│   └── storage/       # IndexedDB persistence
├── public/
│   └── icons/         # PWA icons
└── ...
```

## Running locally

Clone the repository:

```bash
git clone <https://github.com/BenedictaUche/little-outside.git>
cd little-outside
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

For a production build:

```bash
npm run build
npm start
```

## Environment Variables

If you want to enable the optional AI functionality, create a `.env.local` file and add the required API configuration:

```bash
NEXT_PUBLIC_...
```

Check the relevant AI client configuration in `lib/ai/` for the variables required by your setup.

The core local experience should not require an AI API to provide missions or access the local vocabulary dataset.

## Design

Little Outside uses a soft, illustrated visual language inspired by:

- storybooks
- handwritten journals
- scrapbook pages
- little things collected during a walk

The interface uses warm cream, lavender, peach, rose, and yellow tones to make the experience feel inviting without feeling like another productivity dashboard.

## What's next?

Some ideas I'd love to explore:

- More location-aware adventures
- A larger vocabulary collection
- Better personalization based on previous adventures
- Richer offline AI capabilities
- Seasonal and weather-based missions
- More ways to revisit words you've discovered

## Built for the DEV Hacktoberfest 2026 Touch Grass Challenge

Little Outside was built around a simple question:

**What if an app could make you want to put your phone down?**

🌿 Go outside.
👀 Notice something.
✍🏾 Find the word.
📖 Keep it.

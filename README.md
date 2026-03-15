🏎️ HD Racing Game
A high-definition 3D racing game built with Next.js, React Three Fiber, and Agentic AI powered by Google Gemini — fully free to run and deploy.

🎮 Features

HD 3D Rendering — React Three Fiber + Three.js with full postprocessing (Bloom, Motion Blur, Depth of Field, Chromatic Aberration)
Realistic Physics — Car physics and collisions powered by Rapier (@react-three/rapier)
Agentic AI — Three AI agents powered by Google Gemini API:

🌍 World Generator — Procedurally generates unique tracks, biomes, and weather per race
🤖 Enemy AI Director — Dynamically adjusts rival racer aggression, overtaking, and blocking
🎲 AI Game Master — Reacts to in-game events with weather changes, hazards, and dynamic commentary

Spatial Sound — Engine sounds, crash effects, and background music via Howler.js
AI Commentary — Live spoken commentary via the browser's Web Speech API (free, no API key)
Fully Free Stack — No paid services, no credit card required

🛠️ Tech Stack
LayerTechnologyFrameworkNext.js 14 (App Router)3D RenderingReact Three Fiber + Three.jsHD Visuals@react-three/postprocessingPhysics@react-three/rapierAI AgentsGoogle Gemini API (free tier)SoundHowler.js + Web Speech APIStateZustandDeploymentVercel (Hobby — free)

🚀 Getting Started
Prerequisites

Node.js 18+
npm or yarn
A free Google AI Studio account (for Gemini API key)

1. Clone the repository
   bashgit clone https://github.com/YOUR_USERNAME/hd-racing-game.git
   cd hd-racing-game
2. Install dependencies
   bashnpm install
3. Set up environment variables
   bashcp .env.example .env.local
   Then open .env.local and add your Gemini API key:
   envGEMINI_API_KEY=your_api_key_here
   Get a free key at 👉 aistudio.google.com — no credit card needed.
4. Run the development server
   bashnpm run dev
   Open http://localhost:3000 in your browser.

📁 Project Structure
src/
├── app/
│ ├── page.tsx # Main menu
│ ├── game/
│ │ └── page.tsx # Game page
│ └── api/
│ └── ai/
│ ├── game-master/ # AI Game Master route
│ ├── world-gen/ # Procedural world generation route
│ └── enemy-ai/ # Enemy AI decisions route
├── components/
│ ├── canvas/ # R3F Canvas + postprocessing
│ ├── entities/ # Player car, enemy cars, camera
│ ├── environment/ # Track, terrain, sky, weather
│ ├── effects/ # Particles, skid marks, FX
│ └── ui/ # HUD, minimap, commentary
├── hooks/ # useCarPhysics, useAIAgent, etc.
├── store/ # Zustand game & AI state
├── lib/
│ ├── gemini.ts # Gemini API client
│ └── prompts/ # AI prompt templates
├── types/ # TypeScript types
└── public/
├── models/ # GLTF 3D models
├── sounds/ # Engine, crash, music files
└── textures/ # Road, terrain, car textures

🧠 AI Agents
World Generator (/api/ai/world-gen)
Called once per race. Returns a JSON track layout including waypoints, obstacles, weather conditions, and biome type. The client uses this to procedurally build the 3D track.
Enemy AI Director (/api/ai/enemy-ai)
Called every ~30 seconds during a race. Receives player position, speed, and lap data. Returns per-enemy decisions: aggression level, overtaking strategy, rubber-banding.
AI Game Master (/api/ai/game-master)
Triggered on key events (crash, overtake, lap complete). Returns dynamic world reactions: weather shifts, track hazards, shortcut openings, and commentary text spoken via Web Speech API.

🔊 Sound Sources
All sounds are free and CC0 licensed:

Engine & crash sounds — Freesound.org
Background music — OpenGameArt.org
AI Commentary — Browser Web Speech API (no download needed)

🌐 Deployment
This project is deployed on Vercel (Hobby plan — free, no credit card).
To deploy your own instance:
bashnpm install -g vercel
vercel
Add your GEMINI_API_KEY in the Vercel dashboard under Project Settings → Environment Variables.

📋 Roadmap

Project setup & architecture
Next.js scaffold + folder structure
R3F Canvas + HD postprocessing pipeline
Howler.js sound system
Gemini AI agent routes
Car physics + player controller
Procedural track from AI JSON
Enemy racers + AI decisions
HUD + AI commentary
HD polish (particles, skid marks, crowd)
Vercel deployment

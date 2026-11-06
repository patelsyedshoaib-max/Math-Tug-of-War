# Math Tug-of-War: Math Puzzle Rope Pull Game

A fast-paced, competitive mental math Tug-of-War game where two players (or 1 Player vs AI Bot) solve math problems as quickly and accurately as possible to pull a rope across a central red line to win!

---

## User Review & Confirmed Decisions

> [!IMPORTANT]
> The following core design decisions were confirmed during Phase 1 interactive selection:

- **Game Modes**: **Dual Mode** — Supports local Same-Screen 2-Player (Split controls with touch/on-screen numpad or keyboard shortcuts) AND Single Player vs AI Bot (with customizable bot difficulty, reaction time, and error rate).
- **Math Difficulty**: **Flexible Difficulty Levels** — Addition, Subtraction, Multiplication, Division, and Mixed Challenge modes with **Speed Streak Multipliers** (fast correct answers yield double pulling force).
- **Visual Style & Characters**: **Playful Toy Characters** — Toy avatars (e.g., Bear, Robot, Dino, Unicorn, Ninja, Superhero) pulling a dynamic animated rope across a vibrant grass/arena field with a distinct center red line, synth sound effects (Web Audio API), and confetti celebrations.

---

## 1. Overview & Core Concept

### What It Does
**Math Tug-of-War** combines fast mental calculation with classic arcade tug-of-war mechanics. Each player is assigned a toy character on their side of the playing field (Left: Player 1 / Blue Toy, Right: Player 2 or AI Bot / Red Toy). A central red rope line marks the equilibrium point.
When a math problem appears on a player's screen section:
1. Solving it correctly triggers an instant **"Rope Pull"** animation that tugs the rope marker 15% towards their side.
2. Fast answers under 3 seconds trigger a **Speed Bonus Pull** (extra rope movement).
3. Incorrect answers cause a momentary 1-second penalty stall and slight rope slip towards the opponent.
4. When either player pulls the center rope marker past the boundary threshold onto their side, they win the match!

### Target Audience
Students, kids, parents, and casual puzzle fans looking for fun arithmetic speed training and friendly head-to-head competition.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌─────────────────┐     ┌───────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────┐
│   Main Menu     │ ──> │ Character / Mode /    │ ──> │ Active Tug-of-War Arena │ ──> │  Victory Modal &    │
│ (Rules & Modes) │     │ Difficulty Selection  │     │ (Live Math Problems)    │     │ Confetti Celebration│
└─────────────────┘     └───────────────────────┘     └─────────────────────────┘     └─────────────────────┘
```

1. **Main Menu**: Options to select **"2-Player Local"** or **"Player vs AI Bot"**, select math topics (Addition, Subtraction, Multiplication, Division, or Mixed), and set victory rope distance (Short / Standard / Tug Marathon).
2. **Character & Avatar Picker**: Pick P1 and P2 Toy Avatars (Teddy Bear 🧸, Cyber Robot 🤖, Dino 🦖, Unicorn 🦄, Superhero 🦸, Ninja 🥷) with custom team color banners.
3. **Interactive Arena View**:
   - **Top Viewport**: Animated Tug-of-War Field with grass texture background, dynamic braided rope, center red line marker, and two animated toy characters leaning back as they pull.
   - **Rope Indicator Bar**: Visual distance bar showing exact rope position relative to the middle red boundary line.
   - **Split Problem Zone**:
     - **Player 1 Side (Left)**: Current math question, P1 score, streak counter, and dedicated numeric keypad / answer input.
     - **Player 2 / AI Side (Right)**: Current math question, P2 score / AI status meter, and keypad / input.
4. **Victory Celebration**: When a toy pulls the rope past the win threshold, the opponent falls forward, victory sound plays, confetti bursts across the screen, and match stats (Accuracy, Avg Speed, Fast Correct Answers) are displayed with a "Play Again" restart button.

### Visual Identity & Theme
- **Aesthetic Direction**: Vibrant, playful, arcade-toy aesthetic with clean modern typography and smooth spring-based rope animations (`motion`).
- **Color Palette (60-30-10 Rule)**:
  - **60% Neutral Canvas**: Deep arena field (emerald grass/stadium gradient `#0F382C` or soft playground slate `#1E293B`).
  - **30% Structural Cards**: Clean off-white/dark slate cards with clear borders for math problem panels.
  - **10% High-Intent Accents**: Vibrant Red (`#EF4444`) for the center boundary marker line, Electric Blue (`#3B82F6`) for Player 1, and Crimson Red (`#F43F5E`) for Player 2 / AI Bot.
- **Typography**: Display font (`Outfit` / `Plus Jakarta Sans`) paired with monospace tabular numbers (`font-mono tabular-nums`) for high-legibility rapid math calculations.

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale & Advantage |
| :--- | :--- | :--- |
| **Input Methods** | Dual Numpad On-Screen + Physical Keypad | Allows mobile/tablet touch play for 2 players on same screen, as well as physical keyboard numpad support for desktop. |
| **Audio Engine** | Web Audio API Synthesizer | Zero external audio asset dependencies; crisp custom chimes, pull sounds, and victory fanfares generated programmatically in browser. |
| **AI Bot Logic** | Dynamic Reaction & Accuracy Curve | AI bot calculates math accurately after a realistic delay (1.2s - 2.5s based on chosen difficulty: Easy, Normal, Pro Math Master). |
| **State Management** | React `useReducer` State Machine | Guarantees bug-free game phase transitions (`MENU` -> `CHARACTER_SELECT` -> `PLAYING` -> `PAUSED` -> `GAME_OVER`) with zero state desynchronization. |

---

## 4. Technical Architecture & Component Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              App.tsx (Main Hub)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────────┐  │
│  │ MainMenu.tsx         │  │ CharacterSelect.tsx  │  │ AudioEngine.ts    │  │
│  └──────────────────────┘  └──────────────────────┘  └───────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Active Game Arena (GameArena.tsx)                                     │  │
│  │ ┌───────────────────────────────────────────────────────────────────┐ │  │
│  │ │ RopeField.tsx (Canvas / Animated Rope, Red Line, Toys, Streaks)    │ │  │
│  │ └───────────────────────────────────────────────────────────────────┘ │  │
│  │ ┌───────────────────────────────┐   ┌─────────────────────────────┐ │  │
│  │ │ PlayerCard.tsx (P1 - Left)    │   │ PlayerCard.tsx (P2 / AI)    │ │  │
│  │ │ - Question Generator          │   │ - Question Generator        │ │  │
│  │ │ - Input Numpad / Keys         │   │ - AI Auto-Solver (if bot)   │ │  │
│  │ │ - Speed Streak Indicator      │   │ - Speed Streak Indicator    │ │  │
│  │ └───────────────────────────────┘   └─────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ VictoryModal.tsx (Confetti, Match Analytics, Rematch Handler)          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Modules to Implement:
1. `src/types/game.ts`: Game states, Toy character types, Difficulty levels, Problem structures, Match stats.
2. `src/utils/mathGenerator.ts`: Algorithmic math question generator (Addition, Subtraction, Multiplication, Division with integer results, and customizable max numbers).
3. `src/utils/audio.ts`: Web Audio API synthesizer for tug sounds, correct answer ding, wrong answer buzz, streak power chime, and victory fanfare.
4. `src/components/RopeField.tsx`: Animated canvas / SVG rope pull rendering with dynamic center red line marker, pulling tension physics, and toy animations.
5. `src/components/PlayerCard.tsx`: Player problem zone with immediate feedback, numpad input buttons, speed streak power meter, and correct/error animations.
6. `src/components/VictoryModal.tsx`: Confetti canvas effect, match score breakdown, accuracy rates, fast response times, and rematch triggers.

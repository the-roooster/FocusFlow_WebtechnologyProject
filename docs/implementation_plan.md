# FocusFlow — Product Design & UX Execution Plan

> **Philosophy**: EQ-first. Low friction. Long-term retention.
> Designed for humans who struggle, not machines who optimize.

---

## 1. Information Architecture

### App Shell Structure

```
FocusFlow/
├── /dashboard          → Adaptive home (Recovery Mode aware)
├── /tasks              → Frictionless capture + inline task detail
├── /deep-work          → Zero-friction focus timer
├── /habits             → Forgiving habit tracking
├── /notes              → Modular offline-first notes
└── /analytics          → Quiet, user-triggered insights
```

### Navigation Model
- **Primary nav**: Persistent left sidebar (desktop) / bottom tab bar (mobile)
- **Nav items**: Dashboard · Tasks · Deep Work · Habits · Notes · Analytics
- **Active state**: Soft sage pill highlight (no harsh borders)
- **Sidebar behavior**: Collapses gracefully in Recovery Mode; only icons remain
- **Top bar**: Minimal — greeting text (left), bell icon + avatar (right)

### Data Layers
```
User State Layer
├── User profile (name, avatar, preferences)
├── Mood/energy state (Low Energy · Steady · Ready to Build)
└── Recovery Mode flag (auto-detected)

Content Layer
├── Tasks (local-first, synced)
├── Habits + scores
├── Notes (blocks, offline)
└── Deep work sessions (history)

Analytics Layer (computed, lazy-loaded)
├── Focus streaks (stored, not displayed)
├── Habit consistency scores
└── Weekly reflection summaries
```

---

## 2. User Flow (Per Feature)

### 2.1 Dashboard Flow

```
App opens
    │
    ├─ [First visit / returning after < 1 day]
    │       → Standard Dashboard
    │           • Welcome greeting ("Good Morning, [Name]")
    │           • Subtext: "Take a deep breath."
    │           • Conversational Reset widget
    │           • 3 Gentle Reminder cards
    │           • Progress ring (Gentle Steps)
    │           • Daily Reflection card (energy check-in)
    │
    └─ [Returning after > 2 days OR 3+ overdue tasks]
            → Recovery Mode Dashboard
                • Simplified layout activates
                • Greeting: "Welcome back. Let's start small today."
                • Subtext: "You've been away for X days. There's no rush."
                • Only shows: Conversational Reset + 3 most gentle tasks
                • Analytics widget hidden
                • Notifications muted (snooze banner instead)
                • "Simplify My Day" button in top-right always visible
```

**Conversational Reset Widget Flow:**
```
Widget appears with AI-lite prompt
    → User types how they're feeling
    → App responds with ONE suggested action (not a list)
    → User clicks "Start Here" or "Not Yet"
    → If "Not Yet" → widget stays, no pressure applied
```

**Gentle Reminder Cards:**
- Max 3 shown at once
- Each card: Icon · Title · Soft description · Checkbox (not alarming)
- No due time shown unless user asks
- Completion is silent (card fades out, no fanfare unless opted in)

---

### 2.2 Tasks Flow

```
Tasks Page opens
    │
    ├─ Top: Capture Bar (always visible, auto-focused)
    │       Placeholder: "I need to focus on..."
    │       Inline icons: ⏱ Timer · # Tag · [Capture] button
    │
    ├─ "New task added to your sanctuary." toast (non-blocking)
    │
    └─ Task List: "Active Tasks"
            │
            ├─ Each Task Card (expanded inline):
            │       • Circle checkbox (left)
            │       • Task title (bold)
            │       • Due date (soft text: "Due today · No rush")
            │       • ▶ 45 min timer pill (right)
            │       • Inline note / attachment (visible without click)
            │       • Image thumbnail if attachment present
            │
            ├─ Task completion:
            │       Circle animates → checkmark
            │       Card gently fades / moves to bottom
            │       No confetti unless user has opted in
            │
            └─ FAB (+) bottom right → opens same capture bar
```

**Task Input Rules:**
- Press Enter → captures task instantly
- No modal, no form, no extra clicks
- Timer defaults to 45 min (Pomodoro-adjacent, not strict)
- Tags are optional, applied inline with `#`
- Attachments drag-drop or paste directly into task

---

### 2.3 Deep Work Flow

```
Deep Work tab opens
    │
    ├─ Timer shown immediately (no setup screen)
    │       • Large circular countdown (e.g., 18:42)
    │       • "REMAINING" label above
    │       • Single CTA: [▶ Start Focusing]
    │
    ├─ On Start:
    │       • "Auto-Do-Not-Disturb has been activated." banner (dismissible)
    │       • Timer begins counting down
    │       • Circle arc shrinks visually
    │       • UI fades to minimal state (only timer + stop)
    │
    ├─ White Noise Selector (bottom strip):
    │       WHITE NOISE · 🌧 Rain · 🌲 Forest · ☕ Café
    │       Selected state: pill highlight (sage)
    │       Volume icon on far right
    │
    ├─ Motivational quote below timer (subtle, italic)
    │       "Small steps daily lead to monumental shifts over time."
    │
    └─ Session end:
            • Gentle chime (if audio on)
            • "Session complete. Well done." (no score, no pressure)
            • Option: "Take a break" or "Go again"
```

---

### 2.4 Habits Flow

```
Habits Page opens
    │
    ├─ Top banner: "You've nurtured your habits with 85% consistency this week."
    │       → Positive framing always, even at low %
    │
    ├─ Habit Strength Score Card:
    │       • Score % (large, green)
    │       • Heatmap grid (Mon–Sun rows, opacity = completion)
    │       • Quote: "The goal is not to be perfect, but to be present."
    │
    ├─ Hydration Tracker (quick-log widget):
    │       • Circular ring (75% = 6/8 glasses)
    │       • [Log Sip] button
    │
    ├─ Habit Cards (e.g., Morning Meditation, Deep Reading):
    │       • Icon (colored pill) + frequency badge (5x Weekly)
    │       • Title + description
    │       • Progress bar (green segments, no red)
    │       • "4 of 5 sessions complete"
    │       • (+) to log session
    │
    ├─ Daily Reflection Habit:
    │       • Atmospheric image
    │       • Day dots (S M T W T) — completed = filled, missed = muted gray
    │       • "Resting tomorrow" status (never "missed" or "failed")
    │       • ▶ button to start
    │
    └─ FAB (+) → Add new habit
            Modal: Name · Frequency (Daily / 3x week / Custom) · Icon · Color
            No "streak goal" field — intentionally omitted
```

**Missed Day Language Rules:**
- Never show: "Missed", "Failed", "Broken", "0 day streak"
- Always show: "Resting", "Paused", "Building back", "Light week"

---

### 2.5 Notes Flow

```
Notes Page opens
    │
    ├─ Page title (editable): "Afternoon Reflection"
    ├─ Subtitle: "Capturing the quiet moments of today."
    ├─ Save status: "● Locally Saved" (top right, subtle)
    │
    ├─ Block Canvas:
    │       ┌─────────────────────────┐
    │       │ ⠿ THOUGHT CAPTURE       │ [···]
    │       │ Free-text entry          │
    │       └─────────────────────────┘
    │       ┌─────────────────────────┐
    │       │ ⠿ ATMOSPHERE            │
    │       │ [Image Block]            │
    │       └─────────────────────────┘
    │       ┌─────────────────────────┐  ┌──────────────────┐
    │       │ ⠿ NEXT STEPS            │  │ ⠿ VOICE MEMO     │
    │       │ ☑ Task 1                │  │ [Waveform visual] │
    │       │ ☐ Task 2                │  │ ▶ Listen (0:42)  │
    │       └─────────────────────────┘  └──────────────────┘
    │
    ├─ [+ ADD A NEW BLOCK] at bottom (always visible, ghost state)
    │
    └─ Block types available:
            Text · Heading · Image · Checklist · Voice Memo · Divider · Quote
```

**Blank Page Prevention:**
- New note → immediately shows 1 empty "Thought Capture" block, cursor auto-placed
- Block picker shows on first interaction, not upfront
- Starter templates available (Morning Reflection · Project Note · Brain Dump)

---

### 2.6 Analytics Flow

```
Analytics Page opens
    │
    ├─ Title: "Quiet Insights"
    ├─ Subtitle: "Your progress isn't a race. Here is a reflection..."
    │
    ├─ [Hidden by default — gated behind reveal action]
    │       Large CTA: 👁 [Review My Week]
    │       Subtext: "Click to reveal your gentle progress"
    │
    └─ After reveal:
            ├─ Focus Pattern card: "You focus best on Tuesday mornings"
            │       Bar chart (muted greens, soft shapes)
            │
            ├─ Habit Strength card: Spider/radar chart (blurred edges)
            │       "Your habit strength is growing"
            │
            ├─ Mental Clarity Highs card:
            │       Text insight (narrative, not numbers)
            │       "You logged 5m of mindful breathing this week..."
            │
            ├─ Mood Summary card:
            │       "Your Mood: Steady" (simple, not graded)
            │
            └─ Weekly Affirmation banner (bottom):
                    "Growth is often quiet and slow. Every small action you took this week matters."
```

---

## 3. UX Behavior Rules

### 3.1 Recovery Mode Detection

| Trigger | Action |
|---|---|
| User inactive > 2 days | Activate Recovery Mode flag |
| 3+ tasks overdue | Simplify dashboard |
| User self-reports "Low Energy" | Mute notifications, reduce widget count |
| App opened after long absence | Show recovery greeting, not task list |

**Recovery Mode UI Changes:**
- Sidebar collapses to icon-only
- Analytics section hidden
- Notification bell shows snooze count only
- Task list filtered to max 3 "gentle" items
- Color temperature warms slightly (less stark white)

### 3.2 Emotional Feedback Rules

| Event | ❌ Never Show | ✅ Always Show |
|---|---|---|
| Missed habit | "Failed", red X | "Resting", muted dot |
| Overdue task | Red badge, alarming color | Soft amber, "No rush" |
| Low productivity week | Drop % indicator | "Every small action counts" |
| Long absence | "You missed X days" | "Welcome back. No rush." |
| Habit broken | Streak reset counter | "Building back" |

### 3.3 Notification Rules

- **Max 1 notification per session** unless user opts in to more
- **Snooze model**: All notifications can be deferred with one tap
- **Recovery Mode**: All push disabled, only in-app soft banners
- **Tone**: Never imperative ("Do this NOW") — always invitational ("When you're ready…")

### 3.4 Simplify My Day Feature

- One-tap button (always visible in top bar)
- Instantly:
  - Hides analytics
  - Collapses task list to 3 items
  - Activates DND
  - Shows calming message
- Persists until user taps "Expand My View"

---

## 4. Component-Level UI Breakdown

### 4.1 Shared Components

| Component | Behavior | Visual |
|---|---|---|
| `<AppShell>` | Sidebar + top bar wrapper | Light off-white bg (#F8F9F5) |
| `<NavItem>` | Icon + label, active = sage pill | Lucide icons, 20px |
| `<GreetingBlock>` | Time-aware greeting + subtext | Semibold 22px + muted 13px |
| `<TopBar>` | Bell + Avatar only | Right-aligned, ghost buttons |
| `<Toast>` | Non-blocking, bottom-center | Soft blue bg, 3s auto-dismiss |
| `<FAB>` | Floating action (+ icon) | Sage green, 56px circle, shadow |

### 4.2 Dashboard Components

| Component | Description |
|---|---|
| `<ConversationalReset>` | Chat-like widget, input + AI response bubble |
| `<GentleReminderCard>` | Icon · Title · Description · Checkbox |
| `<ProgressRing>` | SVG circular progress, "X/Y Gentle Steps" |
| `<DailyReflectionCard>` | Energy mood picker (Low Energy · Steady · Ready to Build) |
| `<RecoveryBanner>` | Full-width soft message strip (Recovery Mode) |
| `<SimplifyButton>` | Persistent top-right CTA button |
| `<InspirationCard>` | Atmospheric photo + quote block |

### 4.3 Task Components

| Component | Description |
|---|---|
| `<CaptureBar>` | Autofocused input + inline icons + Capture button |
| `<TaskCard>` | Expandable, shows note + attachment inline |
| `<TaskCheckbox>` | Animated circle → checkmark |
| `<TimerPill>` | "▶ 45 min" pill, clickable to launch Deep Work |
| `<AttachmentThumb>` | Inline image preview within card |
| `<TagChip>` | Soft rounded label, muted color |

### 4.4 Deep Work Components

| Component | Description |
|---|---|
| `<FocusTimer>` | Large SVG arc + countdown digits |
| `<StartButton>` | Sage pill CTA, full-width on mobile |
| `<NoiseSelector>` | Horizontal strip, icon + label tabs |
| `<SessionBanner>` | Dismissible DND activation notice |
| `<MotivationalQuote>` | Italic serif text, centered, subtle |

### 4.5 Habits Components

| Component | Description |
|---|---|
| `<HabitStrengthCard>` | Score % + heatmap grid + quote |
| `<HydrationRing>` | SVG ring + "Log Sip" button |
| `<HabitCard>` | Icon · Freq badge · Progress bar · Log (+) |
| `<DayDots>` | S M T W T — filled/muted (never red) |
| `<HabitHeatmap>` | Weekly grid, opacity = completion level |

### 4.6 Notes Components

| Component | Description |
|---|---|
| `<NoteCanvas>` | Drag-sortable block container |
| `<TextBlock>` | Rich text, minimal toolbar on select |
| `<ImageBlock>` | Drop zone + preview |
| `<ChecklistBlock>` | Checkbox list, inline add |
| `<VoiceBlock>` | Waveform visualization + play button |
| `<BlockPicker>` | Slash-command or (+) button trigger |
| `<SaveStatus>` | "● Locally Saved" / "⟳ Syncing" indicator |

### 4.7 Analytics Components

| Component | Description |
|---|---|
| `<RevealGate>` | Eye icon + reveal CTA (hidden state) |
| `<FocusPatternBar>` | Soft green bar chart (days of week) |
| `<HabitRadar>` | Spider chart, blurred/soft edges |
| `<NarrativeInsight>` | Text-only card, no numbers |
| `<MoodSummary>` | Single word mood + icon |
| `<WeeklyAffirmation>` | Full-width banner, italic quote |

---

## 5. State Management Strategy

### Technology: Zustand + React Query + IndexedDB

```
Global Store (Zustand)
├── userStore
│   ├── profile (name, avatar, preferences)
│   ├── energyState: 'low' | 'steady' | 'building'
│   └── recoveryMode: boolean
│
├── uiStore
│   ├── sidebarCollapsed: boolean
│   ├── simplifyModeActive: boolean
│   ├── analyticsRevealed: boolean
│   └── activeToasts: Toast[]
│
├── taskStore
│   ├── tasks: Task[]
│   ├── captureBarValue: string
│   └── activeTimer: TimerState | null
│
├── habitStore
│   ├── habits: Habit[]
│   ├── habitScores: Record<id, HabitScore>
│   └── todayLogs: HabitLog[]
│
├── noteStore
│   ├── notes: Note[]
│   ├── activeNote: Note | null
│   └── syncQueue: PendingSync[]
│
└── deepWorkStore
    ├── sessionActive: boolean
    ├── timeRemaining: number
    ├── selectedNoise: NoiseType
    └── sessionHistory: Session[]
```

### Recovery Mode Logic (computed)

```typescript
// Derived state, not stored
const isRecoveryMode = computed(() => {
  const daysSinceLastActive = getDaysSince(userStore.lastActiveAt)
  const overdueCount = taskStore.tasks.filter(t => t.isOverdue).length
  const userState = userStore.energyState

  return (
    daysSinceLastActive > 2 ||
    overdueCount >= 3 ||
    userState === 'low'
  )
})
```

### Server Sync Strategy (React Query)
- All reads from IndexedDB first, then background refetch
- Mutations write to local store immediately, queue for sync
- Conflict resolution: last-write-wins with timestamp

---

## 6. Offline-First Architecture

### Stack: IndexedDB (via Dexie.js) + Service Worker + Background Sync API

```
Data Flow:
User Action
    │
    ▼
Local Write (IndexedDB via Dexie)  ← instant, always succeeds
    │
    ▼
UI Updates immediately (optimistic)
    │
    ▼
Sync Queue (if online → push to server)
         (if offline → store in pendingSyncs table)
    │
    ▼
Background Sync API triggers when connectivity restored
    │
    ▼
Server receives batched changes
    │
    ▼
Conflict resolution → UI updated silently
```

### IndexedDB Schema (Dexie)

```javascript
db.version(1).stores({
  tasks:        '++id, title, dueDate, status, updatedAt',
  habits:       '++id, name, frequency, createdAt',
  habitLogs:    '++id, habitId, date, completed',
  notes:        '++id, title, blocks, updatedAt, syncedAt',
  sessions:     '++id, type, startedAt, duration',
  pendingSyncs: '++id, entity, entityId, action, payload, createdAt'
})
```

### Service Worker Caching Strategy

| Resource Type | Strategy |
|---|---|
| App shell (HTML/JS/CSS) | Cache First |
| API responses | Network First, fallback to cache |
| Images/assets | Stale While Revalidate |
| Note blocks | Cache First + background sync |
| Analytics data | Network Only (skip cache) |

### Save Status Indicators

```
● Locally Saved     → green dot, data in IndexedDB
⟳ Syncing...        → animated, pushing to server
✓ Synced            → brief flash, then disappears
⚠ Offline — saved locally  → amber, appears in top bar
```

---

## 7. Design System

### 7.1 Color Palette

```
Primary Surface
  --bg-base:        #F5F6F1   /* warm off-white, main app bg */
  --bg-card:        #FFFFFF   /* card surfaces */
  --bg-sidebar:     #EEEEE9   /* sidebar bg, slightly darker */
  --bg-muted:       #F0F1EC   /* muted section backgrounds */

Sage (Brand Color)
  --sage-100:       #E8EDE5
  --sage-300:       #B5C9B0
  --sage-500:       #7A9E7E   /* primary interactive, active states */
  --sage-700:       #4E7252   /* deep green, text on light */
  --sage-900:       #2D4A30   /* dark mode sage */

Accent Blues (Deep Work / Analytics)
  --blue-soft:      #C8D8E8
  --blue-mid:       #6B9BB8
  --blue-deep:      #3D6B8A

Neutral Text
  --text-primary:   #1A1A1A
  --text-secondary: #6B7280
  --text-muted:     #9CA3AF
  --text-placeholder: #C4C9C2

Feedback (EQ-Compliant)
  --feedback-success: #7A9E7E   /* same as sage, not alarming green */
  --feedback-warning: #C9A96E   /* warm amber, never red */
  --feedback-rest:    #B0B8AA   /* muted gray for "resting" states */

  /* ❌ No --feedback-error in red. Use amber or sage only. */
```

### 7.2 Typography

```css
/* Font Stack */
font-family: 'Inter', 'DM Sans', system-ui, sans-serif;

/* Scale */
--text-xs:    11px / 1.4   /* save status, badges */
--text-sm:    13px / 1.5   /* secondary labels, metadata */
--text-base:  15px / 1.6   /* body, task titles */
--text-md:    18px / 1.4   /* card headings */
--text-lg:    22px / 1.3   /* page titles, greeting */
--text-xl:    28px / 1.2   /* section heroes */
--text-2xl:   40px / 1.1   /* timer display */
--text-3xl:   64px / 1.0   /* full-focus timer */

/* Weight */
--font-regular:   400
--font-medium:    500
--font-semibold:  600
--font-bold:      700

/* Special */
--font-quote: 'Lora', Georgia, serif;  /* for motivational quotes, italic */
```

### 7.3 Spacing System

```
Base unit: 4px

--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px

Card padding:    24px (--space-6)
Sidebar width:   200px expanded / 64px collapsed
Card gap:        16px (--space-4)
Section gap:     32px (--space-8)
```

### 7.4 Border Radius

```
--radius-sm:   6px    /* tags, chips */
--radius-md:   12px   /* cards, inputs */
--radius-lg:   20px   /* large cards, modals */
--radius-xl:   28px   /* FAB, pill buttons */
--radius-full: 9999px /* circles, toggles */
```

### 7.5 Shadow System

```
--shadow-xs:  0 1px 2px rgba(0,0,0,0.04)
--shadow-sm:  0 2px 8px rgba(0,0,0,0.06)
--shadow-md:  0 4px 16px rgba(0,0,0,0.08)
--shadow-lg:  0 8px 32px rgba(0,0,0,0.10)
--shadow-fab: 0 4px 20px rgba(122,158,126,0.30)  /* sage-tinted FAB shadow */
```

### 7.6 Mood & Tone

- **Mood**: Calm forest morning. Slow. Breathable. Intentional.
- **Imagery**: Nature photography (stacked stones, rain on glass, plants, quiet corners)
- **Iconography**: Lucide React — thin stroke, 20px, never filled/heavy
- **Empty states**: Illustrated with soft watercolor-adjacent illustrations or atmospheric photos
- **Loading states**: Skeleton loaders with gentle pulse (sage-100 → sage-200)

---

## 8. Micro-Interactions & Emotional UX Elements

### 8.1 Task Interactions

| Interaction | Animation |
|---|---|
| Task captured | Capture bar clears, task slides in from top with opacity fade (200ms) |
| Task completed | Circle morphs to checkmark (spring easing, 300ms), card opacity fades to 0.4, slides down (400ms) |
| Task hovered | Subtle lift: `transform: translateY(-1px)`, shadow increases |
| Timer pill clicked | Pulses once (scale 1.05 → 1.0), Deep Work launches |

### 8.2 Dashboard Interactions

| Interaction | Animation |
|---|---|
| Recovery Mode activates | Complex widgets fade out (opacity 0, 500ms), calm layout fades in |
| Gentle reminder checked | Checkbox fills with sage, card gracefully fades (no pop, no confetti) |
| Simplify My Day tapped | Smooth layout collapse (height transitions, 400ms ease-out) |
| Energy state selected | Pill slides between options (translate, not swap), selection bounces softly |

### 8.3 Deep Work Timer

| State | Visual Behavior |
|---|---|
| Idle | Arc draws in slowly on page load (CSS draw animation, 1s) |
| Counting down | Arc depletes clockwise, smooth frame-by-frame (requestAnimationFrame) |
| Last 5 minutes | Arc color warms slightly (sage → warm green), no alarm |
| Session ended | Arc completes, brief full-circle pulse, gentle fade |
| Start button | Scale up on hover (1.02), depresses on click (scale 0.97) |

### 8.4 Habit Interactions

| Interaction | Animation |
|---|---|
| Log Sip | Ring arc increments smoothly (spring physics, 400ms) |
| Habit logged (+) | Segment fills left-to-right (300ms), score increments with count-up |
| Heatmap cell hover | Tooltip: "Monday · Completed" — soft fade in |
| New habit added | Card slides in from bottom of list (spring, 350ms) |

### 8.5 Notes Interactions

| Interaction | Animation |
|---|---|
| New block added | Block slides in from bottom with slight opacity fade (250ms) |
| Block reordered | Drag ghost has reduced opacity (0.7), drop target shows sage dashed border |
| Save state change | Status dot pulses once on state change (scale 1.2 → 1.0) |
| Voice memo played | Waveform bars animate (CSS keyframes, staggered) |

### 8.6 Emotional Language Rules (Copy Guidelines)

```
Instead of:           Use:
─────────────────────────────────────────────────────
"You failed"       →  "Let's try again tomorrow"
"Overdue"          →  "Waiting for you · No rush"
"Missed"           →  "Resting" / "Light day"
"0 streak"         →  (don't show streak at all)
"No activity"      →  "Quiet week — that's okay"
"Error"            →  "Something didn't load — try again"
"You must..."      →  "When you're ready..."
"Add a task now"   →  "I need to focus on..."  (placeholder)
"Login required"   →  "Pick up where you left off"
```

### 8.7 Sound Design (Optional, User-Controlled)

- **Task captured**: Subtle soft click (120ms, low freq)
- **Task completed**: Gentle chime (G major, short)
- **Focus session end**: Soft bowl ring (1.5s fade out)
- **All sounds**: Off by default, toggled in settings
- **Volume control**: Per-feature, not global only

### 8.8 Onboarding Micro-Flow

```
Step 1 (30 sec): Name + avatar only → "Welcome, [Name]. Take a breath."
Step 2 (optional): "What brings you here?" → 3 cards (Focus · Habits · Notes)
Step 3 (optional): "Start with one thing." → Single capture bar
→ No forced tour, no feature walkthroughs
→ Feature hints appear contextually on first use
→ "Did you know...?" tooltips dismiss permanently after one view
```

---

## Implementation Priority Order

| Phase | Scope |
|---|---|
| **Phase 1** | App shell · Dashboard · Tasks · Basic offline (IndexedDB) |
| **Phase 2** | Deep Work timer · Habits · Notes (block system) |
| **Phase 3** | Analytics · Recovery Mode intelligence · Advanced offline sync |
| **Phase 4** | Voice memos · AI conversational reset · White noise · Notifications |

---

> *"The goal is not to be perfect, but to be present."*
> — FocusFlow Design Principle

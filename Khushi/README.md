# KHUSHI // A Visual & Narrative Archive

> *"A camera doesn't remember everything. It remembers moments."*

A luxury, interactive 3D narrative experience celebrating memory, presence, and photographic journey. Built with **React 19**, **Three.js / React Three Fiber**, **GSAP ScrollTrigger**, and **Tailwind CSS**.

The central narrator of the journey is a photorealistic **Full-Frame 35mm DSLR** rendered in real-time 3D, guiding visitors through curated photographic moments, living video reels, and poetic editorial chapters.

---

## ✨ Features

### 📷 Interactive 3D DSLR Narrator & Spatial Journey
- **Dominant 3D Protagonist**: The 35mm DSLR is rendered large (~55–70% of viewport height) directly in front of the visitor, acting as the primary physical narrator across the entire archive.
- **Mouse Hover Parallax**: On the index/prologue page, moving the cursor rotates and tilts the 3D camera in real-time with silky spring damping.
- **Click & Drag 360° Inspection**: Click and drag anywhere across the hero section to freely spin the camera in full 360° with momentum and realistic friction decay (inspecting front, lens, sides, top, and rear controls).
- **Dynamic Lens Aiming**: As memories approach, the camera glides beside each photograph and dynamically computes the 3D direction vector to aim its front lens directly at the photograph (`DSLR on Left ---> Photo on Right`, or vice-versa).
- **Cinematic Settle & Shutter Capture**: Camera arrives at the scene first, settles into position, pauses, executes a subtle optical bloom & audio shutter capture impulse, and reveals the photograph in 100% crystal clarity.
- **Continuous 3D Spatial Trajectory**: The camera never teleports or resets to center between photographs; it continuously journeys from one memory pose to the next with natural angle variations (40°, 90°, 120°, 180°).
- **Realistic PBR Optics**: Multi-coated anti-reflective optical glass elements and knurled magnesium alloy finishes reacting dynamically to HDR environment lighting.

### 🖼️ Responsive Editorial Gallery & Fullscreen Lightbox
- **Fullscreen Cinematic Lightbox**: Clicking any photograph across the website opens a high-resolution viewer with dark backdrop blur, EXIF metadata strip, smooth keyboard (ESC, Left, Right) navigation, and click-outside dismissal.
- **Pure Image Presentation**: Zero darkening overlays or color degradation over the original photographs—100% natural, crisp clarity.
- **Balanced Side-by-Side Compositions**: Dual-column split layouts pairing photographs with frosted `.glass-panel` narrative cards.
- **Subtle Viewfinder HUD**: Minimalist corner brackets in warm gold and authentic EXIF data (focal length, aperture, shutter speed, ISO, date).

### 🎥 Living Motion Chapter (`VideoSection`)
- **Dual Viewfinder Reels**: Showcases moving recordings (`Video1.mp4` & `Video2.mp4`) side-by-side on desktop and tablet.
- **Live-View Recording HUD**: Real-time blinking red `REC ●` tag, live running timecode, format indicators (`1080P // H.264`), and golden progress scrubbers.
- **Interactive Controls**: Click to play/pause with animated central indicator, individual sound toggles (`MUTED / SOUND`) with live equalizer meters.
- **Smart Viewport Performance**: Utilizes `IntersectionObserver` to automatically play when visible and pause off-screen, maintaining 60 FPS performance.

### 🏛️ Narrative Chapter Structure
1. **Chapter 01: Through A Lens** — The prologue; camera awakens with interactive 3D rotation and editorial HUD markings.
2. **Chapter 02: Her** — Intimate portraits, quiet reflections, and the light between gestures.
3. **Chapter 03: Moments** — Passing through unfamiliar streets, fleeting greetings, and stone monuments.
4. **Chapter 04: The Journey** — Mountain highways, valley mist, and high-altitude tea stops.
5. **Chapter 05: Into The Forest** — Pinned progressive sequence: *Place → Person → Memory*.
6. **Special Chapter: Motion In Time** — Live video reels preserving laughter and movement.
7. **Chapter 06: The Mountains** — High-pass glacial sanctuary and prayer flags against the sky.
8. **Chapter 07: Looking Back** — Windows, quiet balconies, and evening contemplation.
9. **Epilogue: Some Moments Stay** — DSLR returns to front hero position with a gentle fade to black.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modern component-based UI and reactive state architecture |
| **Three.js & @react-three/fiber** | Real-time WebGL rendering engine and declarative 3D canvas |
| **@react-three/drei** | GLTF model loading, environmental HDR lighting, and 3D utilities |
| **GSAP & ScrollTrigger** | High-performance timeline scrub animations and scroll hooks |
| **Lenis** | Silky smooth momentum scrolling with hardware acceleration |
| **Tailwind CSS v4** | Modern responsive styling with custom luxury color and glassmorphism tokens |
| **Vite (Rolldown)** | Sub-second fast refresh development server and optimized production bundler |

---

## 📂 Project Structure

```text
Khushi/
├── public/
│   ├── media/                  # High-resolution photographs & MP4 videos
│   │   ├── Photo1.jpeg ... Photo31.jpeg
│   │   ├── Video1.mp4          # Living Motion Reel 01
│   │   └── Video2.mp4          # Living Motion Reel 02
│   └── models/
│       └── pentax_k-1_dslr.glb # 3D Pentax K-1 DSLR model
├── src/
│   ├── animations/
│   │   └── cameraTimeline.js   # GSAP ScrollTrigger timeline & reactive camera coordinates
│   ├── components/
│   │   ├── camera/             # 3D R3F components
│   │   │   ├── CameraModel.jsx       # 3D DSLR model, mouse tracking & drag inertia
│   │   │   ├── CameraScene.jsx       # R3F Canvas & responsive FOV controller
│   │   │   ├── CameraLights.jsx      # Photorealistic studio lighting
│   │   │   └── CameraEnvironment.jsx # Ambient HDR reflection environment
│   │   ├── gallery/            # Media presentation components
│   │   │   ├── CinematicMoment.jsx   # Side-by-side photograph & glassmorphic EXIF card
│   │   │   ├── PhotoSequence.jsx     # Pinned crossfade sequence (Place -> Person)
│   │   │   ├── PhotoHero.jsx         # Large mountain landscape hero presentation
│   │   │   └── VideoSection.jsx      # Living motion dual viewfinder video reels
│   │   ├── sections/           # Narrative chapter wrapper sections
│   │   │   ├── IntroSection.jsx      # Prologue & interactive 3D camera hero
│   │   │   ├── PortraitSection.jsx   # Chapter 02: Her
│   │   │   ├── MomentsSection.jsx    # Chapter 03: Moments
│   │   │   ├── JourneySection.jsx    # Chapter 04: The Journey
│   │   │   ├── ForestSection.jsx     # Chapter 05: Into The Forest
│   │   │   ├── MountainsSection.jsx  # Chapter 06: The Mountains
│   │   │   ├── LookingBackSection.jsx# Chapter 07: Looking Back
│   │   │   └── FinalSection.jsx      # Epilogue: Some Moments Stay
│   │   └── ui/                 # Atmosphere & UI overlays
│   │       ├── Navbar.jsx            # Minimal header with chapter navigation & audio toggle
│   │       ├── PageLoader.jsx        # Cinematic camera shutter preloader
│   │       ├── AudioAtmosphere.jsx   # Ambient audio track controller
│   │       ├── FilmOverlay.jsx       # Subtle analog film grain & vignette
│   │       └── ScrollIndicator.jsx   # Minimalist vertical scroll percentage ruler
│   ├── data/
│   │   └── gallery.js          # Centralized chapter metadata & photo records
│   ├── hooks/
│   │   └── useLenis.js         # Smooth scroll hook
│   ├── App.jsx                 # Master application layout
│   ├── index.css               # Design system tokens, glass-panel & photo styling
│   └── main.jsx                # Application root mount
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 1. Installation
Clone the repository or navigate to the project directory:

```bash
cd Khushi
npm install
```

### 2. Run the Development Server
Start the local Vite development server:

```bash
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:5173/
```

### 3. Production Build
To create a production-optimized build:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

---

## 📝 Customization Guide

### Adding New Photos
1. Place your image file into `public/media/` (e.g., `photo32.jpeg`).
2. Open `src/data/gallery.js` and append an entry to `GALLERY_PHOTOS`:
```javascript
{
  id: "photo-32",
  src: "/media/photo32.jpeg",
  chapter: "chapter-02", // or chapter-03, chapter-04, etc.
  title: "A Gentle Gaze",
  location: "Old Town",
  date: "October Evening",
  focalLength: "85mm",
  aperture: "f/1.4",
  shutter: "1/250s",
  iso: "100",
  aspect: "3:4", // '3:4' or '9:16'
  caption: "Warm golden light filtering through the terrace.",
}
```

### Updating Videos
1. Add video files directly into `public/media/` (e.g., `Video1.mp4`, `Video2.mp4`).
2. Customize the video card metadata (title, location, caption) inside `src/components/gallery/VideoSection.jsx`.

---

## 📜 License
Private personal archive. All photographs, videos, and narrative copy belong to the archive creator.


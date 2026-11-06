# Hindi Quiz Studio 🎬✨

A high-performance web studio for creating viral, educational Hindi Quiz videos and Ultra-HD posters in multiple aspect ratios (1:1 Square, 9:16 Reels/Shorts, 16:9 YouTube Landscape).

---

## 🚀 Key Features

- **Multi-Resolution Video & HD Posters**:
  - `1:1` Square (1080 × 1080) for Instagram posts
  - `9:16` Portrait (1080 × 1920) for Instagram Reels, YouTube Shorts & TikTok
  - `16:9` Landscape (1920 × 1080) for YouTube full videos
  - Ultra-HD 4K lossless PNG image export

- **Canva-Style Animations**:
  - **Canva Pan Animation** for Options: Options A, B, C, D slide in smoothly from left to right (`→`) with Ease-Out Cubic motion and opacity fade-in.
  - **Direct Question Display**: Questions are crisp, bold, and immediately visible from the very first frame.
  - **Countdown Timer**: 5-second animated progress line.
  - **Correct Answer Reveal**: Elegant emerald highlight and pulse celebration.

- **Audio Engine & TTS**:
  - Automated natural Hindi speech generation (Google TTS) for Question, Options, and Answer reveal.
  - Authentic timer ticking sound and victory chime.
  - WebCodecs multi-resolution encoder + lossless FFmpeg fast-start stream merger.

- **Google Hindi Fonts Integration**:
  - Dynamic Google Fonts Developer API integration featuring 62 Devanagari fonts (Kalam, Rozha One, Yatra One, Tiro Devanagari, Poppins, etc.).
  - Live preview modal and instant canvas font switching.

- **Interactive Canvas & Customization**:
  - Drag-and-drop positioning for Category heading, Question, Options, and Watermark.
  - Center watermark logo support with opacity and scale sliders.
  - Semi-transparent option card mode for clear watermark visibility.
  - Mobile-optimized interface with bottom tab navigation (Q/A, Size, Settings).

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### Installation
```bash
# Clone the repository
git clone https://github.com/devshubhlko/reel.git
cd reel

# Install dependencies
npm install
```

### Running Locally
```bash
# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173/` to launch Hindi Quiz Studio.

### Production Build
```bash
npm run build
```

---

## 📁 Project Structure

```
├── public/                 # Static assets (logos, timer sound, chime sound)
├── src/
│   ├── App.vue             # Main Quiz Studio interface & canvas renderer
│   ├── main.ts             # Vue application entry
│   └── style.css           # Tailwind CSS styles
├── server.js               # Express backend with FFmpeg video merger
├── tts-plugin.js           # Vite dev server TTS & audio-video merger plugin
├── package.json
└── vite.config.js
```

---

## 📜 License
MIT

# 🎙️ SoundScape — Premium Podcast Studio

A modern, fully responsive, and feature-rich Web Application designed for podcast creators, live soundboard mixing, and real-time audio management. Built from scratch with clean, semantic Vanilla Web Technologies and the Web Audio API.

Live Demo HTML5 CSS3 JavaScript Web Audio API License: MIT

🌐 Live Demo
🔗 Experience the live web application here:
👉 https://tasneemnimr.github.io/soundscape-studio/

🌟 Key Features
* **🧹 Real-Time Noise Reduction:** Customizable high-pass filter cutoff slider (0 - 500 Hz) to instantly eliminate unwanted background hums and microphone noise.
* **📊 Main Studio & Visualizer:** Real-time audio spectrum analysis and master engine controls using the Web Audio API.
* **🎛️ Interactive Soundboard:** Quick-access sound pads with synthesized audio effects for live podcast production.
* **🌊 Ambient Mixer:** Multi-channel ambient noise generator (Rain, Waves) with customizable audio faders.
* **📁 Recordings Library:** Persistent audio recording and playback system powered by Base64 encoding and LocalStorage.
* **🌓 Pink & Rose Aesthetic:** Custom-styled theme modes with fluid color transitions and modern studio UI.
* **🌐 Responsive Layout:** Fully adaptive layout optimized for Laptops, Tablets, and Mobile devices.

🎨 Color Palette & Design System
The application design follows accessible contrast guidelines with sleek modern studio pink tones:

| Element | Color Hex | Visual |
| :--- | :--- | :--- |
| **Studio Primary Card** | `#1F101F` | ████████ |
| **Primary Pink Accent** | `#EC4899` | ████████ |
| **Main Background** | `#0F050A` | ████████ |
| **Element Background** | `#2D162C` | ████████ |
| **Success / Record Active** | `#10B981` | ████████ |
| **Danger / Stop Action** | `#EF4444` | ████████ |

🛠️ Tech Stack & Concepts
* **Frontend Core:** Semantic HTML5, Custom CSS Properties (Variables), Vanilla JavaScript (ES6+, Web Audio API, MediaRecorder API).
* **Layout Engines:** CSS Grid & Flexbox, Responsive Media Queries.
* **State & Storage:** DOM Manipulation, Event Handling, Browser localStorage API, and Base64 FileReader encoding.
* **Version Control & Hosting:** Git, GitHub, GitHub Pages.

📂 Project Structure
soundscape-studio/
│
├── index.html          # Main Studio, Visualizer & Noise Filter page
├── soundboard.html     # Interactive Soundboard page
├── mixer.html          # Ambient Audio Mixer page
├── library.html        # Recordings Library & Persistence page
├── style.css           # Global CSS, Design System, Responsive Themes & Animations
├── app.js              # Core Audio Logic, BiquadFilter, State Management
└── README.md           # Project Documentation

---

## 👩‍💻 Author

* **Tasneem Nimr Nasr**
* Software Engineering Student
* GitHub: [@TasneemNimr](https://github.com/TasneemNimr)
* Email: tasneemnimr@gmail.com

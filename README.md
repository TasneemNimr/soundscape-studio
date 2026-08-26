# 🎙️ SoundScape — Multi-Page Podcast Studio & Portfolio

A modern, fully responsive, and feature-rich Web Application designed for podcast creators, featuring a sleek **Portfolio-style multi-page navigation**, live soundboard mixing, and real-time audio management. Built from scratch with clean, semantic Vanilla Web Technologies and the Web Audio API, wrapped in a custom Pink & Rose aesthetic.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Web Audio API](https://img.shields.io/badge/Web_Audio_API-FF4500?style=flat&logo=soundcharts&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌐 Live Demo
🔗 **Experience the live web application here:** 👉 [https://tasneemnimr.github.io/soundscape-studio/](https://tasneemnimr.github.io/soundscape-studio/)

---

## 🌟 Key Features

* **🧭 Portfolio-Style Multi-Page Navigation:** Clean top-bar architecture allowing seamless switching between dedicated studio pages (`index.html`, `soundboard.html`, `mixer.html`, `library.html`) while maintaining a unified visual identity.
* **🧹 Real-Time Noise Reduction:** Customizable high-pass filter cutoff slider (0 - 500 Hz) to instantly eliminate unwanted background hums and microphone noise.
* **🌸 Custom Pink & Rose Aesthetic:** Distinctive, eye-catching color palette tailored with sleek modern studio tones and fluid transitions.
* **📱 Fully Responsive Design:** Perfectly optimized layouts that adapt seamlessly across Laptops, Tablets, and Mobile devices.
* **📊 Main Studio & Visualizer:** Real-time audio spectrum analysis and master engine controls using the Web Audio API.
* **🎛️ Interactive Soundboard:** Quick-access sound pads with synthesized audio effects for live podcast production.
* **🌊 Ambient Mixer:** Multi-channel ambient noise generator (Rain, Waves) with customizable audio faders.
* **📁 Recordings Library:** Persistent audio recording and playback system powered by Base64 encoding and LocalStorage.

---

## 🎨 Color Palette & Design System

The application features a unique custom-crafted pink and rose theme for an engaging user experience:

| Element | Color Hex | Preview |
| :--- | :---: | :---: |
| **Main Background** | `#0F050A` | ![#0F050A](https://via.placeholder.com/15/0F050A/0F050A.text=+) `#0F050A` |
| **Primary Card / Navbar** | `#1F101F` | ![#1F101F](https://via.placeholder.com/15/1F101F/1F101F.text=+) `#1F101F` |
| **Element Background** | `#2D162C` | ![#2D162C](https://via.placeholder.com/15/2D162C/2D162C.text=+) `#2D162C` |
| **Primary Pink Accent** | `#EC4899` | ![#EC4899](https://via.placeholder.com/15/EC4899/EC4899.text=+) `#EC4899` |
| **Success / Record Active** | `#10B981` | ![#10B981](https://via.placeholder.com/15/10B981/10B981.text=+) `#10B981` |
| **Danger / Stop Action** | `#EF4444` | ![#EF4444](https://via.placeholder.com/15/EF4444/EF4444.text=+) `#EF4444` |

---

## 🛠️ Tech Stack & Concepts

* **Frontend Core:** Semantic HTML5, Custom CSS Properties (Variables), Vanilla JavaScript (ES6+, Web Audio API, MediaRecorder API).
* **Layout Engines:** CSS Grid & Flexbox, Responsive Media Queries.
* **State & Storage:** DOM Manipulation, Event Handling, Browser localStorage API, and Base64 FileReader encoding.
* **Version Control & Hosting:** Git, GitHub, GitHub Pages.

---

## 📂 Project Structure

```text
soundscape-studio/
│
├── index.html         # Main Studio, Visualizer & Noise Filter page
├── soundboard.html    # Interactive Soundboard page
├── mixer.html         # Ambient Audio Mixer page
├── library.html       # Recordings Library & Persistence page
├── style.css          # Global CSS, Custom Pink Theme & Responsive Media Queries
├── app.js             # Core Audio Logic, BiquadFilter, State Management
└── README.md          # Project Documentation
👩‍💻 Author & Developer Information
Full Name: Tasneem Nimr Nasr (Tasneem Nimr Abd Al-Qader Nasr)

Major: Software Engineering

University: University of Palestine

GitHub: @TasneemNimr

Email: tasneemnimr@gmail.com

Profile & Interests: A passionate software engineering student with a deep focus on front-end web development, UI/UX design, and interactive media production.

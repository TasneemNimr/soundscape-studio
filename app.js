// --- 1. Global State & DOM Elements ---
let audioCtx, analyser, microphone, masterGain;
let isEngineRunning = false, isRecording = false;
let mediaRecorder, recordedChunks = [];
let timerInterval, seconds = 0;

// Safe DOM Selection
const UI = {
    startBtn: document.getElementById('startStudioBtn'),
    recordBtn: document.getElementById('recordBtn'),
    timerDisplay: document.getElementById('timerDisplay'),
    canvas: document.getElementById('audioVisualizer'),
    recordingsList: document.getElementById('recordingsList'),
    themeToggle: document.getElementById('themeToggle'),
    langToggle: document.getElementById('langToggle')
};

// --- 2. Audio Engine Initialization ---
async function initAudioEngine() {
    if (isEngineRunning) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        masterGain = audioCtx.createGain();
        masterGain.connect(audioCtx.destination);
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphone = audioCtx.createMediaStreamSource(stream);
        microphone.connect(analyser);
        
        analyser.fftSize = 2048;
        isEngineRunning = true;
        
        if(UI.startBtn) {
            UI.startBtn.textContent = "Engine Running 🟢";
            UI.startBtn.style.background = "#2ed573";
        }
        if(UI.recordBtn) UI.recordBtn.classList.remove('disabled');
        if(UI.recordBtn) UI.recordBtn.disabled = false;
        
        setupRecording(stream);
        if(UI.canvas) drawVisualizer();
        
    } catch (err) {
        alert("Please allow microphone access to start the engine.");
        console.error(err);
    }
}

// --- 3. Visualizer (Only runs if canvas exists on page) ---
function drawVisualizer() {
    if (!UI.canvas) return;
    const canvasCtx = UI.canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Auto-resize canvas
    UI.canvas.width = UI.canvas.parentElement.clientWidth;
    UI.canvas.height = UI.canvas.parentElement.clientHeight;

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, UI.canvas.width, UI.canvas.height);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = '#d94f87';
        canvasCtx.beginPath();
        
        const sliceWidth = UI.canvas.width * 1.0 / bufferLength;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * (UI.canvas.height / 2);
            if (i === 0) canvasCtx.moveTo(x, y);
            else canvasCtx.lineTo(x, y);
            x += sliceWidth;
        }
        canvasCtx.lineTo(UI.canvas.width, UI.canvas.height / 2);
        canvasCtx.stroke();
    }
    draw();
}

// --- 4. Recording Logic ---
function setupRecording(stream) {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = saveRecording;
}

function toggleRecording() {
    if (!isRecording) {
        recordedChunks = [];
        mediaRecorder.start();
        isRecording = true;
        UI.recordBtn.textContent = "⏹ Stop Recording";
        UI.recordBtn.classList.replace('btn-danger', 'btn-primary');
        timerInterval = setInterval(() => {
            seconds++;
            const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
            const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
            const secs = String(seconds % 60).padStart(2, '0');
            if(UI.timerDisplay) UI.timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
        }, 1000);
    } else {
        mediaRecorder.stop();
        isRecording = false;
        clearInterval(timerInterval);
        seconds = 0;
        if(UI.timerDisplay) UI.timerDisplay.textContent = "00:00:00";
        UI.recordBtn.textContent = "⏺ Record";
        UI.recordBtn.classList.replace('btn-primary', 'btn-danger');
    }
}

function saveRecording() {
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    
    // استخدام FileReader لتحويل الـ Blob إلى Base64 String ثابت يمكن حفظه في localStorage
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    
    reader.onloadend = function() {
        const base64Audio = reader.result; // هذا نص طويل وثابت يمثل الملف بالكامل
        
        const records = JSON.parse(localStorage.getItem('recordings') || '[]');
        records.push({ url: base64Audio, date: new Date().toLocaleString() });
        
        localStorage.setItem('recordings', JSON.stringify(records));
        alert("Recording saved successfully to Library!");
        
        if (UI.recordingsList) loadLibrary();
    };
}

// --- 5. Library Page Logic ---
function loadLibrary() {
    if (!UI.recordingsList) return;
    const records = JSON.parse(localStorage.getItem('recordings') || '[]');
    if (records.length === 0) return;
    
    UI.recordingsList.innerHTML = '';
    records.forEach((rec, index) => {
        const div = document.createElement('div');
        div.className = 'audio-item';
        div.innerHTML = `
            <span>Recording ${index + 1} - ${rec.date}</span>
            <audio controls src="${rec.url}"></audio>
        `;
        UI.recordingsList.appendChild(div);
    });
}

// --- 6. Synthesized Soundboard (Works without external files) ---
function playSynthSound(type) {
    if (!audioCtx) initAudioEngine();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(masterGain);
    
    if (type === 'chime') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
        osc.start(); osc.stop(audioCtx.currentTime + 1);
    } else if (type === 'buzzer') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'kick') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'synth') {
        osc.type = 'square'; osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    }
}

// --- 7. Synthesized Ambient Mixer ---
const ambients = { rain: null, waves: null };
function generateNoise() {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
}

function handleAmbientChange(e) {
    if (!audioCtx) initAudioEngine();
    const type = e.target.dataset.ambient;
    const val = parseFloat(e.target.value);
    
    if (val > 0 && !ambients[type]) {
        const source = audioCtx.createBufferSource();
        source.buffer = generateNoise(); // Generate static noise
        source.loop = true;
        
        const filter = audioCtx.createBiquadFilter(); // Filter to make it sound like rain/waves
        filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.value = type === 'rain' ? 1000 : 400;
        
        const gain = audioCtx.createGain();
        source.connect(filter); filter.connect(gain); gain.connect(masterGain);
        
        ambients[type] = { source, gain };
        source.start();
    }
    
    if (ambients[type]) ambients[type].gain.gain.value = val;
}

// --- 8. Event Listeners ---
if (UI.startBtn) UI.startBtn.addEventListener('click', initAudioEngine);
if (UI.recordBtn) UI.recordBtn.addEventListener('click', toggleRecording);
document.querySelectorAll('.sound-pad').forEach(pad => pad.addEventListener('click', () => playSynthSound(pad.dataset.sound)));
document.querySelectorAll('.ambient-fader').forEach(fader => fader.addEventListener('input', handleAmbientChange));
window.addEventListener('DOMContentLoaded', loadLibrary);

// --- Theme & Lang Toggles ---
UI.themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
});
UI.langToggle.addEventListener('click', () => {
    const html = document.documentElement;
    html.dir = html.dir === 'ltr' ? 'rtl' : 'ltr';
    UI.langToggle.textContent = html.dir === 'rtl' ? 'EN' : 'AR';
});
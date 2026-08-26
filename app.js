let audioCtx;
let mediaRecorder;
let recordedChunks = [];
let noiseFilter;
let analyser;
let dataArray;
let bufferLength;
let canvas, canvasCtx;

// Ambient Mixer Audio Nodes
let rainSource = null, rainGain = null;
let wavesSource = null, wavesGain = null, wavesFilter = null;

const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const noiseSlider = document.getElementById('noiseSlider');
const sliderValueDisplay = document.getElementById('sliderValue');

const rainSlider = document.getElementById('rainSlider');
const rainVal = document.getElementById('rainVal');
const wavesSlider = document.getElementById('wavesSlider');
const wavesVal = document.getElementById('wavesVal');

window.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('visualizer');
    if (canvas) {
        canvas.width = canvas.parentElement.clientWidth - 40;
        canvas.height = 150;
        canvasCtx = canvas.getContext('2d');
        drawVisualizer();
    }
    loadLibrary();
});

async function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = "highpass";
        noiseFilter.frequency.setValueAtTime(parseInt(noiseSlider ? noiseSlider.value : 100), audioCtx.currentTime);

        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }
    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }
}

// Noise Reduction Slider
if (noiseSlider) {
    noiseSlider.addEventListener('input', (e) => {
        const freqValue = parseInt(e.target.value);
        if (sliderValueDisplay) sliderValueDisplay.textContent = freqValue;
        if (noiseFilter && audioCtx) {
            noiseFilter.frequency.setValueAtTime(freqValue, audioCtx.currentTime);
        }
    });
}

// Visualizer Animation
function drawVisualizer() {
    if (!canvasCtx || !canvas) return;
    requestAnimationFrame(drawVisualizer);

    if (analyser) {
        analyser.getByteFrequencyData(dataArray);
    } else {
        dataArray.fill(0);
    }

    canvasCtx.fillStyle = '#0f050a';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 1.5;
        canvasCtx.fillStyle = '#f472b6';
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }
}

// 🎛️ Soundboard Audio Generator
function playSound(type) {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'bell') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
    } else if (type === 'drum') {
        osc.type = 'triangle';
        for (let i = 0; i < 4; i++) {
            osc.frequency.setValueAtTime(120 + i * 40, audioCtx.currentTime + i * 0.08);
        }
        gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'laugh') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(350, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(550, audioCtx.currentTime + 0.15);
        osc.frequency.linearRampToValueAtTime(350, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
    } else { // Applause
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }
}

// 🌊 Ambient Mixer Generator
function createNoiseBuffer() {
    if (!audioCtx) return null;
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

if (rainSlider) {
    rainSlider.addEventListener('input', async (e) => {
        const val = e.target.value;
        rainVal.textContent = val;
        await initAudio();

        if (!rainGain) {
            const buffer = createNoiseBuffer();
            if (!buffer) return;
            rainSource = audioCtx.createBufferSource();
            rainSource.buffer = buffer;
            rainSource.loop = true;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1200;

            rainGain = audioCtx.createGain();
            rainGain.gain.value = 0;

            rainSource.connect(filter);
            filter.connect(rainGain);
            rainGain.connect(audioCtx.destination);
            rainSource.start();
        }
        rainGain.gain.setValueAtTime((val / 100) * 0.25, audioCtx.currentTime);
    });
}

if (wavesSlider) {
    wavesSlider.addEventListener('input', async (e) => {
        const val = e.target.value;
        wavesVal.textContent = val;
        await initAudio();

        if (!wavesGain) {
            const buffer = createNoiseBuffer();
            if (!buffer) return;
            wavesSource = audioCtx.createBufferSource();
            wavesSource.buffer = buffer;
            wavesSource.loop = true;

            wavesFilter = audioCtx.createBiquadFilter();
            wavesFilter.type = 'lowpass';
            wavesFilter.frequency.value = 350;

            wavesGain = audioCtx.createGain();
            wavesGain.gain.value = 0;

            wavesSource.connect(wavesFilter);
            wavesFilter.connect(wavesGain);
            wavesGain.connect(audioCtx.destination);
            wavesSource.start();
        }
        wavesGain.gain.setValueAtTime((val / 100) * 0.35, audioCtx.currentTime);
    });
}

// Recording Logic
if (recordBtn) {
    recordBtn.addEventListener('click', async () => {
        await initAudio();
        recordedChunks = [];
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const source = audioCtx.createMediaStreamSource(stream);
            
            source.connect(noiseFilter);
            noiseFilter.connect(analyser);
            
            const destination = audioCtx.createMediaStreamDestination();
            noiseFilter.connect(destination);

            mediaRecorder = new MediaRecorder(destination.stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                saveRecording();
            };

            mediaRecorder.start();
            recordBtn.disabled = true;
            stopBtn.disabled = false;
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please check permissions and use Live Server.");
        }
    });
}

if (stopBtn) {
    stopBtn.addEventListener('click', () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            recordBtn.disabled = false;
            stopBtn.disabled = true;
        }
    });
}

function saveRecording() {
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    
    reader.onloadend = function() {
        const base64Audio = reader.result;
        const records = JSON.parse(localStorage.getItem('recordings') || '[]');
        records.push({ url: base64Audio, date: new Date().toLocaleString() });
        
        localStorage.setItem('recordings', JSON.stringify(records));
        alert("Recording saved successfully with noise filter applied!");
        loadLibrary();
    };
}

function loadLibrary() {
    const listContainer = document.getElementById('recordingsList');
    if (!listContainer) return;

    const records = JSON.parse(localStorage.getItem('recordings') || '[]');
    if (records.length === 0) {
        listContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No recordings found yet. Go to Studio and record your podcast!</p>';
        return;
    }

    listContainer.innerHTML = '';
    records.forEach((rec, index) => {
        const item = document.createElement('div');
        item.className = 'recording-item';
        item.innerHTML = `
            <span>🎙️ Recording #${index + 1} (${rec.date})</span>
            <audio controls src="${rec.url}" style="height: 35px;"></audio>
        `;
        listContainer.appendChild(item);
    });
}

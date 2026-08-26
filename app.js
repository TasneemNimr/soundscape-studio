let audioCtx;
let mediaRecorder;
let recordedChunks = [];
let noiseFilter;
let analyser;
let dataArray;
let bufferLength;
let canvas, canvasCtx;

const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const noiseSlider = document.getElementById('noiseSlider');
const sliderValueDisplay = document.getElementById('sliderValue');

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

if (noiseSlider) {
    noiseSlider.addEventListener('input', (e) => {
        const freqValue = parseInt(e.target.value);
        if (sliderValueDisplay) sliderValueDisplay.textContent = freqValue;
        if (noiseFilter && audioCtx) {
            noiseFilter.frequency.setValueAtTime(freqValue, audioCtx.currentTime);
        }
    });
}

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

function playSound(type) {
    alert(`Playing sound effect: ${type} 🎶`);
}
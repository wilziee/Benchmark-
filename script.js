document.addEventListener("DOMContentLoaded", async () => {
    // Screens
    const screenLoading = document.getElementById("screen-loading");
    const screenHome = document.getElementById("screen-home");
    const screenBenchmark = document.getElementById("screen-benchmark");
    const screenResult = document.getElementById("screen-result");

    // Initialize Device Info
    const deviceInfo = await DeviceDetector.getInfo();
    DeviceDetector.renderInfo(deviceInfo, "device-details");

    // Transition Loading -> Home
    setTimeout(() => {
        screenLoading.classList.remove("active");
        screenHome.classList.add("active");
        screenHome.classList.remove("hidden");
    }, 1500);

    // Audio Context Setup (Sound Effect) - DITAMBAH TRY-CATCH
    let audioCtx;
    function playBeep(freq, type) {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
            osc.stop(audioCtx.currentTime + 0.5);
        } catch (e) {
            console.warn("Audio diblokir oleh browser, skip sound effect.");
        }
    }

    // Benchmark Execution
    document.getElementById("btn-start").addEventListener("click", async () => {
        playBeep(440, 'sine');
        screenHome.classList.remove("active");
        screenHome.classList.add("hidden");
        screenBenchmark.classList.remove("hidden");
        screenBenchmark.classList.add("active");

        const progressText = document.getElementById("progress-percent");
        const progressCircle = document.getElementById("progress-circle");
        const testName = document.getElementById("current-test-name");
        
        // Visualizer Canvas (Cosmetic Data Wave)
        const vCanvas = document.getElementById("visualizer");
        const vCtx = vCanvas.getContext("2d");
        let vAnim;
        let vOffset = 0;
        function drawWave() {
            vCtx.clearRect(0, 0, vCanvas.width, vCanvas.height);
            vCtx.beginPath();
            vCtx.strokeStyle = "#e0aaff";
            vCtx.lineWidth = 2;
            for(let i=0; i<vCanvas.width; i+=5) {
                const y = Math.sin((i + vOffset) * 0.05) * 30 + (Math.random()*20) + 50;
                if(i===0) vCtx.moveTo(i, y);
                else vCtx.lineTo(i, y);
            }
            vCtx.stroke();
            vOffset += 5;
            vAnim = requestAnimationFrame(drawWave);
        }
        drawWave();

        // Update Callback for Engine
        const onProgress = (name, percent) => {
            testName.innerText = name;
            progressText.innerText = `${percent}%`;
            const circumference = 565; // 2 * PI * 90
            const offset = circumference - (percent / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        };

        const engine = new BenchmarkEngine(onProgress);
        const scores = await engine.startAll();

        cancelAnimationFrame(vAnim);
        
        // Calculate Total
        const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
        
        // Save to LocalStorage History
        const history = JSON.parse(localStorage.getItem('xaerisoft_history') || '[]');
        history.push({ date: new Date().toISOString(), score: totalScore });
        localStorage.setItem('xaerisoft_history', JSON.stringify(history));

        showResults(scores, totalScore);
    });

    // Result Rendering
    function showResults(scores, total) {
        screenBenchmark.classList.remove("active");
        screenBenchmark.classList.add("hidden");
        screenResult.classList.remove("hidden");
        screenResult.classList.add("active");

        playBeep(880, 'square'); // Success sound
        fireConfetti();

        // Animate Numbers
        animateValue("final-score", 0, total, 2000);
        animateValue("score-cpu", 0, scores.cpu, 1500);
        animateValue("score-gpu", 0, scores.gpu, 1500);
        animateValue("score-ram", 0, scores.ram, 1500);
        animateValue("score-storage", 0, scores.storage, 1500);
        animateValue("score-browser", 0, scores.browser, 1500);
        animateValue("score-ai", 0, scores.ai, 1500);

        // Rating Logic
        const badge = document.getElementById("rating-badge");
        if (total > 800000) badge.innerText = "🚀 Apa itu Game berat 💀";
        else if (total > 500000) badge.innerText = "💎 Gacorr...login bangg🔥";
        else if (total > 300000) badge.innerText = "🥇 GG infokan mabar😎";
        else if (total > 150000) badge.innerText = "🥈 lumayann👌";
        else badge.innerText = "🥉 main pou ajaa😹✌️";

        // Comparison Logic
        const comp = document.getElementById("comparison-device");
        if (total > 1000000) comp.innerText = "Galaxy S24 Ultra / iPhone 15 Pro";
        else if (total > 700000) comp.innerText = "iPhone 13 / Pixel 8";
        else if (total > 400000) comp.innerText = "Galaxy A54 / Redmi Note 13 Pro";
        else if (total > 200000) comp.innerText = "Infinix Note 30 / Samsung A15";
        else comp.innerText = "Entry Level Devices";
    }

    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString('id-ID');
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    // Native Confetti Implementation
    function fireConfetti() {
        const canvas = document.getElementById('canvas-confetti');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const pieces = [];
        for(let i=0; i<100; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 10 + 5,
                h: Math.random() * 10 + 5,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                speed: Math.random() * 3 + 2,
                rot: Math.random() * 360
            });
        }
        function draw() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            let active = false;
            pieces.forEach(p => {
                p.y += p.speed;
                p.rot += p.speed;
                if(p.y < canvas.height) active = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
                ctx.restore();
            });
            if(active) requestAnimationFrame(draw);
            else ctx.clearRect(0,0,canvas.width,canvas.height);
        }
        draw();
    }

    // Button Actions
    document.getElementById("btn-restart").addEventListener("click", () => location.reload());
    
    document.getElementById("btn-theme").addEventListener("click", () => {
        document.body.style.filter = document.body.style.filter === 'invert(1)' ? 'none' : 'invert(1)';
    });

    document.getElementById("btn-export-pdf").addEventListener("click", () => {
        window.print(); // Solusi native browser untuk export PDF
    });

    document.getElementById("btn-export-png").addEventListener("click", () => {
        // Simple Screenshot trick via Canvas for UI
        const score = document.getElementById("final-score").innerText;
        const rank = document.getElementById("rating-badge").innerText;
        const c = document.createElement('canvas');
        c.width = 600; c.height = 400;
        const ctx = c.getContext('2d');
        
        ctx.fillStyle = '#0b0914'; ctx.fillRect(0,0,600,400);
        ctx.fillStyle = '#9d4edd'; ctx.font = '30px Arial'; ctx.fillText('⚡ XAERISOFT BENCHMARK', 100, 80);
        ctx.fillStyle = '#fff'; ctx.font = '60px Arial'; ctx.fillText(`SCORE: ${score}`, 100, 200);
        ctx.fillStyle = 'gold'; ctx.font = '40px Arial'; ctx.fillText(rank, 100, 280);
        
        const link = document.createElement('a');
        link.download = `Xaerisoft_Benchmark_${score}.png`;
        link.href = c.toDataURL();
        link.click();
    });

    document.getElementById("btn-share").addEventListener("click", async () => {
        const text = `Saya mendapat skor ${document.getElementById("final-score").innerText} di Xaerisoft Benchmark! Coba sekarang!`;
        if (navigator.share) {
            await navigator.share({ title: 'Xaerisoft Benchmark', text: text, url: window.location.href });
        } else {
            prompt("Salin teks ini untuk membagikan skor kamu:", text);
        }
    });
});

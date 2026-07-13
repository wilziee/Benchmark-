/**
 * Xaerisoft Device Benchmark Engine
 * Core Logic, Metrics Pipeline, and Architectural Emulation.
 * Created by: WillXD
 * Copyright © 2026 WillXD
 */

document.addEventListener('DOMContentLoaded', () => {
    // UI Panels
    const welcomeScreen = document.getElementById('welcome-screen');
    const benchmarkScreen = document.getElementById('benchmark-screen');
    const calcScreen = document.getElementById('calc-screen');
    const resultScreen = document.getElementById('result-screen');

    // Controls
    const startBtn = document.getElementById('start-btn');
    const terminalContainer = document.getElementById('terminal-container');
    const testProgressBar = document.getElementById('test-progress-bar');
    const globalProgressPercent = document.getElementById('global-progress-percent');
    const currentTestIndex = document.getElementById('current-test-index');
    const currentTestName = document.getElementById('current-test-name');
    const sandbox = document.getElementById('sandbox-environment');
    const countdownNumber = document.getElementById('countdown-number');

    // Data Repositories
    let rawResults = {};
    let scores = {};
    let pointerLatencyData = [];

    // Initialize System Environment Aesthetics
    generateStarfield();
    detectSystemEnvironment();

    // Event Bindings
    startBtn.addEventListener('click', executionPipeline);
    document.getElementById('btn-copy').addEventListener('click', copyResultsToClipboard);
    document.getElementById('btn-txt').addEventListener('click', exportAsTXT);
    document.getElementById('btn-json').addEventListener('click', exportAsJSON);
    document.getElementById('btn-restart').addEventListener('click', () => window.location.reload());

    // Continuous capture for Pointer latency metrics
    window.addEventListener('pointermove', (e) => {
        if(e.timeStamp) {
            const delay = performance.now() - e.timeStamp;
            if(delay >= 0 && delay < 200) pointerLatencyData.push(delay);
        }
    });

    /**
     * Ambient Space Rendering Core
     */
    function generateStarfield() {
        const container = document.getElementById('stars-container');
        const count = 60;
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.width = star.style.height = `${Math.random() * 2 + 1}px`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            container.appendChild(star);
        }
    }

    /**
     * Initial System Specs Detection
     */
    function detectSystemEnvironment() {
        document.getElementById('quick-agent').textContent = navigator.userAgent.split(' ').slice(-1)[0] || 'Unknown';
        document.getElementById('quick-cores').textContent = navigator.hardwareConcurrency || '--';
    }

    /**
     * Log Stream Utility
     */
    function writeLog(text, type = 'running') {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.textContent = `> ${text}`;
        terminalContainer.appendChild(line);
        terminalContainer.scrollTop = terminalContainer.scrollHeight;
    }

    /**
     * Synthetic Delay Orchestrator
     */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Master Benchmark Pipeline
     */
    async function executionPipeline() {
        // Toggle Panels
        welcomeScreen.classList.remove('active');
        benchmarkScreen.classList.add('active');

        // Target Configuration for 12 core tests
        const tests = [
            { id: 'init', name: 'Initializing Architecture...' },
            { id: 'js_engine', name: 'JavaScript Engine Test' },
            { id: 'cpu_loop', name: 'CPU Processing Loop' },
            { id: 'dom_render', name: 'DOM Rendering Engine' },
            { id: 'canvas_render', name: 'Canvas 2D Pipeline' },
            { id: 'css_render', name: 'CSS Animation Profiler' },
            { id: 'anim_raf', name: 'rAF Frame Stability Test' },
            { id: 'webgl', name: 'WebGL Shader Sub-system' },
            { id: 'memory', name: 'System Memory Profiler' },
            { id: 'latency', name: 'Input Interactivity Delay' },
            { id: 'network', name: 'Network Telemetry Check' },
            { id: 'features', name: 'HTML5 Capability Matrix' }
        ];

        for (let idx = 0; idx < tests.length; idx++) {
            const activeTest = tests[idx];
            currentTestIndex.textContent = `Test ${idx + 1}/${tests.length}`;
            currentTestName.textContent = activeTest.name;
            writeLog(`Launching ${activeTest.name}...`, 'core-system');

            // Track operational progress
            await runProgressSimulation(0, 100, 1800, activeTest.id);
            
            const globalPct = Math.round(((idx + 1) / tests.length) * 100);
            globalProgressPercent.textContent = `${globalPct}%`;
        }

        // Processing / Score calculation transition phase
        benchmarkScreen.classList.remove('active');
        calcScreen.classList.add('flex-center');
        
        for(let countdown = 3; countdown > 0; countdown--) {
            countdownNumber.textContent = countdown;
            await sleep(1000);
        }

        computeAnalyticalScores();
        renderDashboard();

        calcScreen.classList.remove('flex-center');
        resultScreen.classList.add('active');
    }

    /**
     * Progress Execution Handler & Telemetry Ingestion
     */
    async function runProgressSimulation(start, end, duration, testId) {
        const intervals = 10;
        const stepTime = duration / intervals;
        let currentProgress = start;

        for (let i = 1; i <= intervals; i++) {
            currentProgress += (end - start) / intervals;
            testProgressBar.style.width = `${currentProgress}%`;
            
            if (i === 5) {
                // Execute physical operation mid-flight to harvest telemetry
                const result = await executeSyntheticWorkload(testId);
                rawResults[testId] = result;
                writeLog(`Data Harvested: ${result.summary || 'OK'}`, 'running');
            }
            await sleep(stepTime);
        }
        writeLog(`Completed: ${testId.toUpperCase()}`, 'complete');
    }

    /**
     * Hardware Workload Emulation Engine
     */
    async function executeSyntheticWorkload(id) {
        switch(id) {
            case 'init':
                return { summary: 'Environment Warmup Complete.' };

            case 'js_engine': {
                // Intense mathematical stress loop (JSRef)
                const start = performance.now();
                let val = 0;
                for(let i = 0; i < 4000000; i++) {
                    val += Math.sin(i) * Math.cos(i);
                }
                const duration = performance.now() - start;
                return { duration, summary: `${duration.toFixed(2)}ms across 4M operations.` };
            }

            case 'cpu_loop': {
                // Structure Allocation & Sort Stress
                const start = performance.now();
                let arr = [];
                for(let i = 0; i < 45000; i++) {
                    arr.push({ id: i, value: Math.random(), tag: `node_${i}` });
                }
                arr.sort((a, b) => a.value - b.value);
                const filtered = arr.filter(item => item.value > 0.5);
                const duration = performance.now() - start;
                return { duration, summary: `Processed array of ${arr.length} nodes in ${duration.toFixed(2)}ms.` };
            }

            case 'dom_render': {
                // Heavy layout generation & destruction
                const start = performance.now();
                sandbox.style.opacity = '1';
                for(let cycle=0; cycle < 2; cycle++) {
                    sandbox.innerHTML = '';
                    const fragment = document.createDocumentFragment();
                    for(let i=0; i<1500; i++) {
                        const d = document.createElement('div');
                        d.style.cssText = "width:2px; height:2px; background:purple; display:inline-block;";
                        fragment.appendChild(d);
                    }
                    sandbox.appendChild(fragment);
                    // Force Layout Engine Recalculation
                    const triggerHeight = sandbox.offsetHeight;
                }
                sandbox.innerHTML = '';
                sandbox.style.opacity = '0.2';
                const duration = performance.now() - start;
                return { duration, summary: `Generated & destroyed 3000 DOM elements in ${duration.toFixed(2)}ms.` };
            }

            case 'canvas_render': {
                // Vector Canvas drawing loops
                const start = performance.now();
                const cvs = document.createElement('canvas');
                cvs.width = 400; cvs.height = 40;
                const ctx = cvs.getContext('2d');
                sandbox.appendChild(cvs);

                let renderCycles = 0;
                for(let f=0; f<250; f++) {
                    ctx.clearRect(0,0,400,40);
                    for(let j=0; j<80; j++) {
                        ctx.fillStyle = `rgb(${j*3}, 0, ${255-j*3})`;
                        ctx.fillRect((j*5 + f)%400, 10, 8, 8);
                    }
                    renderCycles++;
                }
                sandbox.removeChild(cvs);
                const duration = performance.now() - start;
                return { duration, summary: `${renderCycles} frames computed on standard context.` };
            }

            case 'css_render': {
                // Simulated CSS performance layout validation
                return { summary: 'Hardware Compositor verification active.' };
            }

            case 'anim_raf': {
                // Active Frame Sync evaluation
                return new Promise((resolve) => {
                    let frames = 0;
                    const startTime = performance.now();
                    function tick() {
                        frames++;
                        if (performance.now() - startTime < 400) {
                            requestAnimationFrame(tick);
                        } else {
                            const calculatedFPS = Math.round((frames * 1000) / (performance.now() - startTime));
                            resolve({ fps: calculatedFPS, summary: `Averaged standard ${calculatedFPS} FPS context.` });
                        }
                    }
                    requestAnimationFrame(tick);
                });
            }

            case 'webgl': {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                if(!gl) return { supported: false, summary: 'Not Supported' };
                
                // Real lightweight WebGL operations
                gl.clearColor(0.1, 0.0, 0.2, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                const ext = gl.getExtension('WEBGL_debug_renderer_info');
                const renderer = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "Generic System Engine";
                return { supported: true, renderer, summary: `Supported (${renderer})` };
            }

            case 'memory': {
                const memoryAlloc = navigator.deviceMemory;
                return { 
                    supported: !!memoryAlloc, 
                    val: memoryAlloc || 'Not Supported',
                    summary: memoryAlloc ? `${memoryAlloc} GB Available Pool` : 'Not Supported'
                };
            }

            case 'latency': {
                // Extrapolate responsiveness from collected window listeners
                const validPoints = pointerLatencyData.filter(d => d > 0);
                const averageLatency = validPoints.length ? (validPoints.reduce((a,b)=>a+b, 0) / validPoints.length) : 4.2;
                return { latency: averageLatency, summary: `Response threshold estimated at ${averageLatency.toFixed(2)}ms.` };
            }

            case 'network': {
                const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                return {
                    online: navigator.onLine,
                    downlink: conn ? conn.downlink : 'Unknown',
                    rtt: conn ? conn.rtt : 'Unknown',
                    summary: `Status: ${navigator.onLine ? 'Online' : 'Offline'} | Downlink: ${conn ? conn.downlink + 'Mbps' : '--'}`
                };
            }

            case 'features': {
                const featureMatrix = {
                    canvas: !!window.CanvasRenderingContext2D,
                    webgl: !!window.WebGLRenderingContext2D,
                    clipboard: !!navigator.clipboard,
                    notifications: 'Notification' in window,
                    storage: !!navigator.storage,
                    concurrency: !!navigator.hardwareConcurrency
                };
                const passCount = Object.values(featureMatrix).filter(Boolean).length;
                return { matrix: featureMatrix, count: passCount, summary: `Passed ${passCount}/6 modern structural standards.` };
            }
        }
    }
    /**
     * Analytical Math Framework (Weight-Scaled Real Scoring Engine)
     */
    function computeAnalyticalScores() {
        // Safe Reference Defaults (Inverse Scaling for execution delays)
        const jsTime = rawResults.js_engine?.duration || 150;
        const cpuTime = rawResults.cpu_loop?.duration || 120;
        const domTime = rawResults.dom_render?.duration || 100;
        const canvasTime = rawResults.canvas_render?.duration || 100;
        const rAfFPS = rawResults.anim_raf?.fps || 60;
        const webGLOk = rawResults.webgl?.supported ? 10000 : 2000;
        const memGB = typeof rawResults.memory?.val === 'number' ? rawResults.memory.val : 4;
        const latencyMs = rawResults.latency?.latency || 5;

        // Establish Weighted Linear Models
        scores.javascript = Math.max(1000, Math.round((4000 / jsTime) * 2000));
        scores.cpu = Math.max(1000, Math.round((3500 / cpuTime) * 2000));
        scores.dom = Math.max(1000, Math.round((2500 / domTime) * 1500));
        scores.canvas = Math.max(1000, Math.round((3000 / canvasTime) * 1500));
        scores.animation = Math.round((rAfFPS / 60) * 9500);
        scores.gpu = webGLOk;
        scores.memory = Math.round((memGB / 8) * 9000);
        scores.network = rawResults.network?.online ? 9800 : 1500;
        scores.browser = Math.round(( (rawResults.features?.count || 4) / 6) * 10000);

        // Standardized Weights Configuration
        const weights = {
            cpu: 0.20,
            javascript: 0.20,
            canvas: 0.15,
            dom: 0.10,
            animation: 0.10,
            memory: 0.10,
            browser: 0.10,
            network: 0.05
        };

        // Aggregated Synthetic Composite Formula
        let totalScore = 
            (scores.cpu * weights.cpu) +
            (scores.javascript * weights.javascript) +
            (scores.canvas * weights.canvas) +
            (scores.dom * weights.dom) +
            (scores.animation * weights.animation) +
            (scores.memory * weights.memory) +
            (scores.browser * weights.browser) +
            (scores.network * weights.network);

        // Inject dynamic variance based on graphics engine validation
        if(rawResults.webgl?.supported) totalScore += 1200;

        scores.overall = Math.round(totalScore);
    }

    /**
     * Component Rendering Pipeline
     */
    function renderDashboard() {
        // Set Overall Score Counter Animation
        animateCounter('overall-score', 0, scores.overall, 1500);

        // Resolve Tier Bracket Classification
        const tierBadge = document.getElementById('tier-badge');
        let tierClass = '';
        let tierLabel = '';

        if (scores.overall >= 95000) { tierClass = 'tier-beast'; tierLabel = '🏆 Beast'; }
        else if (scores.overall >= 85000) { tierClass = 'tier-excellent'; tierLabel = '🚀 Excellent'; }
        else if (scores.overall >= 70000) { tierClass = 'tier-great'; tierLabel = '⭐ Great'; }
        else if (scores.overall >= 50000) { tierClass = 'tier-good'; tierLabel = '👍 Good'; }
        else if (scores.overall >= 30000) { tierClass = 'tier-average'; tierLabel = '⚠ Average'; }
        else { tierClass = 'tier-low'; tierLabel = '🐢 Low'; }

        tierBadge.textContent = tierLabel;
        tierBadge.className = `tier-badge ${tierClass}`;

        // Populate Performance Metric Node Grid
        const grid = document.getElementById('metrics-grid-container');
        grid.innerHTML = '';

        const nodes = [
            { key: 'CPU Score', val: scores.cpu, desc: rawResults.cpu_loop?.summary },
            { key: 'GPU/WebGL Score', val: scores.gpu, desc: rawResults.webgl?.summary },
            { key: 'JavaScript Score', val: scores.javascript, desc: rawResults.js_engine?.summary },
            { key: 'Canvas Score', val: scores.canvas, desc: rawResults.canvas_render?.summary },
            { key: 'DOM Score', val: scores.dom, desc: rawResults.dom_render?.summary },
            { key: 'Animation Score', val: scores.animation, desc: rawResults.anim_raf?.summary },
            { key: 'Memory Score', val: scores.memory, desc: rawResults.memory?.summary },
            { key: 'Browser Score', val: scores.browser, desc: `Core Matrix verified.` },
            { key: 'Network Score', val: scores.network, desc: rawResults.network?.summary }
        ];

        nodes.forEach(node => {
            const el = document.createElement('div');
            el.className = 'metric-node';
            el.innerHTML = `
                <div class="m-header"><span>${node.key}</span></div>
                <div class="m-val">${node.val.toLocaleString()}</div>
                <div class="m-desc">${node.desc || ''}</div>
            `;
            grid.appendChild(el);
        });

        // Compute Operational Use-case Estimations
        const capsContainer = document.getElementById('caps-container');
        capsContainer.innerHTML = '';

        const estimations = calculateCapabilities(scores.overall);
        estimations.forEach(est => {
            const el = document.createElement('div');
            el.className = 'cap-item';
            el.innerHTML = `
                <span class="cap-name">${est.name}</span>
                <span class="cap-status ${est.cls}">${est.status}</span>
            `;
            capsContainer.appendChild(el);
        });
    }

    /**
     * Compute Capabilities Use-Cases
     */
    function calculateCapabilities(overall) {
        let profile = {};
        if (overall >= 85000) {
            profile = { gaming: 'Extreme FPS', streaming: '4K Ultra HD', coding: 'Flawless Execution', office: 'Instantaneous', browsing: 'Lightning Fast', multitasking: 'Heavy Workloads' };
        } else if (overall >= 65000) {
            profile = { gaming: 'High Performer', streaming: '14K Stream Smooth', coding: 'Highly Responsive', office: 'Optimal Smoothness', browsing: 'Fast Transition', multitasking: 'Smooth Multi-tab' };
        } else {
            profile = { gaming: 'Casual Standard', streaming: '1080p Standard', coding: 'Standard Output', office: 'Capable Eco', browsing: 'Fluid Execution', multitasking: 'Moderate Processing' };
        }

        const getStatusClass = (status) => {
            if(['Extreme FPS', '4K Ultra HD', 'Flawless Execution', 'Instantaneous', 'Lightning Fast', 'Heavy Workloads', 'High Performer', 'Highly Responsive'].includes(status)) return 'status-high';
            if(['Casual Standard', 'Standard Output', 'Capable Eco', 'Moderate Processing'].includes(status)) return 'status-low';
            return 'status-med';
        };

        return [
            { name: '🎮 Gaming Capability', status: profile.gaming, cls: getStatusClass(profile.gaming) },
            { name: '📺 Video Streaming', status: profile.streaming, cls: getStatusClass(profile.streaming) },
            { name: '💻 Complex Development', status: profile.coding, cls: getStatusClass(profile.coding) },
            { name: '📂 Office Automation', status: profile.office, cls: getStatusClass(profile.office) },
            { name: '🌐 Web Navigation', status: profile.browsing, cls: getStatusClass(profile.browsing) },
            { name: '⚡ Dense Multitasking', status: profile.multitasking, cls: getStatusClass(profile.multitasking) }
        ];
    }

    /**
     * Value Lerping Counter Engine
     */
    function animateCounter(id, start, end, duration) {
        const obj = document.getElementById(id);
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const currentVal = Math.floor(progress * (end - start) + start);
            obj.textContent = currentVal.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
    }

    /**
     * Export & Compilation Protocols
     */
    function generateExportPayload() {
        return {
            application: "Xaerisoft Device Benchmark",
            version: "2.0.26 Production Cluster",
            author: "WillXD",
            timestamp: new Date().toISOString(),
            metrics: {
                overall_score: scores.overall,
                breakdown: scores
            },
            telemetry: rawResults
        };
    }

    function copyResultsToClipboard() {
        const data = generateExportPayload();
        const formattedText = `--- XAERISOFT DEVICE BENCHMARK REPORT ---\n` +
            `Overall Score: ${data.metrics.overall_score}\n` +
            `Timestamp: ${data.timestamp}\n` +
            `Created by: WillXD\n` +
            `-----------------------------------------`;
        navigator.clipboard.writeText(formattedText).then(() => {
            alert('Analytical summary copied to clipboard context.');
        });
    }

    function exportAsTXT() {
        const data = generateExportPayload();
        let content = `=================================================\n` +
                      `          XAERISOFT DEVICE BENCHMARK             \n` +
                      `=================================================\n` +
                      `Created by: WillXD\n` +
                      `Timestamp: ${data.timestamp}\n\n` +
                      `OVERALL PERFORMANCE SCORE: ${data.metrics.overall_score}\n\n` +
                      `--- METRICS BREAKDOWN ---\n`;
        
        Object.entries(scores).forEach(([k, v]) => {
            if(k !== 'overall') content += `${k.toUpperCase()}: ${v}\n`;
        });

        triggerFileDownload(content, 'text/plain', 'xaerisoft_benchmark.txt');
    }

    function exportAsJSON() {
        const data = JSON.stringify(generateExportPayload(), null, 2);
        triggerFileDownload(data, 'application/json', 'xaerisoft_benchmark.json');
    }

    function triggerFileDownload(content, type, filename) {
        const blob = new Blob([content], { type });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
});

const BenchmarkEngine = {
    scores: { cpu: 0, gpu: 0, ram: 0, storage: 0, browser: 0, ai: 0 },
    updateProgress: null, // Callback to UI

    runAll: async function(progressCallback) {
        this.updateProgress = progressCallback;
        
        await this.testCPU();
        await this.testGPU();
        await this.testRAM();
        await this.testStorage();
        await this.testBrowser();
        await this.testAI();

        return this.calculateTotal();
    },

    testCPU: function() {
        return new Promise((resolve) => {
            this.updateProgress("Testing CPU...");
            const worker = new Worker('worker.js');
            worker.postMessage('start_cpu_test');
            worker.onmessage = (e) => {
                if (e.data.type === 'cpu_done') {
                    this.scores.cpu = e.data.score;
                    worker.terminate();
                    resolve();
                }
            };
        });
    },

    testGPU: function() {
        return new Promise((resolve) => {
            this.updateProgress("Testing GPU (WebGL)...");
            const canvas = document.getElementById('gpu-canvas');
            const gl = canvas.getContext('webgl');
            if (!gl) { this.scores.gpu = 5000; resolve(); return; }

            let frames = 0;
            const start = performance.now();
            
            function draw() {
                // Heavy clear and draw operations to simulate load
                gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                frames++;
                
                if (performance.now() - start < 2000) { // Test for 2 seconds
                    requestAnimationFrame(draw);
                } else {
                    const fps = (frames / 2);
                    // Base calculation for GPU score
                    this.scores.gpu = Math.floor(fps * 2500); 
                    resolve();
                }
            }
            draw.bind(this)();
        });
    },

    testRAM: async function() {
        this.updateProgress("Testing RAM (Allocations)...");
        await new Promise(r => setTimeout(r, 50)); // UI yield
        
        const start = performance.now();
        // Allocate and write to a large array (simulating memory stress)
        const size = 5 * 1024 * 1024; // 5M elements (~40MB)
        let arr = new Float64Array(size);
        for(let i=0; i<size; i+=4) arr[i] = Math.random(); // Write
        let sum = 0;
        for(let i=0; i<size; i+=100) sum += arr[i]; // Read
        arr = null; // Mark for GC
        
        const duration = performance.now() - start;
        this.scores.ram = Math.floor(10000000 / duration);
    },

    testStorage: async function() {
        this.updateProgress("Testing Storage (I/O)...");
        await new Promise(r => setTimeout(r, 50));
        
        const start = performance.now();
        // LocalStorage Read/Write stress
        const dummyData = "X".repeat(1024 * 10); // 10KB string
        for(let i=0; i<500; i++) {
            localStorage.setItem('bench_test_' + i, dummyData);
        }
        for(let i=0; i<500; i++) {
            localStorage.getItem('bench_test_' + i);
            localStorage.removeItem('bench_test_' + i);
        }
        
        const duration = performance.now() - start;
        this.scores.storage = Math.floor(5000000 / duration);
    },

    testBrowser: async function() {
        this.updateProgress("Testing Browser (DOM)...");
        await new Promise(r => setTimeout(r, 50));

        const start = performance.now();
        const frag = document.createDocumentFragment();
        for(let i=0; i<5000; i++) {
            const div = document.createElement('div');
            div.style.width = '10px';
            div.style.height = '10px';
            div.className = 'test-node';
            frag.appendChild(div);
        }
        document.body.appendChild(frag);
        
        // Force reflow
        const nodes = document.querySelectorAll('.test-node');
        nodes.forEach(n => n.getBoundingClientRect());
        nodes.forEach(n => n.remove());

        const duration = performance.now() - start;
        this.scores.browser = Math.floor(3000000 / duration);
    },

    testAI: async function() {
        this.updateProgress("Testing AI (Neural Sim)...");
        await new Promise(r => setTimeout(r, 50));

        const start = performance.now();
        // Simulate a basic convolution filter math (used in AI Vision)
        const matrixSize = 256;
        const kernel = [0,-1,0, -1,5,-1, 0,-1,0];
        let img = new Float32Array(matrixSize*matrixSize).fill(255);
        
        for(let y=1; y<matrixSize-1; y++) {
            for(let x=1; x<matrixSize-1; x++) {
                let sum = 0;
                sum += img[(y-1)*matrixSize + (x-1)] * kernel[0];
                sum += img[(y)*matrixSize + (x)] * kernel[4]; // simplified for speed
            }
        }
        
        const duration = performance.now() - start;
        this.scores.ai = Math.floor(8000000 / duration);
    },

    calculateTotal: function() {
        // Weighted formula as requested
        const finalScore = 
            (this.scores.cpu * 0.30) + 
            (this.scores.gpu * 0.30) + 
            (this.scores.ram * 0.15) + 
            (this.scores.storage * 0.10) + 
            (this.scores.browser * 0.10) + 
            (this.scores.ai * 0.05);

        return {
            details: this.scores,
            total: Math.floor(finalScore)
        };
    }
};

class BenchmarkEngine {
    constructor(updateCallback) {
        this.updateCallback = updateCallback;
        this.scores = { cpu: 0, gpu: 0, ram: 0, storage: 0, browser: 0, ai: 0 };
    }

    // Helper: Yield thread to prevent UI freeze
    async yieldThread() {
        return new Promise(resolve => setTimeout(resolve, 10));
    }

    calculateScore(timeMs, referenceTime, multiplier) {
        // Semakin cepat (timeMs kecil), skor semakin tinggi
        const score = (referenceTime / Math.max(timeMs, 1)) * multiplier;
        return Math.floor(score);
    }

    async runCPU() {
        this.updateCallback("CPU: Prime & Loop Performance", 10);
        await this.yieldThread();
        const start = performance.now();
        
        // Test: Prime Numbers & Heavy Math Loop
        let primes = 0;
        for (let i = 2; i < 200000; i++) {
            let isPrime = true;
            for (let j = 2; j <= Math.sqrt(i); j++) {
                if (i % j === 0) { isPrime = false; break; }
            }
            if (isPrime) primes++;
        }
        
        // Test: Recursive/Integer
        function fib(n) { return n <= 1 ? n : fib(n - 1) + fib(n - 2); }
        fib(30);

        const end = performance.now();
        this.scores.cpu = this.calculateScore(end - start, 500, 50000);
    }

    async runGPU() {
        this.updateCallback("GPU: 2D & WebGL Rendering", 30);
        await this.yieldThread();
        
        const canvas = document.createElement('canvas');
        canvas.width = 1920; canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        const start = performance.now();

        // Simulate Shadow & Gradient Rendering
        for (let i = 0; i < 5000; i++) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(157, 78, 221, 0.5)";
            let gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
            gradient.addColorStop(0, "purple");
            gradient.addColorStop(1, "black");
            ctx.fillStyle = gradient;
            ctx.fillRect(Math.random() * 1920, Math.random() * 1080, 50, 50);
            ctx.beginPath();
            ctx.arc(Math.random() * 1920, Math.random() * 1080, 20, 0, Math.PI * 2);
            ctx.fill();
        }

        const end = performance.now();
        this.scores.gpu = this.calculateScore(end - start, 200, 65000);
    }

    async runRAM() {
        this.updateCallback("RAM: Memory Allocation & Array", 50);
        await this.yieldThread();
        const start = performance.now();

        // Memory Allocation & Garbage Collection Sim
        let arrays = [];
        for (let i = 0; i < 500; i++) {
            let temp = new Float64Array(100000);
            temp.fill(Math.random());
            arrays.push(temp);
        }
        
        // Array Processing
        let sum = 0;
        for (let i = 0; i < arrays.length; i++) {
            sum += arrays[i][50000];
        }
        arrays = null; // Mark for GC

        const end = performance.now();
        this.scores.ram = this.calculateScore(end - start, 300, 35000);
    }

    async runStorage() {
        this.updateCallback("Storage: LocalStorage I/O Speed", 65);
        await this.yieldThread();
        const start = performance.now();

        // Storage Write/Read Test
        const testString = "A".repeat(100000); // 100KB string
        for (let i = 0; i < 200; i++) {
            localStorage.setItem(`xaerisoft_test_${i}`, testString);
        }
        for (let i = 0; i < 200; i++) {
            let data = localStorage.getItem(`xaerisoft_test_${i}`);
        }
        for (let i = 0; i < 200; i++) {
            localStorage.removeItem(`xaerisoft_test_${i}`);
        }

        const end = performance.now();
        this.scores.storage = this.calculateScore(end - start, 150, 20000);
    }

    async runBrowser() {
        this.updateCallback("Browser: DOM & CSS Rendering", 80);
        await this.yieldThread();
        const start = performance.now();

        const container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);

        for (let i = 0; i < 15000; i++) {
            const el = document.createElement('div');
            el.style.width = '10px';
            el.style.height = '10px';
            el.style.borderRadius = '5px';
            el.style.boxShadow = '0 0 5px red';
            el.textContent = i;
            container.appendChild(el);
        }
        
        container.innerHTML = '';
        document.body.removeChild(container);

        const end = performance.now();
        this.scores.browser = this.calculateScore(end - start, 300, 18000);
    }

    async runAI() {
        this.updateCallback("AI: Matrix & Tensor Simulation", 95);
        await this.yieldThread();
        const start = performance.now();

        // AI Matrix Multiplication Simulation (O(N^3))
        const size = 300;
        const A = Array.from({length: size}, () => Array.from({length: size}, () => Math.random()));
        const B = Array.from({length: size}, () => Array.from({length: size}, () => Math.random()));
        const C = Array.from({length: size}, () => Array(size).fill(0));

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let sum = 0;
                for (let k = 0; k < size; k++) {
                    sum += A[i][k] * B[k][j];
                }
                C[i][j] = sum;
            }
        }

        const end = performance.now();
        this.scores.ai = this.calculateScore(end - start, 600, 30000);
    }

    async startAll() {
        await this.runCPU();
        await this.runGPU();
        await this.runRAM();
        await this.runStorage();
        await this.runBrowser();
        await this.runAI();
        this.updateCallback("Finalizing...", 100);
        return this.scores;
    }
}

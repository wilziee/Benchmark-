self.onmessage = function(e) {
    if (e.data === 'start_cpu_test') {
        const start = performance.now();
        
        // 1. Integer & Float Math (Prime & Fibonacci)
        let primes = 0;
        for (let i = 2; i < 100000; i++) {
            let isPrime = true;
            for (let j = 2; j <= Math.sqrt(i); j++) {
                if (i % j === 0) { isPrime = false; break; }
            }
            if (isPrime) primes++;
        }

        // 2. Matrix Multiplication Simulation
        const size = 300;
        let matrix = new Float32Array(size * size);
        for(let i=0; i<size*size; i++) matrix[i] = Math.random();
        for(let i=0; i<size; i++) {
            for(let j=0; j<size; j++) {
                matrix[i * size + j] *= 1.0001; 
            }
        }

        const end = performance.now();
        const duration = end - start;
        
        // Base score calculations: Faster = higher score
        // Constant 50000000 is an arbitrary scale to output reasonable AnTuTu-like numbers
        const score = Math.max(0, Math.floor(50000000 / duration));
        
        self.postMessage({ type: 'cpu_done', score: score });
    }
};

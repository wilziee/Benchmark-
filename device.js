class DeviceDetector {
    static async getInfo() {
        const info = {
            os: "Unknown OS",
            browser: "Unknown Browser",
            cpuCores: navigator.hardwareConcurrency || "Unknown",
            ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB+` : "Hidden by Browser",
            resolution: `${window.screen.width}x${window.screen.height}`,
            battery: "N/A",
            network: "Unknown",
            gpu: "Detecting..."
        };

        // OS Detection
        const ua = navigator.userAgent;
        if (/android/i.test(ua)) info.os = "Android";
        else if (/iPad|iPhone|iPod/.test(ua)) info.os = "iOS";
        else if (/windows/i.test(ua)) info.os = "Windows";
        else if (/mac os/i.test(ua)) info.os = "macOS";
        else if (/linux/i.test(ua)) info.os = "Linux";

        // Browser Detection
        if (ua.includes("Chrome") && !ua.includes("Edg")) info.browser = "Chrome";
        else if (ua.includes("Safari") && !ua.includes("Chrome")) info.browser = "Safari";
        else if (ua.includes("Firefox")) info.browser = "Firefox";
        else if (ua.includes("Edg")) info.browser = "Edge";

        // Battery
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                info.battery = `${Math.round(battery.level * 100)}% (${battery.charging ? 'Charging' : 'Discharging'})`;
            } catch(e) {}
        }

        // Network
        if (navigator.connection) {
            info.network = `${navigator.connection.effectiveType || 'Unknown'} (${navigator.connection.downlink || 0} Mbps)`;
        }

        // GPU Detection via WebGL
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    info.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                } else {
                    info.gpu = gl.getParameter(gl.RENDERER);
                }
            }
        } catch(e) {}

        return info;
    }

    static renderInfo(info, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="info-item"><span>OS</span><strong>${info.os}</strong></div>
            <div class="info-item"><span>Browser</span><strong>${info.browser}</strong></div>
            <div class="info-item"><span>CPU Cores</span><strong>${info.cpuCores} Threads</strong></div>
            <div class="info-item"><span>RAM Est.</span><strong>${info.ram}</strong></div>
            <div class="info-item" style="grid-column: span 2;"><span>GPU</span><strong>${info.gpu}</strong></div>
            <div class="info-item"><span>Resolution</span><strong>${info.resolution}</strong></div>
            <div class="info-item"><span>Battery</span><strong>${info.battery}</strong></div>
        `;
    }
}

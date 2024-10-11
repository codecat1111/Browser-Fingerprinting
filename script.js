// Load the FingerprintJS library
FingerprintJS.load()
  .then((fp) => {
    // Get the visitor's fingerprint details
    fp.get()
      .then((result) => {
        // Extract useful data from the fingerprint result
        const visitorId = result.visitorId;
        const components = result.components;

        // Use safe navigation to check if components are available
        const screenResolution = components.screenResolution
          ? `${components.screenResolution.value[0]} x ${components.screenResolution.value[1]}`
          : "Unknown";
        const os = components.platform ? components.platform.value : "Unknown";
        const browser = components.userAgent ? components.userAgent.value : "Unknown";
        const deviceMemory = components.deviceMemory ? components.deviceMemory.value + " GB" : "Unknown";

        // Collect additional data from native browser APIs
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language || navigator.userLanguage;
        const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 'Yes' : 'No';
        const cpuCores = navigator.hardwareConcurrency || 'Unknown';
        const colorDepth = screen.colorDepth + ' bits';
        const isMobile = /Mobi|Android/i.test(navigator.userAgent) ? 'Yes' : 'No';
        const cookiesEnabled = navigator.cookieEnabled ? 'Yes' : 'No';
        const localStorageSupported = typeof window.localStorage !== 'undefined' ? 'Yes' : 'No';
        const sessionStorageSupported = typeof window.sessionStorage !== 'undefined' ? 'Yes' : 'No';
        const referrer = document.referrer || 'None';
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const connectionType = connection ? connection.effectiveType : 'Unknown';
        const downlink = connection ? connection.downlink + ' Mbps' : 'Unknown';
        
        // Canvas Fingerprinting
        const getCanvasFingerprint = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          ctx.textBaseline = 'top';
          ctx.font = '14px Arial';
          ctx.fillText('Browser fingerprinting!', 2, 2);
          return canvas.toDataURL();
        };
        const canvasFingerprint = getCanvasFingerprint();

        // WebGL Fingerprinting
        const getWebGLFingerprint = () => {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl');
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          const webGLVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          const webGLRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          return { webGLVendor, webGLRenderer };
        };
        const { webGLVendor, webGLRenderer } = getWebGLFingerprint();

        // WebRTC IP Detection
        const getWebRTCIPs = (callback) => {
          const ips = [];
          const pc = new RTCPeerConnection();
          pc.createDataChannel('');
          pc.createOffer().then((offer) => pc.setLocalDescription(offer));
          pc.onicecandidate = (ice) => {
            if (!ice || !ice.candidate || !ice.candidate.candidate) return;
            const ipMatch = ice.candidate.candidate.match(/\d+\.\d+\.\d+\.\d+/);
            if (ipMatch) {
              ips.push(ipMatch[0]);
              callback(ips);
            }
          };
        };

        // Media Devices (Microphone, Camera)
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const mediaDevices = devices.map((device) => device.kind).join(', ');

          // Display details in the browser
          document.getElementById('fingerprint').innerHTML = `
            <div class="info"><strong>Browser Fingerprint (Hash):</strong> ${visitorId}</div>
            <div class="info"><strong>Operating System:</strong> ${os}</div>
            <div class="info"><strong>Browser:</strong> ${browser}</div>
            <div class="info"><strong>Screen Resolution:</strong> ${screenResolution}</div>
            <div class="info"><strong>Device Memory:</strong> ${deviceMemory}</div>
            <div class="info"><strong>Timezone:</strong> ${timezone}</div>
            <div class="info"><strong>Language:</strong> ${language}</div>
            <div class="info"><strong>Touchscreen:</strong> ${hasTouchScreen}</div>
            <div class="info"><strong>CPU Cores:</strong> ${cpuCores}</div>
            <div class="info"><strong>Color Depth:</strong> ${colorDepth}</div>
            <div class="info"><strong>Mobile Device:</strong> ${isMobile}</div>
            <div class="info"><strong>Cookies Enabled:</strong> ${cookiesEnabled}</div>
            <div class="info"><strong>Local Storage Supported:</strong> ${localStorageSupported}</div>
            <div class="info"><strong>Session Storage Supported:</strong> ${sessionStorageSupported}</div>
            <div class="info"><strong>Referrer:</strong> ${referrer}</div>
            <div class="info"><strong>Connection Type:</strong> ${connectionType}</div>
            <div class="info"><strong>Downlink Speed:</strong> ${downlink}</div>
            <div class="info"><strong>Canvas Fingerprint:</strong> ${canvasFingerprint}</div>
            <div class="info"><strong>WebGL Vendor:</strong> ${webGLVendor}</div>
            <div class="info"><strong>WebGL Renderer:</strong> ${webGLRenderer}</div>
            <div class="info"><strong>Media Devices:</strong> ${mediaDevices}</div>
          `;

          // Log full fingerprint details in the console
          console.log("Full fingerprint data:", {
            visitorId,
            os,
            browser,
            screenResolution,
            deviceMemory,
            timezone,
            language,
            hasTouchScreen,
            cpuCores,
            colorDepth,
            isMobile,
            cookiesEnabled,
            localStorageSupported,
            sessionStorageSupported,
            referrer,
            connectionType,
            downlink,
            canvasFingerprint,
            webGLVendor,
            webGLRenderer,
            mediaDevices
          });

          // Retrieve WebRTC IPs
          getWebRTCIPs((ips) => {
            console.log("WebRTC IPs:", ips);
          });
        });
      })
      .catch((error) => {
        console.error('Error getting fingerprint:', error);
      });
  })
  .catch((error) => {
    console.error('Error loading FingerprintJS:', error);
  });

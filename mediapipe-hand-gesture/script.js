import { GestureRecognizer, FilesetResolver, DrawingUtils } from 'https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0';

class HandGestureDemo {
    constructor() {
        this.gestureRecognizer = null;
        this.runningMode = "IMAGE";
        this.webcamRunning = false;
        this.lastVideoTime = -1;
        
        // DOM elements
        this.video = document.getElementById("webcam");
        this.canvasElement = document.getElementById("output_canvas");
        this.canvasCtx = this.canvasElement.getContext("2d");
        this.enableWebcamButton = document.getElementById("enable-cam");
        this.gestureResults = document.getElementById("gesture-results");
        this.statusElement = document.getElementById("status");
        this.loadingElement = document.getElementById("loading");
        
        this.init();
    }
    
    async init() {
        try {
            this.updateStatus("Loading MediaPipe...");
            await this.createGestureRecognizer();
            this.setupEventListeners();
            this.updateStatus("Ready! Click 'Enable Camera' to start.");
            this.enableWebcamButton.disabled = false;
            this.hideLoading();
        } catch (error) {
            console.error("Failed to initialize:", error);
            this.updateStatus("Failed to load MediaPipe. Please refresh the page.");
        }
    }
    
    async createGestureRecognizer() {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        
        this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
                delegate: "GPU"
            },
            runningMode: this.runningMode
        });
    }
    
    setupEventListeners() {
        this.enableWebcamButton.addEventListener("click", () => {
            if (this.webcamRunning) {
                this.disableWebcam();
            } else {
                this.enableWebcam();
            }
        });
    }
    
    async enableWebcam() {
        if (!this.gestureRecognizer) {
            this.updateStatus("Gesture recognizer not loaded yet.");
            return;
        }
        
        this.webcamRunning = true;
        this.enableWebcamButton.innerText = "Disable Camera";
        this.updateStatus("Starting camera...");
        
        // getUsermedia parameters
        const constraints = { video: true };
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = stream;
            this.video.addEventListener("loadeddata", () => {
                this.updateStatus("Camera active - detecting gestures...");
                this.predictWebcam();
            });
        } catch (error) {
            console.error("Error accessing webcam:", error);
            this.updateStatus("Error accessing camera. Please check permissions.");
            this.webcamRunning = false;
            this.enableWebcamButton.innerText = "Enable Camera";
        }
    }
    
    disableWebcam() {
        this.webcamRunning = false;
        this.enableWebcamButton.innerText = "Enable Camera";
        this.updateStatus("Camera disabled");
        
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video.srcObject = null;
        }
        
        this.clearResults();
    }
    
    async predictWebcam() {
        if (!this.webcamRunning) return;
        
        // Get video display dimensions
        const videoRect = this.video.getBoundingClientRect();
        
        // Set canvas size to match video display size
        this.canvasElement.style.width = videoRect.width + "px";
        this.canvasElement.style.height = videoRect.height + "px";
        this.canvasElement.width = videoRect.width;
        this.canvasElement.height = videoRect.height;
        
        // Switch running mode if needed
        if (this.runningMode === "IMAGE") {
            this.runningMode = "VIDEO";
            await this.gestureRecognizer.setOptions({ runningMode: "VIDEO" });
        }
        
        const nowInMs = Date.now();
        if (this.video.currentTime !== this.lastVideoTime) {
            this.lastVideoTime = this.video.currentTime;
            
            try {
                const results = this.gestureRecognizer.recognizeForVideo(this.video, nowInMs);
                this.displayResults(results);
            } catch (error) {
                console.error("Recognition error:", error);
            }
        }
        
        // Schedule next prediction
        if (this.webcamRunning) {
            window.requestAnimationFrame(() => this.predictWebcam());
        }
    }
    
    displayResults(results) {
        // Clear previous drawings
        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        
        // Display gesture results
        if (results.gestures && results.gestures.length > 0) {
            this.showGestureResults(results.gestures);
            
            // Draw hand landmarks if available
            if (results.landmarks) {
                this.drawLandmarks(results.landmarks);
            }
        } else {
            this.clearResults();
        }
        
        this.canvasCtx.restore();
    }
    
    showGestureResults(gestures) {
        let resultsHtml = '';
        
        gestures.forEach((gestureSet, handIndex) => {
            if (gestureSet && gestureSet.length > 0) {
                const topGesture = gestureSet[0];
                const confidence = Math.round(topGesture.score * 100);
                
                if (confidence > 50) { // Only show gestures with >50% confidence
                    console.log(`Hand ${handIndex + 1}: ${topGesture.categoryName} (${confidence}%)`);
                    resultsHtml += `
                        <div>
                            <span class="gesture-name">${this.getGestureEmoji(topGesture.categoryName)} ${topGesture.categoryName}</span>
                            <span class="gesture-confidence">${confidence}%</span>
                        </div>
                    `;
                }
            }
        });
        
        if (resultsHtml) {
            this.gestureResults.innerHTML = resultsHtml;
        } else {
            this.clearResults();
        }
    }
    
    drawLandmarks(landmarks) {
        const drawingUtils = new DrawingUtils(this.canvasCtx);
        
        // Get scaling factors
        const videoRect = this.video.getBoundingClientRect();
        const scaleX = this.canvasElement.width / videoRect.width;
        const scaleY = this.canvasElement.height / videoRect.height;

        landmarks.forEach((handLandmarks) => {
            // Scale landmarks to match canvas size
            const scaledLandmarks = handLandmarks.map(landmark => ({
                x: landmark.x * scaleX,
                y: landmark.y * scaleY,
                z: 0
            }));
            
            // Draw connections
            drawingUtils.drawConnectors(
                scaledLandmarks,
                GestureRecognizer.HAND_CONNECTIONS,
                { color: "#00FF00", lineWidth: 3 }
            );
            
            // Draw landmarks
            drawingUtils.drawLandmarks(
                scaledLandmarks,
                { color: "#FF0000", lineWidth: 2, radius: 3 }
            );
        });
    }
    
    getGestureEmoji(gestureName) {
        const emojiMap = {
            'Thumb_Up': '👍',
            'Thumb_Down': '👎',
            'Victory': '✌️',
            'Open_Palm': '👋',
            'Closed_Fist': '✊',
            'ILoveYou': '🤟',
            'Pointing_Up': '👉'
        };
        return emojiMap[gestureName] || '✋';
    }
    
    clearResults() {
        this.gestureResults.innerHTML = '<p class="no-results">No gestures detected</p>';
    }
    
    updateStatus(message) {
        this.statusElement.textContent = message;
    }
    
    hideLoading() {
        this.loadingElement.style.display = 'none';
    }
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HandGestureDemo();
});
/**
 * =============================================================================
 * TRANSFORMERS.JS SENTIMENT ANALYSIS DEMO
 * =============================================================================
 *
 * This demo showcases how to run AI/ML models directly in the browser using
 * Hugging Face's Transformers.js library. No server required!
 *
 * KEY CONCEPTS DEMONSTRATED:
 * 1. Loading pre-trained ML models in the browser
 * 2. Running inference (predictions) client-side
 * 3. Using the pipeline API for easy model usage
 * 4. Handling async model loading with progress feedback
 *
 * MODEL USED: Xenova/distilbert-base-uncased-finetuned-sst-2-english
 * - A lightweight BERT model fine-tuned for sentiment analysis
 * - Classifies text as POSITIVE or NEGATIVE with confidence score
 * - ~67MB model size, cached after first download
 *
 * HOW IT WORKS:
 * Step 1: Import the transformers.js library from CDN
 * Step 2: Create a sentiment-analysis pipeline (loads the model)
 * Step 3: Pass text to the pipeline for classification
 * Step 4: Display the sentiment result with confidence percentage
 */

// =============================================================================
// STEP 1: IMPORT TRANSFORMERS.JS LIBRARY
// =============================================================================
// We import directly from the CDN for simplicity. In production, you might
// bundle this with your build tool (webpack, vite, etc.)
// The 'pipeline' function is the main entry point for using pre-trained models.

import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/transformers.min.js';

// =============================================================================
// GLOBAL STATE
// =============================================================================
// We store the pipeline instance globally so we can reuse it for multiple
// analyses without reloading the model each time.

let sentimentPipeline = null;  // Will hold our initialized sentiment analysis pipeline

// =============================================================================
// DOM ELEMENT REFERENCES
// =============================================================================
// Cache DOM elements for better performance and cleaner code

const elements = {
    status: () => document.getElementById('status'),
    analyzeBtn: () => document.getElementById('analyze-btn'),
    textInput: () => document.getElementById('text-input'),
    results: () => document.getElementById('results'),
    steps: () => document.getElementById('steps-container')
};

// =============================================================================
// STEP TRACKING FOR DEMO VISUALIZATION
// =============================================================================
// These functions update the visual step indicators to show what's happening
// at each stage of the process.

/**
 * Updates a step's visual state in the demo UI
 * @param {number} stepNumber - Which step to update (1-4)
 * @param {string} state - 'pending' | 'active' | 'completed' | 'error'
 * @param {string} [detail] - Optional detail text to show
 */
function updateStep(stepNumber, state, detail = '') {
    const stepEl = document.getElementById(`step-${stepNumber}`);
    if (!stepEl) return;

    // Remove all state classes
    stepEl.classList.remove('pending', 'active', 'completed', 'error');
    // Add the new state class
    stepEl.classList.add(state);

    // Update detail text if provided
    const detailEl = stepEl.querySelector('.step-detail');
    if (detailEl && detail) {
        detailEl.textContent = detail;
    }
}

/**
 * Resets all steps to pending state
 */
function resetSteps() {
    for (let i = 1; i <= 4; i++) {
        updateStep(i, 'pending', '');
    }
}

/**
 * Adds a log entry to show what's happening in real-time
 * @param {string} message - The message to log
 * @param {string} type - 'info' | 'success' | 'error' | 'code'
 */
function addLog(message, type = 'info') {
    const logContainer = document.getElementById('log-container');
    if (!logContainer) return;

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;

    const timestamp = new Date().toLocaleTimeString();
    logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> ${message}`;

    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

/**
 * Clears all log entries
 */
function clearLogs() {
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
        logContainer.innerHTML = '';
    }
}

// =============================================================================
// STEP 2: MODEL INITIALIZATION
// =============================================================================
// This function loads the sentiment analysis model. This is the "heavy"
// operation that downloads and initializes the neural network.

/**
 * Initializes the sentiment analysis pipeline
 *
 * WHAT HAPPENS UNDER THE HOOD:
 * 1. Transformers.js checks if the model is cached in IndexedDB
 * 2. If not cached, downloads model files from Hugging Face Hub (~67MB)
 * 3. Initializes the model using WebAssembly (WASM) or WebGPU
 * 4. Returns a callable pipeline function for inference
 *
 * The pipeline abstracts away all the complexity of:
 * - Tokenization (converting text to numbers the model understands)
 * - Running the neural network forward pass
 * - Post-processing the output into human-readable format
 */
async function initModel() {
    try {
        // Update UI to show we're starting
        elements.status().textContent = 'Loading model...';
        elements.status().className = 'status-loading';

        clearLogs();
        addLog('Starting model initialization...', 'info');

        // STEP 1: Library loaded (already done via import)
        updateStep(1, 'completed', 'Transformers.js v3.8.1 loaded');
        addLog('Transformers.js library imported from CDN', 'success');

        // STEP 2: Loading the model
        updateStep(2, 'active', 'Downloading model from Hugging Face...');
        addLog('Creating sentiment-analysis pipeline...', 'info');
        addLog('<code>await pipeline("sentiment-analysis")</code>', 'code');

        // --------------------------------------------------------------------
        // THE MAIN MAGIC: Create a sentiment analysis pipeline
        // --------------------------------------------------------------------
        // This single line does all the heavy lifting:
        // - Downloads the model if not cached
        // - Loads it into memory
        // - Prepares it for inference
        //
        // Default model: Xenova/distilbert-base-uncased-finetuned-sst-2-english
        // You can specify a different model: pipeline('sentiment-analysis', 'model-name')

        const startTime = performance.now();

        sentimentPipeline = await pipeline('sentiment-analysis');

        const loadTime = ((performance.now() - startTime) / 1000).toFixed(2);
        // --------------------------------------------------------------------

        updateStep(2, 'completed', `Model loaded in ${loadTime}s`);
        addLog(`Model loaded successfully in ${loadTime} seconds`, 'success');
        addLog('Model: Xenova/distilbert-base-uncased-finetuned-sst-2-english', 'info');

        // Update status to ready
        elements.status().textContent = 'Ready!';
        elements.status().className = 'status-ready';
        elements.analyzeBtn().disabled = false;

        addLog('Pipeline ready for inference!', 'success');

        // Run a demo analysis to show it working
        addLog('Running demo analysis...', 'info');
        await analyzeSentiment('I love learning about AI in JavaScript!');

    } catch (error) {
        // Handle any errors during initialization
        console.error('Model initialization error:', error);
        elements.status().textContent = 'Error loading model';
        elements.status().className = 'status-error';
        updateStep(2, 'error', error.message);
        addLog(`Error: ${error.message}`, 'error');
    }
}

// =============================================================================
// STEP 3: SENTIMENT ANALYSIS (INFERENCE)
// =============================================================================
// This function takes user input and runs it through the model.

/**
 * Analyzes the sentiment of the given text
 *
 * @param {string|null} text - Text to analyze, or null to use input field
 *
 * WHAT HAPPENS DURING INFERENCE:
 * 1. Text is tokenized (split into subword tokens)
 * 2. Tokens are converted to numerical IDs
 * 3. IDs are padded/truncated to fixed length
 * 4. Neural network processes the input
 * 5. Output logits are converted to probabilities
 * 6. Final label and score are returned
 */
async function analyzeSentiment(text = null) {
    // Guard: Make sure model is loaded
    if (!sentimentPipeline) {
        addLog('Model not ready yet!', 'error');
        return;
    }

    // Get text from input or use provided text
    const inputText = text || elements.textInput().value;

    // Guard: Don't analyze empty text
    if (!inputText.trim()) {
        addLog('Please enter some text to analyze', 'error');
        return;
    }

    try {
        // STEP 3: Running inference
        updateStep(3, 'active', 'Processing text...');
        addLog(`Analyzing: "${inputText.substring(0, 50)}${inputText.length > 50 ? '...' : ''}"`, 'info');

        // Show loading state in results
        elements.results().innerHTML = `
            <div class="analyzing">
                <div class="spinner"></div>
                <span>Running inference...</span>
            </div>
        `;

        // --------------------------------------------------------------------
        // RUN THE MODEL INFERENCE
        // --------------------------------------------------------------------
        // Simply call the pipeline with your text!
        // Returns an array of results (one per input if you pass multiple texts)
        // Each result has: { label: 'POSITIVE'|'NEGATIVE', score: 0.0-1.0 }

        addLog('<code>const result = await pipeline(text)</code>', 'code');

        const startTime = performance.now();

        const result = await sentimentPipeline(inputText);

        const inferenceTime = (performance.now() - startTime).toFixed(0);
        // --------------------------------------------------------------------

        updateStep(3, 'completed', `Inference completed in ${inferenceTime}ms`);
        addLog(`Inference completed in ${inferenceTime}ms`, 'success');

        // Log the raw result for educational purposes
        addLog(`Raw result: ${JSON.stringify(result[0])}`, 'info');

        // STEP 4: Display results
        updateStep(4, 'active', 'Rendering results...');
        displayResult(inputText, result[0]);
        updateStep(4, 'completed', 'Done!');

    } catch (error) {
        console.error('Analysis error:', error);
        updateStep(3, 'error', error.message);
        addLog(`Error during analysis: ${error.message}`, 'error');
        elements.results().innerHTML = `
            <div class="error-result">
                <span class="error-icon">Error analyzing text</span>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// =============================================================================
// STEP 4: DISPLAY RESULTS
// =============================================================================
// Format and display the analysis results in a user-friendly way.

/**
 * Displays the sentiment analysis result with visual formatting
 *
 * @param {string} text - The original text that was analyzed
 * @param {Object} result - The result object from the pipeline
 * @param {string} result.label - 'POSITIVE' or 'NEGATIVE'
 * @param {number} result.score - Confidence score from 0 to 1
 */
function displayResult(text, result) {
    // Convert score to percentage for display
    const confidence = Math.round(result.score * 100);

    // Choose emoji and colors based on sentiment
    const isPositive = result.label === 'POSITIVE';
    const emoji = isPositive ? '&#128512;' : '&#128577;';  // Smiling or frowning face
    const colorClass = isPositive ? 'positive' : 'negative';

    // Build the result HTML with visual indicators
    elements.results().innerHTML = `
        <div class="result-card ${colorClass}">
            <div class="result-header">
                <span class="result-emoji">${emoji}</span>
                <span class="result-label">${result.label}</span>
            </div>

            <div class="result-text">
                <strong>Text analyzed:</strong>
                <p>"${escapeHtml(text)}"</p>
            </div>

            <div class="confidence-section">
                <div class="confidence-label">
                    <span>Confidence</span>
                    <span class="confidence-value">${confidence}%</span>
                </div>
                <div class="confidence-bar">
                    <div class="confidence-fill ${colorClass}" style="width: ${confidence}%"></div>
                </div>
            </div>

            <div class="result-explanation">
                <strong>What this means:</strong>
                <p>The model is <strong>${confidence}%</strong> confident that this text expresses a
                <strong>${isPositive ? 'positive' : 'negative'}</strong> sentiment.</p>
            </div>
        </div>
    `;

    addLog(`Result: ${result.label} with ${confidence}% confidence`, 'success');
}

/**
 * Escapes HTML characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for innerHTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================
// Set up user interaction handlers

// Initialize model when page loads
window.addEventListener('load', () => {
    addLog('Page loaded, starting initialization...', 'info');
    initModel();
});

// Set up button click and keyboard handlers
document.addEventListener('DOMContentLoaded', () => {
    // Analyze button click handler
    elements.analyzeBtn().addEventListener('click', () => {
        resetSteps();
        updateStep(1, 'completed', 'Library already loaded');
        updateStep(2, 'completed', 'Model already cached');
        analyzeSentiment();
    });

    // Enter key handler for quick analysis
    elements.textInput().addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();  // Prevent newline in textarea
            resetSteps();
            updateStep(1, 'completed', 'Library already loaded');
            updateStep(2, 'completed', 'Model already cached');
            analyzeSentiment();
        }
    });
});

// =============================================================================
// EXAMPLE TEXTS FOR DEMO
// =============================================================================
// Pre-defined examples to quickly demonstrate the model

const exampleTexts = [
    "I absolutely love this product! It exceeded all my expectations.",
    "This is the worst experience I've ever had. Totally disappointed.",
    "The weather is nice today, I might go for a walk.",
    "I can't believe how terrible the customer service was!",
    "Amazing work! The team did an outstanding job on this project.",
    "I'm feeling really frustrated with these constant bugs and crashes."
];

/**
 * Loads a random example text into the input field
 */
window.loadExample = function() {
    const randomIndex = Math.floor(Math.random() * exampleTexts.length);
    elements.textInput().value = exampleTexts[randomIndex];
    addLog('Loaded example text', 'info');
};

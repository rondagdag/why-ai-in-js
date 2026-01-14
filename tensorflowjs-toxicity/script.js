// Global variables
let toxicityModel = null;
const threshold = 0.5;
let isRealTimeMode = false;
let debounceTimer = null;

// Toxicity labels from the model
const toxicityLabels = [
    'identity_attack',
    'insult',
    'obscene',
    'severe_toxicity',
    'sexual_explicit',
    'threat',
    'toxicity'
];

// Initialize the model when page loads
async function initModel() {
    try {
        updateModelStatus('Loading model...', 'loading');

        // Load the toxicity model
        toxicityModel = await toxicity.load(threshold);

        updateModelStatus('Model Ready', 'ready');
        enableInterface();

        // Check for URL parameters for auto-analysis
        const urlParams = new URLSearchParams(window.location.search);
        const textParam = urlParams.get('text');
        if (textParam) {
            document.getElementById('text-input').value = textParam;
            analyzeText(textParam);
        }

    } catch (error) {
        console.error('Error loading model:', error);
        updateModelStatus('Error loading model', 'error');
        showError('Failed to load the toxicity detection model. Please refresh and try again.');
    }
}

// Update model status display
function updateModelStatus(status, statusClass) {
    const statusElement = document.getElementById('model-status');
    const dotElement = document.getElementById('status-dot');

    statusElement.textContent = status;
    statusElement.className = statusClass || '';

    // Update dot color based on status
    if (statusClass === 'loading') dotElement.style.backgroundColor = '#ffc107'; // yellow
    else if (statusClass === 'ready') dotElement.style.backgroundColor = '#28a745'; // green
    else if (statusClass === 'error') dotElement.style.backgroundColor = '#dc3545'; // red
    else dotElement.style.backgroundColor = '#6c757d'; // grey
}

// Enable the interface when model is ready
function enableInterface() {
    document.getElementById('text-input').disabled = false;
    document.getElementById('analyze-btn').disabled = false;

    // Enable chips
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => chip.disabled = false);
}

// Debounce function fo real-time analysis
function debounce(func, wait) {
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(debounceTimer);
            func(...args);
        };
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(later, wait);
    };
}

// Analyze text for toxicity
async function analyzeText(text = null) {
    if (!toxicityModel) {
        showError('Model not loaded yet. Please wait...');
        return;
    }

    // Get text from input or use provided text
    const inputElement = document.getElementById('text-input');
    const inputText = text !== null ? text : inputElement.value;

    // Update input value if text was provided programmatically
    if (text !== null && inputElement.value !== text) {
        inputElement.value = text;
    }

    if (!inputText.trim()) {
        resetResults();
        return;
    }

    try {
        // Show loading state
        setLoadingState(true);
        if (!isRealTimeMode) {
            showLoadingMessage();
        }

        // Run toxicity analysis
        const predictions = await toxicityModel.classify([inputText]);

        // Display results
        displayResults(inputText, predictions);

    } catch (error) {
        console.error('Error analyzing text:', error);
        showError('Error analyzing text. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

function resetResults() {
    document.getElementById('results-container').innerHTML = `
        <div class="result-placeholder">
            <div class="placeholder-icon">👋</div>
            <p>Select an example above or type your own text to see the analysis.</p>
        </div>
    `;
}

// Set loading state for the analyze button
function setLoadingState(isLoading) {
    const btn = document.getElementById('analyze-btn');
    const btnText = document.getElementById('btn-text');
    const spinner = document.getElementById('btn-spinner');

    if (!isRealTimeMode) {
        btn.disabled = isLoading;
        btnText.textContent = isLoading ? 'Analyzing...' : 'Analyze Text';
        spinner.style.display = isLoading ? 'block' : 'none';
    } else {
        // In real-time mode, we might want a subtle indicator, but not disable the button
        // For now, keep button enabled
        if (isLoading) {
            spinner.style.display = 'block';
            btnText.textContent = 'Analyzing...';
        } else {
            spinner.style.display = 'none';
            btnText.textContent = 'Analyze Text';
        }
    }
}

// Show loading message in results
function showLoadingMessage() {
    document.getElementById('results-container').innerHTML = `
        <div class="loading-message">
            <div class="spinner"></div>
            <span>Analyzing text for toxicity...</span>
        </div>
    `;
}

// Show error message
function showError(message) {
    document.getElementById('results-container').innerHTML = `
        <div class="error-message">
            ❌ ${message}
        </div>
    `;
}

// Display the toxicity analysis results
function displayResults(text, predictions) {
    const resultsContainer = document.getElementById('results-container');
    const timestamp = new Date().toLocaleTimeString();

    // Calculate overall toxicity status
    const overallToxic = predictions.some(pred => pred.results[0]?.match === true);
    const toxicCount = predictions.filter(pred => pred.results[0]?.match === true).length;

    let resultsHTML = `
        <div class="result-item">            
            <div class="overall-result ${overallToxic ? 'toxic' : 'safe'}">
                <div class="overall-label">
                    <span class="icon">${overallToxic ? '⚠️' : '✅'}</span>
                    <span class="label">${overallToxic ? 'TOXIC CONTENT DETECTED' : 'CONTENT APPEARS SAFE'}</span>
                </div>
                <div class="toxic-count">${toxicCount} of ${predictions.length} categories flagged</div>
            </div>
            
            <div class="toxicity-results">
    `;

    // Display results for each toxicity category
    predictions.forEach(prediction => {
        const result = prediction.results[0];
        const isToxic = result?.match === true;
        const confidence = result ? Math.round(result.probabilities[1] * 100) : 0;
        const categoryName = prediction.label.replace(/_/g, ' ').toUpperCase();

        resultsHTML += `
            <div class="toxicity-result ${isToxic ? 'toxic' : 'safe'}">
                <div class="toxicity-label">
                    <span class="label">${categoryName}</span>
                    <span class="status ${isToxic ? 'toxic' : 'safe'}">
                        ${isToxic ? '⚠️ DETECTED' : '✅ SAFE'}
                    </span>
                </div>
                <div class="confidence-info">
                    <span class="confidence">${confidence}%</span>
                    <div class="confidence-bar">
                        <div class="confidence-fill ${isToxic ? 'toxic' : 'safe'}" 
                             style="width: ${confidence}%"></div>
                    </div>
                </div>
            </div>
        `;
    });

    resultsHTML += `
            </div>
            <div class="timestamp">Analyzed at ${timestamp}</div>
        </div>
    `;

    resultsContainer.innerHTML = resultsHTML;
}

// Initialize when page loads
window.addEventListener('load', initModel);

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const realtimeToggle = document.getElementById('realtime-toggle');

    // Analyze button click
    analyzeBtn.addEventListener('click', () => analyzeText());

    // Preset chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            const text = e.target.getAttribute('data-text');
            analyzeText(text);
        });
    });

    // Real-time toggle
    realtimeToggle.addEventListener('change', (e) => {
        isRealTimeMode = e.target.checked;
        if (isRealTimeMode && textInput.value.trim()) {
            analyzeText();
        }
    });

    // Debounced input handler for real-time mode
    const debouncedAnalyze = debounce(() => analyzeText(), 500);

    // Text input typing
    textInput.addEventListener('input', (e) => {
        if (isRealTimeMode) {
            debouncedAnalyze();
        }
    });

    // Enter key to analyze (Ctrl/Cmd + Enter for multiline) - still works in manual mode
    textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            analyzeText();
        }
    });

    // Update threshold display
    document.getElementById('threshold').textContent = threshold;
});
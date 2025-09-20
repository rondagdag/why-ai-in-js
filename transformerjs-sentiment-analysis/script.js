import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@latest/dist/transformers.min.js';

class SentimentAnalyzer {
    constructor() {
        this.pipe = null;
        this.isLoading = false;
        this.init();
    }

    async init() {
        try {
            this.updateStatus('Loading model...');
            this.isLoading = true;
            
            // Allocate a pipeline for sentiment-analysis
            this.pipe = await pipeline('sentiment-analysis');
            
            this.updateStatus('Model loaded successfully!');
            this.isLoading = false;
            this.enableAnalysis();
            
            // Auto-analyze placeholder text
            this.analyzeText('I love transformers!');
            
        } catch (error) {
            console.error('Error loading model:', error);
            this.updateStatus('Error loading model');
            this.isLoading = false;
        }
    }

    async analyzeText(text) {
        if (!this.pipe || !text.trim()) {
            return;
        }

        try {
            this.showLoading();
            
            // Run sentiment analysis
            const out = await this.pipe(text);
            
            this.displayResults(out, text);
            
        } catch (error) {
            console.error('Error analyzing text:', error);
            this.displayError('Error analyzing text');
        }
    }

    displayResults(results, text) {
        const container = document.getElementById('results-container');
        
        container.innerHTML = `
            <div class="result-item">
                <div class="analyzed-text">
                    <strong>Analyzed Text:</strong> "${text}"
                </div>
                <div class="sentiment-results">
                    ${results.map(result => `
                        <div class="sentiment-result ${result.label.toLowerCase()}">
                            <div class="sentiment-label">
                                <span class="label">${result.label}</span>
                                <span class="confidence">${(result.score * 100).toFixed(2)}%</span>
                            </div>
                            <div class="confidence-bar">
                                <div class="confidence-fill" style="width: ${result.score * 100}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="timestamp">
                    Analyzed at ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;
    }

    displayError(message) {
        const container = document.getElementById('results-container');
        container.innerHTML = `
            <div class="error-message">
                ❌ ${message}
            </div>
        `;
    }

    showLoading() {
        const container = document.getElementById('results-container');
        container.innerHTML = `
            <div class="loading-message">
                <div class="spinner"></div>
                Analyzing sentiment...
            </div>
        `;
    }

    updateStatus(status) {
        document.getElementById('model-status').textContent = status;
    }

    enableAnalysis() {
        const button = document.getElementById('analyze-btn');
        const buttonText = document.getElementById('btn-text');
        const spinner = document.getElementById('btn-spinner');
        
        button.disabled = false;
        buttonText.textContent = 'Analyze Sentiment';
        spinner.style.display = 'none';
    }
}

// Initialize the sentiment analyzer
const analyzer = new SentimentAnalyzer();

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const analyzeBtn = document.getElementById('analyze-btn');

    // Analyze button click
    analyzeBtn.addEventListener('click', () => {
        const text = textInput.value;
        analyzer.analyzeText(text);
    });

    // Real-time analysis on input (with debounce)
    let debounceTimer;
    textInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (e.target.value.trim() && !analyzer.isLoading) {
                analyzer.analyzeText(e.target.value);
            }
        }, 500);
    });

    // Enter key to analyze
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            analyzer.analyzeText(textInput.value);
        }
    });
});
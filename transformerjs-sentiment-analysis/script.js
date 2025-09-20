import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@latest/dist/transformers.min.js';

// Global variables
let sentimentPipeline = null;

// Initialize the model when page loads
async function initModel() {
    try {
        document.getElementById('status').textContent = 'Loading model...';
        
        // Load the sentiment analysis pipeline
        sentimentPipeline = await pipeline('sentiment-analysis');
        
        document.getElementById('status').textContent = 'Ready!';
        document.getElementById('analyze-btn').disabled = false;
        
        // Demo with example text
        analyzeSentiment('I love this demo!');
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('status').textContent = 'Error loading model';
    }
}

// Analyze sentiment of input text
async function analyzeSentiment(text = null) {
    if (!sentimentPipeline) return;
    
    // Get text from input or use provided text
    const inputText = text || document.getElementById('text-input').value;
    if (!inputText.trim()) return;
    
    try {
        // Show loading
        document.getElementById('results').innerHTML = '🔄 Analyzing...';
        
        // Run sentiment analysis
        const result = await sentimentPipeline(inputText);
        
        // Display results
        displayResult(inputText, result[0]);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = '❌ Error analyzing text';
    }
}

// Display the sentiment analysis result
function displayResult(text, result) {
    const confidence = Math.round(result.score * 100);
    const emoji = result.label === 'POSITIVE' ? '😊' : '😞';
    
    document.getElementById('results').innerHTML = `
        <div style="padding: 20px; background: #f5f5f5; border-radius: 8px; margin-top: 20px;">
            <div><strong>Text:</strong> "${text}"</div>
            <div style="margin-top: 10px; font-size: 18px;">
                ${emoji} <strong>${result.label}</strong> (${confidence}% confidence)
            </div>
        </div>
    `;
}

// Initialize when page loads
window.addEventListener('load', initModel);

// Analyze button click
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('analyze-btn').addEventListener('click', () => analyzeSentiment());
    
    // Enter key to analyze
    document.getElementById('text-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            analyzeSentiment();
        }
    });
});
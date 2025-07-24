# Why AI in JS

A collection of demos showcasing various client-side AI capabilities and APIs.

## Running Locally

1. Enable Chrome Flags (Required for WebGPU demos):
   - Open Chrome and navigate to `chrome://flags/`
   - Enable the following flags:
     - `#enable-webgpu-developer-features`
     - `#enable-unsafe-webgpu`
   - Restart Chrome for the changes to take effect

2. Make sure you have [Node.js](https://nodejs.org/) installed

3. Download the Gemma 2B model:
   - Visit [Kaggle Models - Gemma 2B](https://www.kaggle.com/models/google/gemma-2/tfLite/gemma2-2b-it-gpu-int8)
   - Download the `gemma2-2b-it-gpu-int8.bin` file
   - Place it in the `models` folder of this project

4. Open a terminal in this directory

5. Run the following command to start a local server:
   ```bash
   npx http-server
   ```

6. Open your browser and navigate to `http://localhost:8080`
7. You should see the landing page with links to all available demos

## Special Setup for Agentic RAG Sample

The Agentic RAG Sample requires additional setup as it's a Node.js application:

1. **Install Ollama** from [https://ollama.com/](https://ollama.com/)
2. **Pull the Mistral model**:
   ```bash
   ollama pull mistral:latest
   ```
3. **Navigate to the agentic-rag-sample directory**:
   ```bash
   cd agentic-rag-sample
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Run the application**:
   ```bash
   npm run dev
   ```

For detailed instructions, see the README.md file in the `agentic-rag-sample` directory.

## Available Demos

| Demo Name | Description |
|-----------|-------------|
| TensorFlow.js Toxicity | Demonstrates real-time text toxicity detection using TensorFlow.js models in the browser |
| Quick Start ONNX Runtime Web | A minimalist demo showing how to run ONNX models directly in the browser using both ESM and traditional script tag approaches |
| MediaPipe LLM Demo | Demonstrates interactive machine learning using MediaPipe combined with Gemma 2B model for efficient client-side inference |
| WebLLM Simple Chat | A lightweight chat interface demonstrating how to integrate and use large language models directly in the browser |
| Video Object Detection | Live object detection and tracking in video streams using browser-based ML models |
| Phi 3.5 WebGPU Demo | Leverages WebGPU technology to run the Phi-3.5 language model directly in the browser for enhanced AI computations |
| Prompt API Playground | An interactive environment to experiment with various prompt APIs and test different AI query patterns in real-time |
| Right Click for Superpowers | Enhances the browser's context menu with AI-powered capabilities for smarter interactions |
| Summarization API Playground | Interactive testing environment for text summarization algorithms with real-time API integration |
| Translation & Language Detection API Playground | A comprehensive testing ground for translation and language detection capabilities using client-side APIs |
| Explain in Generations | A browser extension that breaks down complex topics into different levels of understanding, helping users grasp concepts progressively |
| Next.js Client Demo | A client-side demo powered by Next.js showcasing dynamic user interactions and server-side rendering features |
| Techstack Time Machine | A tool that visualizes and analyzes the evolution of technology stacks over time |
| Video Background Removal | Real-time video background removal using ML models running entirely in the browser |
| Agentic RAG Sample | A Node.js application demonstrating Retrieval-Augmented Generation using LlamaIndex.TS with local Ollama models for document querying and conversational AI |

Each demo is self-contained in its own directory and can be accessed through the main landing page.



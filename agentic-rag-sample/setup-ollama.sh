#!/bin/bash

echo "🚀 Setting up Ollama models for RAG system..."

echo "📥 Pulling Mistral model (LLM)..."
ollama pull mistral:latest

echo "📥 Pulling Nomic Embed Text model (Embeddings)..."
ollama pull nomic-embed-text

echo "✅ Ollama models setup complete!"
echo ""
echo "Available models:"
ollama list

echo ""
echo "🎯 Your RAG system is now ready to run!"
echo "Run: npm run dev"

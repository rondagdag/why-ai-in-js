# Agentic RAG Sample

A simple Node.js application that implements Retrieval-Augmented Generation (RAG) using LlamaIndex.TS with a local Ollama model. This application creates an intelligent agent that can parse and query documents from multiple file formats.

## Features

- 🤖 **Local AI Model**: Uses Ollama with Mistral for completely offline operation
- 📚 **Multi-format Document Support**: Handles PDF, CSV, and text files
- 🔍 **Semantic Search**: Advanced document retrieval using Ollama embeddings
- 💬 **Conversational Agent**: Interactive question-answering interface
- 🛡️ **Privacy-First**: All processing happens locally with no external API calls

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v18 or higher)
2. **Ollama** installed and running
3. **Required Ollama models** downloaded

### Quick Setup

1. Install Ollama from [https://ollama.com/](https://ollama.com/)
2. Run the setup script to download required models:
   ```bash
   ./setup-ollama.sh
   ```
3. Verify Ollama is running:
   ```bash
   ollama list
   ```

## Installation

1. **Clone or download** this project
2. **Navigate** to the project directory:
   ```bash
   cd agentic-rag-sample
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment** (optional):
   ```bash
   cp .env.example .env
   # Edit .env if you need to customize settings
   ```

## Usage

### Adding Documents

Place your documents in the `docs/` folder. Supported formats:
- **Text files** (`.txt`, `.md`)
- **CSV files** (`.csv`)
- **PDF files** (`.pdf`)

Sample documents are already included for testing.

### Running the Application

Start the application:
```bash
npm run dev
```

The application will:
1. Load and process documents from the `docs/` folder
2. Create vector embeddings using a local HuggingFace model
3. Initialize the RAG agent with Ollama
4. Run sample queries to demonstrate functionality

### Sample Queries

Try asking questions like:
- "What information is available in the documents?"
- "Tell me about AI and machine learning benefits"
- "Which companies have the highest revenue?"
- "What are the key project learnings mentioned?"

## Project Structure

```
agentic-rag-sample/
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── src/
│   └── index.ts             # Main application code
├── docs/                    # Document storage
│   ├── ai-overview.txt      # Sample text document
│   ├── companies.csv        # Sample CSV data
│   └── project-notes.txt    # Sample project notes
└── README.md               # This file
```

## Configuration

You can customize the application by editing the `.env` file:

```bash
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral:latest

# HuggingFace Configuration  
HUGGINGFACE_MODEL=BAAI/bge-small-en-v1.5

# Application Configuration
DOCS_FOLDER=./docs
SIMILARITY_TOP_K=10
VERBOSE_LOGGING=false
```

## How It Works

1. **Document Loading**: Uses `SimpleDirectoryReader` to load documents from the `docs/` folder
2. **Embedding Creation**: Converts documents to vector embeddings using HuggingFace's BGE model
3. **Vector Storage**: Stores embeddings in an in-memory vector index
4. **Agent Creation**: Creates a workflow-based agent with query tools
5. **Query Processing**: Processes natural language queries and retrieves relevant context
6. **Response Generation**: Uses Ollama to generate contextual responses

## Troubleshooting

### Common Issues

**"Cannot find module" errors:**
- Run `npm install` to install dependencies
- Make sure you're using Node.js v18 or higher

**Ollama connection errors:**
- Ensure Ollama is installed and running
- Check that the model is available: `ollama list`
- Verify Ollama is accessible at `http://localhost:11434`

**No documents found:**
- Make sure documents exist in the `docs/` folder
- Check file permissions and formats

**Slow performance:**
- First run includes model loading and indexing (may take 30+ seconds)
- Subsequent queries should be faster (3-5 seconds)
- Consider using a smaller model for faster responses

### Memory Requirements

- **Minimum**: 8GB RAM
- **Recommended**: 16GB RAM for optimal performance
- **Model size**: Mistral requires ~4.1GB of available memory

## Development

### Building the Project
```bash
npm run build
```

### Running in Production
```bash
npm run build
npm start
```

### Cleaning Build Files
```bash
npm run clean
```

## Contributing

This is a sample project demonstrating RAG implementation with LlamaIndex.TS. Feel free to:
- Add more document types
- Improve the user interface
- Implement persistent storage
- Add advanced query features

## License

MIT License - feel free to use this code for learning and development purposes.

## Resources

- [LlamaIndex.TS Documentation](https://ts.llamaindex.ai/)
- [Ollama Documentation](https://ollama.com/)
- [HuggingFace Embeddings](https://huggingface.co/BAAI/bge-small-en-v1.5)

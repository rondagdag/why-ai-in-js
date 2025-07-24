# Agentic RAG Sample - Requirements Document

## Project Overview

A simple Node.js application that implements Retrieval-Augmented Generation (RAG) using LlamaIndex.TS with a local Ollama model. The application will create an intelligent agent that can parse and query documents from multiple file formats (PDF, CSV, text files) stored in a local directory.

## Project Structure

```
agentic-rag-sample/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── src/
│   └── index.ts
├── docs/                    # Document storage folder
│   ├── sample.pdf          # Sample PDF files
│   ├── data.csv            # Sample CSV files
│   └── notes.txt           # Sample text files
└── README.md
```

## Technical Requirements

### Core Dependencies

- **LlamaIndex.TS Core**: `llamaindex` - Main framework
- **Workflow Package**: `@llamaindex/workflow` - Agent orchestration
- **Directory Reader**: `@llamaindex/readers/directory` - Multi-format document parsing
- **Ollama Integration**: `@llamaindex/ollama` - Local model integration
- **HuggingFace Embeddings**: `@llamaindex/huggingface` - Local embedding model
- **Development**: `typescript`, `@types/node`, `tsx` - TypeScript support

### Local Model Configuration

- **LLM Model**: Ollama with `gemma3:latest`
- **Embedding Model**: `BAAI/bge-small-en-v1.5` (HuggingFace)
- **Vector Store**: In-memory vector index
- **Query Configuration**: `similarityTopK: 10` for comprehensive context retrieval

## Functional Requirements

### Document Processing

1. **Multi-format Support**: Parse PDF, CSV, and text files from the `docs/` folder
2. **Automatic Indexing**: Convert documents to embeddings using local embedding model
3. **Vector Storage**: Store embeddings in memory for quick retrieval

### Agent Capabilities

1. **Intelligent Querying**: Agent can understand natural language questions about document content
2. **Context-Aware Responses**: Retrieve relevant document chunks based on similarity
3. **Tool Integration**: Use `index.queryTool()` for document querying capabilities
4. **Conversational Interface**: Support follow-up questions and context maintenance

### Query Features

1. **Semantic Search**: Find relevant information across all document types
2. **Cross-document Reasoning**: Combine information from multiple sources
3. **Detailed Responses**: Provide comprehensive answers with source context
4. **Error Handling**: Graceful handling of missing files or parsing errors

## Non-Functional Requirements

### Performance

- **Startup Time**: < 30 seconds for initial document indexing
- **Query Response**: < 5 seconds for typical queries
- **Memory Usage**: Efficient embedding storage and retrieval

### Reliability

- **Error Handling**: Robust error handling for file parsing and model communication
- **Logging**: Clear logging for debugging and monitoring
- **Graceful Degradation**: Continue operation if some documents fail to parse

### Maintainability

- **Clean Code**: Well-structured, commented TypeScript code
- **Simple Architecture**: Minimal complexity, easy to understand and extend
- **Configuration**: Environment-based configuration for model settings

## Implementation Details

### Core Components

1. **Document Loader**: `SimpleDirectoryReader` to load documents from `docs/` folder
2. **Vector Index**: `VectorStoreIndex.fromDocuments()` for embedding creation
3. **Query Tool**: `index.queryTool()` with descriptive metadata
4. **Agent**: Workflow-based agent with RAG capabilities

### Configuration

```typescript
// Embedding model configuration
Settings.embedModel = new HuggingFaceEmbedding({
  modelType: "BAAI/bge-small-en-v1.5",
  quantized: false,
});

// Ollama LLM configuration
const llm = ollama({
  model: "gemma3:latest",
});

// Query tool configuration
const queryTool = index.queryTool({
  metadata: {
    name: "document_query_tool",
    description: "Tool for querying documents in the docs folder including PDFs, CSVs, and text files",
  },
  options: {
    similarityTopK: 10,
  },
});
```

### Sample Usage

```typescript
const ragAgent = agent({
  llm: ollama({ model: "gemma3:latest" }),
  tools: [queryTool],
});

const response = await ragAgent.run("What information is available in the documents?");
```

## Development Environment

### Prerequisites

- **Node.js**: v18 or higher
- **Ollama**: Installed with `gemma3:latest` model
- **TypeScript**: Latest version
- **Memory**: Minimum 8GB RAM recommended for local model

### Setup Steps

1. Install Ollama and pull `gemma3:latest` model
2. Initialize Node.js project with TypeScript
3. Install required dependencies
4. Configure TypeScript with proper module resolution
5. Create sample documents in `docs/` folder
6. Implement and test the RAG agent

## Success Criteria

### Minimum Viable Product

- [ ] Successfully parse documents from `docs/` folder
- [ ] Create vector embeddings using local HuggingFace model
- [ ] Run queries against indexed documents using Ollama
- [ ] Return relevant, contextual responses
- [ ] Handle basic error scenarios

### Quality Metrics

- **Code Quality**: Clean, well-documented TypeScript code
- **Performance**: Reasonable response times for document queries
- **Accuracy**: Relevant responses based on document content
- **Usability**: Simple command-line interface for testing

## Future Enhancements (Out of Scope)

- Web interface for document upload and querying
- Persistent vector storage (e.g., Qdrant, Pinecone)
- Advanced document parsing (LlamaParse integration)
- Multi-user support and authentication
- Real-time document monitoring and re-indexing

## Constraints

- **Offline Operation**: Must work entirely offline with local models
- **Resource Limitations**: Optimize for local laptop/desktop environments
- **Simplicity**: Keep implementation minimal and focused
- **No External APIs**: Avoid dependency on OpenAI or other cloud services

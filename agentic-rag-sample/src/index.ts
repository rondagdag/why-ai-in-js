import { VectorStoreIndex, Settings, FunctionTool } from "llamaindex";
import { SimpleDirectoryReader } from "@llamaindex/readers/directory";
import { agent } from "@llamaindex/workflow";
import { ollama, OllamaEmbedding } from "@llamaindex/ollama";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import * as readline from "readline";

// Load environment variables
dotenv.config();

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class AgenticRAGSystem {
  private index: VectorStoreIndex | null = null;
  private ragAgent: any = null;
  private isInitialized = false;
  private rl: readline.Interface | null = null;
  private currentSources: any[] = [];

  constructor() {
    this.setupConfiguration();
    this.setupReadline();
  }

  private setupReadline() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private setupConfiguration() {
    console.log("🔧 Setting up configuration...");

    // Configure embedding model - using Ollama instead of HuggingFace to avoid network issues
    Settings.embedModel = new OllamaEmbedding({
      model: process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text",
    });

    // Configure LLM model
    Settings.llm = ollama({
      model: process.env.OLLAMA_MODEL || "mistral:latest",
      options: {
        temperature: 0.1, // Lower temperature for more consistent responses
      },
    });

    console.log("✅ Configuration completed");
  }

  async initialize() {
    if (this.isInitialized) {
      console.log("⚠️  System already initialized");
      return;
    }

    try {
      console.log("🚀 Initializing Agentic RAG System...");

      // Load documents
      await this.loadDocuments();

      // Create agent
      await this.createAgent();

      this.isInitialized = true;
      console.log("✅ System initialization completed successfully!");

    } catch (error) {
      console.error("❌ Failed to initialize system:", error);
      throw error;
    }
  }

  private async loadDocuments() {
    console.log("📚 Loading documents from docs folder...");

    const docsPath = path.resolve(__dirname, "../docs");
    console.log(`📁 Reading documents from: ${docsPath}`);

    try {
      const reader = new SimpleDirectoryReader();
      const documents = await reader.loadData(docsPath);

      console.log(`📄 Loaded ${documents.length} documents`);

      if (documents.length === 0) {
        throw new Error("No documents found in the docs folder");
      }

      // List loaded documents
      documents.forEach((doc, index) => {
        const filename = doc.metadata?.file_name || `Document ${index + 1}`;
        const preview = doc.text.substring(0, 100).replace(/\n/g, " ");
        console.log(`  📝 ${filename}: ${preview}...`);
      });

      console.log("🔄 Creating vector embeddings...");
      this.index = await VectorStoreIndex.fromDocuments(documents);
      console.log("✅ Vector index created successfully");

    } catch (error) {
      console.error("❌ Error loading documents:", error);
      throw error;
    }
  }

  private async createAgent() {
    if (!this.index) {
      throw new Error("Index not initialized");
    }

    console.log("🤖 Creating RAG agent...");

    try {
      // Create query agent
      const queryEngine = this.index.asQueryEngine({
        similarityTopK: parseInt(process.env.SIMILARITY_TOP_K || "10"),
      });

      // Create a custom tool that wraps the query engine to capture sources
      const queryTool = FunctionTool.from(
        async ({ query }: { query: string }) => {
          const response = await queryEngine.query({ query });
          // Capture the source nodes from the response
          if (response.sourceNodes) {
            this.currentSources = response.sourceNodes;
          }
          return response.response;
        },
        {
          name: "query_engine_tool",
          description: "Use this tool to query the knowledge base for information. Input should be a specific question.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The question to ask the knowledge base",
              },
            },
            required: ["query"],
          },
        }
      );

      // Create agent using the LLM from Settings
      this.ragAgent = agent({
        systemPrompt: "You are a helpful assistant that answers questions based on the provided documents. Use the query engine tool provided to retrieve relevant information from the knowledge base. Search first. If the answer is not found in the documents, respond with 'I don't know'. ",
        tools: [queryTool],
        verbose: process.env.VERBOSE_LOGGING === "true"
      });

      console.log("✅ RAG agent created successfully");

    } catch (error) {
      console.error("❌ Error creating agent:", error);
      throw error;
    }
  }

  async query(question: string): Promise<string> {
    if (!this.isInitialized || !this.ragAgent) {
      throw new Error("System not initialized. Call initialize() first.");
    }

    console.log(`\n🔍 Processing query: "${question}"`);
    console.log("⏳ Thinking...");

    try {
      this.currentSources = []; // Reset sources for new query
      const startTime = Date.now();
      const response = await this.ragAgent.run(question);
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      console.log(`⚡ Response generated in ${duration} seconds\n`);

      let finalResponse = response.data.result || response.data || "No response generated";

      // Append citations if available
      if (this.currentSources.length > 0) {
        finalResponse += "\n\n**Sources:**\n";
        const uniqueFiles = new Set<string>();

        this.currentSources.forEach(item => {
          if (item.node && item.node.metadata && item.node.metadata.file_name) {
            uniqueFiles.add(item.node.metadata.file_name);
          }
        });

        uniqueFiles.forEach(fileName => {
          finalResponse += `- ${fileName}\n`;
        });
      }

      return finalResponse;

    } catch (error) {
      console.error("❌ Error processing query:", error);
      throw error;
    }
  }

  private askQuestion(): Promise<string> {
    return new Promise((resolve) => {
      if (this.rl) {
        this.rl.question("\n💬 Enter your question (or 'exit'/'quit' to end): ", (answer) => {
          resolve(answer.trim());
        });
      }
    });
  }

  private closeReadline() {
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }
  }

  async runInteractiveSession() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    console.log("\n🎯 Welcome to the Agentic RAG System!");
    console.log("💡 Ask questions about the documents in the knowledge base.");
    console.log("💡 Type 'exit' or 'quit' to end the session.\n");

    // Sample queries to get started
    const sampleQueries = [
      "What is the browser support for WebGPU in Chrome according to the compatibility matrix?",
      "Compare TensorFlow.js and ONNX.js based on the frameworks comparison",
      "What are the key benefits of client-side AI listed in the documents?",
      "List the performance benchmarks for MobileNetV2 from the data",
    ];

    console.log("🌟 Sample queries you can try:");
    sampleQueries.forEach((query, index) => {
      console.log(`  ${index + 1}. ${query}`);
    });

    console.log("\n✨ Start asking your questions!");

    // Interactive loop
    while (true) {
      try {
        const question = await this.askQuestion();

        // Check for exit commands
        if (question.toLowerCase() === 'exit' || question.toLowerCase() === 'quit' || question === '') {
          console.log("\n👋 Thank you for using the Agentic RAG System!");
          break;
        }

        // Process the question
        const response = await this.query(question);
        console.log("🤖 Response:");
        console.log(response);
        console.log("\n" + "=".repeat(80));

      } catch (error) {
        console.error(`❌ Error processing your question:`, error);
        console.log("Please try again or type 'exit' to quit.");
      }
    }

    this.closeReadline();
  }
}

// Main execution
async function main() {
  console.log("🎉 Starting Agentic RAG Sample Application");
  console.log("📅 " + new Date().toLocaleString());
  console.log("=".repeat(60));

  try {
    // Check if Ollama is running
    console.log("🔍 Checking Ollama connection...");

    const ragSystem = new AgenticRAGSystem();
    await ragSystem.runInteractiveSession();

  } catch (error) {
    console.error("\n❌ Application failed:", error);
    console.log("\n🛠️  Troubleshooting tips:");
    console.log("1. Make sure Ollama is installed and running");
    console.log(`2. Ensure the model '${process.env.OLLAMA_MODEL || "mistral:latest"}' is available`);
    console.log("3. Check that documents exist in the docs/ folder");
    console.log("4. Verify your environment configuration");
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});

// Run the application
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

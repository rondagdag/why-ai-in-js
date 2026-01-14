
import { AgenticRAGSystem } from "./index.js";

async function run() {
    const system = new AgenticRAGSystem();
    await system.initialize();

    // Ask a very specific question that requires looking up the CSV data
    const question = "What is the browser support for WebGPU in Chrome according to the browser compatibility matrix?";
    console.log(`Asking question: ${question}`);

    const response = await system.query(question);
    console.log("FINAL RESPONSE:\n", response);
}

run().catch(console.error);

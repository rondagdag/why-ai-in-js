# Quick Start - Web (using script tag)

This example demonstrates how to use **ONNX Runtime Web** directly in the browser using a simple `<script>` tag. It shows how to load a model, prepare data, run inference, and display results—all in vanilla JavaScript.

## What is ONNX Runtime Web?

ONNX Runtime Web allows you to run ONNX models directly in the browser. This enables AI capabilities in web applications without backend dependencies for inference, reducing latency and protecting user privacy.

In this demo, we use a pre-trained simple Matrix Multiplication model (`model.onnx`) to multiply two matrices.

## Demo Overview

When you run this demo, the following happens:
1.  **Load Library**: The ONNX Runtime Web library (`ort.min.js`) is loaded from a CDN.
2.  **Load Model**: An `InferenceSession` is created by loading the `model.onnx` file. 
    - The model takes two input matrices: `a` (3x4) and `b` (4x3).
    - It produces one output matrix: `c` (3x3).
3.  **Prepare Data**: We create two matching tensors with sample data.
4.  **Run Inference**: We pass the inputs to the session and run it.
5.  **Display Output**: The result is extracted and shown on the page.

## How to Run

1.  **Serve the directory**:
    You need a local web server to serve the HTML and the ONNX model file. You can use `light-server` (or `http-server`, `python -m http.server`, etc.).

    Using `npx light-server`:
    ```sh
    npx light-server -s . -p 8080
    ```

2.  **Open the application**:
    Open your browser and navigate to [http://localhost:8080/](http://localhost:8080/).

3.  **Interact**:
    Click the **"Run Inference"** button to execute the model and see the results.

## Code Walkthrough

Open `index.html` to see the code. Here's a breakdown:

### 1. Import Library
```html
<script src="https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js"></script>
```
This script tag brings `ort` into the global scope.

### 2. Create Session
```javascript
const session = await ort.InferenceSession.create('./model.onnx');
```
We initialize the inference engine with our specific model.

### 3. Create Tensors
```javascript
const dataA = Float32Array.from([...]);
const tensorA = new ort.Tensor('float32', dataA, [3, 4]);
```
ONNX Runtime requires data to be wrapped in `Tensor` objects with a specific type and shape.

### 4. Execute
```javascript
const feeds = { a: tensorA, b: tensorB };
const results = await session.run(feeds);
```
We create a "feeds" object mapping model input names (`a`, `b`) to our tensors, then call `run()`.

### 5. Read Results
```javascript
const dataC = results.c.data;
```
The `results` object contains our output tensor `c`, from which we access the raw data.
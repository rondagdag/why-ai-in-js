/**
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './style.css'

// The underlying model has a context of 1,024 tokens, out of which 26 are used by the internal prompt,
// leaving about 998 tokens for the input text. Each token corresponds, roughly, to about 4 characters, so 4,000
// is used as a limit to warn the user that the content might be too long to summarize.
const MAX_MODEL_CHARS = 4000;
const inputTextArea = document.querySelector('#input') as HTMLTextAreaElement;
const summaryTypeSelect = document.querySelector('#type') as HTMLSelectElement;
const summaryFormatSelect = document.querySelector('#format') as HTMLSelectElement;
const summaryLengthSelect = document.querySelector('#length') as HTMLSelectElement;
const characterCountSpan = document.querySelector('#character-count') as HTMLSpanElement;
const characterCountExceededSpan = document.querySelector('#character-count-exceed') as HTMLSpanElement;
const summarizationUnsupportedDialog = document.querySelector('#summarization-unsupported') as HTMLDivElement;
const summarizationUnavailableDialog = document.querySelector('#summarization-unavailable') as HTMLDivElement;
const output = document.querySelector('#output') as HTMLDivElement;

// Example texts for demonstration
const examples = {
  news: `OpenAI has announced GPT-4 Turbo, a more capable and cost-effective version of its flagship language model. The new model features a 128K context window, allowing it to process the equivalent of 300 pages of text in a single prompt. GPT-4 Turbo also includes updated knowledge through April 2023, improved instruction following, and new capabilities including JSON mode and reproducible outputs. The model is significantly more affordable, with input tokens costing $0.01 per 1K tokens and output tokens at $0.03 per 1K tokens - a 3x reduction compared to GPT-4. Additionally, OpenAI introduced the Assistants API, which enables developers to build agent-like experiences with persistent threads and built-in retrieval. The company also unveiled DALL-E 3 API access and a new text-to-speech model with six preset voices. These updates represent OpenAI's continued effort to make advanced AI more accessible and practical for developers worldwide.`,

  tech: `The React useEffect hook is a fundamental part of functional components in React. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in class components, but unified into a single API. The useEffect hook accepts two arguments: a function that contains the side effect logic, and an optional dependency array. The function runs after every render by default, but you can control when it runs by specifying dependencies. If you pass an empty dependency array, the effect only runs once after the initial render, similar to componentDidMount. If you specify variables in the dependency array, the effect will re-run whenever those values change. The effect function can optionally return a cleanup function, which React will call before running the effect again and when the component unmounts. This cleanup mechanism is useful for canceling subscriptions, clearing timers, or performing other cleanup operations. Common use cases for useEffect include fetching data from APIs, setting up subscriptions, manually changing the DOM, and logging. It's important to understand the dependency array to avoid infinite loops and ensure your effects run at the right time.`,

  story: `The old lighthouse keeper had seen many storms, but none quite like this. Maria stood at the top of the tower, watching as waves crashed against the rocks below with a fury she'd never witnessed in her forty years of service. The wind howled through the ancient stone structure, causing the lantern room to shudder. She checked her watch - it was nearly time to light the beacon. As she turned the crank to rotate the Fresnel lens, a flash of lightning illuminated something impossible: a ship, barely visible through the sheets of rain, heading straight for the rocks. Maria grabbed the radio, but static was all that greeted her. The power had been out for hours. She had to warn them somehow. Racing down the spiral stairs, her mind worked furiously. Then she remembered the old emergency flares in the storage room. With trembling hands, she loaded the flare gun and fired three shots into the stormy sky. Red light bloomed against the darkness. Minutes felt like hours, but finally, she saw the ship's lights change direction, steering safely away from the deadly rocks. Maria smiled, exhausted but grateful, knowing the lighthouse had fulfilled its purpose once again.`,

  research: `This study investigates the application of transformer-based neural networks in protein structure prediction, specifically examining the effectiveness of attention mechanisms in capturing long-range amino acid interactions. We trained a novel architecture combining multi-head self-attention with geometric constraints on a dataset of 50,000 experimentally determined protein structures from the Protein Data Bank. Our model achieves a median TM-score of 0.87 on the CASP14 benchmark, representing a 15% improvement over previous state-of-the-art methods. Ablation studies reveal that the geometric constraint module contributes 8% of the performance gain, while the attention mechanism accounts for the remaining improvement. Interestingly, we observe that the model's attention patterns correlate strongly with known secondary structure elements, suggesting that it learns meaningful biological features. The model demonstrates particular strength in predicting structures of proteins with novel folds, achieving accuracy comparable to template-based methods even in the absence of homologous templates. These findings suggest that transformer architectures can effectively model the complex relationships governing protein folding, potentially accelerating drug discovery and our understanding of protein function. Future work will explore extending this approach to protein-protein interaction prediction and designing novel proteins with desired properties.`
};

// Store currently active button
let activeExampleBtn: HTMLButtonElement | null = null;

let selectionTimeout: number | undefined = undefined;

// Function to handle text selection with debouncing
const handleSelection = () => {
  clearTimeout(selectionTimeout);
  selectionTimeout = setTimeout(() => {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) {
      inputTextArea.value = selectedText;
      characterCountSpan.textContent = selectedText.length.toString();
      if (selectedText.length > MAX_MODEL_CHARS) {
        characterCountSpan.classList.add('tokens-exceeded');
        characterCountExceededSpan.classList.remove('hidden');
      } else {
        characterCountSpan.classList.remove('tokens-exceeded');
        characterCountExceededSpan.classList.add('hidden');
      }
      scheduleSummarization();
    }
  }, 500); // Wait 500ms after selection ends
};

document.addEventListener('mouseup', handleSelection);
document.addEventListener('keyup', (e) => {
  if (e.key === 'Shift' || e.key === 'Meta' || e.key === 'Control') {
    handleSelection();
  }
});

// Add type declarations for the Summarizer API
declare global {
  interface Window {
    Summarizer: {
      availability(): Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>;
      create(options?: {
        type?: AISummarizerType;
        format?: AISummarizerFormat;
        length?: AISummarizerLength;
        monitor?: (m: any) => void;
      }): Promise<any>;
    };
  }
}

/*
 * Checks if the device supports the Summarizer API (rather than if the browser supports the API).
 * This method returns `true` when the device is capable of running the Summarizer API and `false`
 * when it is not.
 */
const checkSummarizerSupport = async (): Promise<boolean> => {
  const availability = await self.Summarizer.availability();
  return availability !== 'unavailable';
}
 
let timeout: number | undefined = undefined;
function scheduleSummarization() {
  // Debounces the call to the summarization API. This will run the summarization once the user
  // hasn't typed anything for at least 1 second.
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    output.textContent = 'Generating summary...';
    let session = await createSummarizationSession(
      summaryTypeSelect.value as AISummarizerType,
      summaryFormatSelect.value as AISummarizerFormat,
      summaryLengthSelect.value as AISummarizerLength,
    );
    let summary = await session.summarize(inputTextArea.value);
    session.destroy();
    output.textContent = summary;
  }, 1000);
}

async function createSummarizationSession(
  type: AISummarizerType,
  format: AISummarizerFormat,
  length: AISummarizerLength
) {
  return await self.Summarizer.create({
    type,
    format,
    length
  });
}

/*
 * Updates the character count display and checks if the text exceeds the limit
 */
const updateCharacterCount = () => {
  characterCountSpan.textContent = inputTextArea.value.length.toFixed();
  if (inputTextArea.value.length > MAX_MODEL_CHARS) {
    characterCountSpan.classList.add('tokens-exceeded');
    characterCountExceededSpan.classList.remove('hidden');
  } else {
    characterCountSpan.classList.remove('tokens-exceeded');
    characterCountExceededSpan.classList.add('hidden');
  }
}

/*
 * Loads an example text into the textarea
 */
const loadExample = (exampleType: keyof typeof examples) => {
  const text = examples[exampleType];
  inputTextArea.value = text;
  updateCharacterCount();
  scheduleSummarization();
}

/*
 * Sets up example button click handlers
 */
const setupExampleButtons = () => {
  const exampleButtons = document.querySelectorAll('.example-btn') as NodeListOf<HTMLButtonElement>;

  exampleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const exampleType = button.dataset.example as keyof typeof examples;

      // Remove active class from previous button
      if (activeExampleBtn) {
        activeExampleBtn.classList.remove('active');
      }

      // Add active class to clicked button
      button.classList.add('active');
      activeExampleBtn = button;

      // Load the example
      loadExample(exampleType);
    });
  });
}

/*
 * Initializes the application.
 * This function will check for the availability of the Summarization API, and if the device is
 * able to run it before setting up the listeners to summarize the input added to the textarea.
 */
const initializeApplication = async () => {
  // Check if the Summarizer API is supported by the browser
  const summarizationApiAvailable = 'Summarizer' in self;

  if (!summarizationApiAvailable) {
    summarizationUnavailableDialog.style.display = 'block';
    return;
  }

  const canSummarize = await checkSummarizerSupport();
  if (!canSummarize) {
    summarizationUnsupportedDialog.style.display = 'block';
    return;
  }

  // Set up example buttons
  setupExampleButtons();

  summaryTypeSelect.addEventListener('change', scheduleSummarization);
  summaryFormatSelect.addEventListener('change', scheduleSummarization);
  summaryLengthSelect.addEventListener('change', scheduleSummarization);

  inputTextArea.addEventListener('input', () => {
    updateCharacterCount();
    scheduleSummarization();
  });
}

initializeApplication();

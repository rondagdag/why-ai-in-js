/**
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Updated for Chrome Prompt API (Chrome 138+)
 * https://developer.chrome.com/docs/ai/prompt-api
 */

import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

const SYSTEM_PROMPT = "You are a helpful and friendly assistant.";

(async () => {
  const errorMessage = document.getElementById("error-message");
  const costSpan = document.getElementById("cost");
  const promptArea = document.getElementById("prompt-area");
  const problematicArea = document.getElementById("problematic-area");
  const promptInput = document.getElementById("prompt-input");
  const responseArea = document.getElementById("response-area");
  const copyLinkButton = document.getElementById("copy-link-button");
  const resetButton = document.getElementById("reset-button");
  const copyHelper = document.querySelector("small");
  const rawResponse = document.querySelector("details div");
  const form = document.querySelector("form");
  const maxTokensInfo = document.getElementById("max-tokens");
  const temperatureInfo = document.getElementById("temperature");
  const tokensLeftInfo = document.getElementById("tokens-left");
  const tokensSoFarInfo = document.getElementById("tokens-so-far");
  const topKInfo = document.getElementById("top-k");
  const sessionTemperature = document.getElementById("session-temperature");
  const sessionTopK = document.getElementById("session-top-k");

  responseArea.style.display = "none";

  let session = null;

  // Check if the API is available
  if (!self.ai || !self.ai.languageModel) {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = `Your browser doesn't support the Prompt API. If you're on Chrome, join the <a href="https://developer.chrome.com/docs/ai/join-epp">Early Preview Program</a> to enable it.`;
    return;
  }

  // Check model availability
  const availability = await self.ai.languageModel.availability();
  if (availability === 'unavailable') {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = `The Prompt API model is unavailable on this device.`;
    return;
  }

  if (availability === 'downloadable' || availability === 'downloading') {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = `The Prompt API model is ${availability}. Please wait...`;
    // Continue to allow the user to try, but show the status
  }

  promptArea.style.display = "block";
  copyLinkButton.style.display = "none";
  copyHelper.style.display = "none";

  const promptModel = async (highlight = false) => {
    copyLinkButton.style.display = "none";
    copyHelper.style.display = "none";
    problematicArea.style.display = "none";
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    responseArea.style.display = "block";
    const heading = document.createElement("h3");
    heading.classList.add("prompt", "speech-bubble");
    heading.textContent = prompt;
    responseArea.append(heading);
    const p = document.createElement("p");
    p.classList.add("response", "speech-bubble");
    p.textContent = "Generating response...";
    responseArea.append(p);
    let fullResponse = "";

    try {
      if (!session) {
        await updateSession();
        updateStats();
      }
      const stream = await session.promptStreaming(prompt);

      let result = '';
      let previousChunk = '';
      for await (const chunk of stream) {
        const newChunk = chunk.startsWith(previousChunk)
            ? chunk.slice(previousChunk.length) : chunk;
        result += newChunk;
        p.innerHTML = DOMPurify.sanitize(marked.parse(result));
        rawResponse.innerText = result;
        previousChunk = chunk;
      }
    } catch (error) {
      console.error('Prompt error:', error);
      p.textContent = `Error: ${error.message}`;
      
      // If the session was destroyed or there's a quota issue, try to recreate it
      if (error.message.includes('session') || error.message.includes('quota')) {
        try {
          await updateSession();
        } catch (sessionError) {
          console.error('Failed to recreate session:', sessionError);
        }
      }
    } finally {
      if (highlight) {
        problematicArea.style.display = "block";
        problematicArea.querySelector("#problem").innerText =
          decodeURIComponent(highlight).trim();
      }
      copyLinkButton.style.display = "inline-block";
      copyHelper.style.display = "inline";
      updateStats();
    }
  };

  const updateStats = () => {
    if (!session) {
      return;
    }
    const { maxTemperature, temperature, inputUsage, inputQuota, topK } = session;
    maxTokensInfo.textContent = new Intl.NumberFormat("en-US").format(
      inputQuota,
    );
    (temperatureInfo.textContent = new Intl.NumberFormat("en-US", {
      maximumSignificantDigits: 5,
    }).format(temperature)),
      (tokensLeftInfo.textContent = new Intl.NumberFormat("en-US").format(
        inputQuota - inputUsage,
      ));
    tokensSoFarInfo.textContent = new Intl.NumberFormat("en-US").format(
      inputUsage,
    );
    topKInfo.textContent = new Intl.NumberFormat("en-US").format(topK);
  };

  const params = new URLSearchParams(location.search);
  const urlPrompt = params.get("prompt");
  const highlight = params.get("highlight");
  if (urlPrompt) {
    promptInput.value = decodeURIComponent(urlPrompt).trim();
    await promptModel(highlight);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await promptModel();
  });

  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });

  promptInput.addEventListener("focus", () => {
    promptInput.select();
  });

  promptInput.addEventListener("input", async () => {
    const value = promptInput.value.trim();
    if (!value || !session) {
      return;
    }
    try {
      const cost = await session.measureInputUsage(value);
      if (cost) {
        costSpan.textContent = `${cost} token${cost === 1 ? '' : 's'}`;
      }
    } catch (error) {
      // measureInputUsage might not be available in all versions
      console.warn('Token counting not available:', error);
    }
  });

  const resetUI = () => {
    responseArea.style.display = "none";
    responseArea.innerHTML = "";
    rawResponse.innerHTML = "";
    problematicArea.style.display = "none";
    copyLinkButton.style.display = "none";
    copyHelper.style.display = "none";
    maxTokensInfo.textContent = "";
    temperatureInfo.textContent = "";
    tokensLeftInfo.textContent = "";
    tokensSoFarInfo.textContent = "";
    topKInfo.textContent = "";
    promptInput.focus();
  };

  resetButton.addEventListener("click", async () => {
    promptInput.value = "";
    resetUI();
    if (session) {
      session.destroy();
      session = null;
    }
    await updateSession();
  });

  copyLinkButton.addEventListener("click", () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    const url = new URL(self.location.href);
    url.searchParams.set("prompt", encodeURIComponent(prompt));
    const selection = getSelection().toString() || "";
    if (selection) {
      url.searchParams.set("highlight", encodeURIComponent(selection));
    } else {
      url.searchParams.delete("highlight");
    }
    navigator.clipboard.writeText(url.toString()).catch((err) => {
      alert("Failed to copy link: ", err);
    });
    const text = copyLinkButton.textContent;
    copyLinkButton.textContent = "Copied";
    setTimeout(() => {
      copyLinkButton.textContent = text;
    }, 3000);
  });

  const updateSession = async () => {
    try {
      session = await self.ai.languageModel.create({
        temperature: Number(sessionTemperature.value),
        topK: Number(sessionTopK.value),
        initialPrompts: [
          { role: 'system', content: SYSTEM_PROMPT }
        ],
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            console.log(`Downloaded ${e.loaded * 100}%`);
            if (errorMessage.style.display === "block" && errorMessage.innerHTML.includes('downloading')) {
              errorMessage.innerHTML = `The Prompt API model is downloading... ${Math.round(e.loaded * 100)}%`;
            }
          });
        },
      });
      if (errorMessage.style.display === "block" && errorMessage.innerHTML.includes('downloading')) {
        errorMessage.style.display = "none";
      }
      resetUI();
      updateStats();
    } catch (error) {
      errorMessage.style.display = "block";
      errorMessage.innerHTML = `Error creating session: ${error.message}`;
    }
  };

  sessionTemperature.addEventListener("input", async () => {
    await updateSession();
  });

  sessionTopK.addEventListener("input", async () => {
    await updateSession();
  });

  if (!session) {
    const params = await self.ai.languageModel.params();
    const { defaultTopK, maxTopK, defaultTemperature, maxTemperature } = params;
    sessionTemperature.value = defaultTemperature;
    sessionTemperature.max = maxTemperature || 2.0;
    sessionTopK.value = defaultTopK;
    sessionTopK.max = maxTopK;
    await updateSession();
  }
})();

/**
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Example texts for demo purposes
const EXAMPLES = {
  spanish: {
    text: "¡Hola! ¿Cómo estás? Me llamo Carlos y soy desarrollador de software. Me encanta programar aplicaciones web usando JavaScript y las nuevas APIs del navegador.",
    description: "A friendly Spanish greeting and introduction"
  },
  japanese: {
    text: "こんにちは！私の名前は田中です。ウェブ開発が大好きで、特にブラウザの新しいAI機能に興味があります。この翻訳APIはとても便利ですね。",
    description: "A Japanese self-introduction about web development"
  },
  english: {
    text: "The browser's built-in Translation API represents a significant advancement in web technology. By running AI models directly on the user's device, we can provide instant translations without compromising privacy or requiring an internet connection.",
    description: "An English paragraph about the Translation API"
  },
  french: {
    text: "La vie est belle quand on la regarde avec les yeux du cœur. Chaque jour est une nouvelle opportunité d'apprendre et de grandir.",
    description: "A French quote about life (detection works, but translation not yet supported)"
  },
  german: {
    text: "Übung macht den Meister. Wer rastet, der rostet. Diese alten deutschen Sprichwörter enthalten viel Weisheit über das Leben und die Arbeit.",
    description: "German proverbs (detection works, but translation not yet supported)"
  },
  mixed: {
    text: "Hello! Bonjour! ¡Hola! こんにちは！Guten Tag! This text contains multiple languages to test the detection capabilities.",
    description: "Mixed language text to test detection"
  }
};

// Convert language code to human-readable name
const languageTagToHumanReadable = (languageTag, targetLanguage = 'en') => {
  const displayNames = new Intl.DisplayNames([targetLanguage], {
    type: 'language',
  });
  return displayNames.of(languageTag);
};

(async () => {
  // DOM Elements
  const input = document.querySelector('#input');
  const output = document.querySelector('#output');
  const form = document.querySelector('form');
  const detected = document.querySelector('#detected');
  const language = document.querySelector('#translate');
  const translationControls = document.querySelector('.translation-controls');
  const outputSection = document.querySelector('.output-section');
  const exampleButtons = document.querySelectorAll('.example-btn');
  const notSupportedMessage = document.querySelector('.not-supported-message');

  // Check if the Language Detector API is supported
  if (!('LanguageDetector' in self)) {
    notSupportedMessage.hidden = false;
    return;
  }

  // Create the language detector with proper availability check
  const availability = await LanguageDetector.availability();
  let detector;

  if (availability === 'unavailable') {
    notSupportedMessage.hidden = false;
    return;
  }

  if (availability === 'available') {
    detector = await LanguageDetector.create();
  } else {
    // Handle downloadable/downloading states
    detected.textContent = 'Downloading language detection model...';
    detector = await LanguageDetector.create({
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          detected.textContent = `Downloading model... ${(e.loaded * 100).toFixed(1)}%`;
        });
      },
    });
    await detector.ready;
  }

  form.style.visibility = 'visible';

  // Language detection function
  const detectLanguage = async () => {
    const text = input.value.trim();

    if (!text) {
      detected.textContent = 'Enter some text to detect its language';
      detected.className = '';
      return null;
    }

    try {
      const results = await detector.detect(text);

      if (results && results.length > 0) {
        const { detectedLanguage, confidence } = results[0];
        const languageName = languageTagToHumanReadable(detectedLanguage);
        const confidencePercent = (confidence * 100).toFixed(1);

        // Show detection result with confidence indicator
        let confidenceClass = 'low';
        if (confidence > 0.8) confidenceClass = 'high';
        else if (confidence > 0.5) confidenceClass = 'medium';

        detected.innerHTML = `<strong>${languageName}</strong> detected with <span class="confidence ${confidenceClass}">${confidencePercent}%</span> confidence`;

        // Show additional candidates if available
        if (results.length > 1 && results[1].confidence > 0.1) {
          const secondary = results[1];
          const secondaryName = languageTagToHumanReadable(secondary.detectedLanguage);
          detected.innerHTML += `<br><small>Also possible: ${secondaryName} (${(secondary.confidence * 100).toFixed(1)}%)</small>`;
        }

        return detectedLanguage;
      }
    } catch (err) {
      console.error('Detection error:', err);
      detected.textContent = 'Error detecting language';
    }

    return null;
  };

  // Set up example button handlers
  exampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const exampleKey = btn.dataset.example;
      const example = EXAMPLES[exampleKey];

      if (example) {
        input.value = example.text;

        // Clear previous output
        output.textContent = '';
        outputSection.hidden = true;

        // Trigger detection
        detectLanguage();

        // Highlight active button
        exampleButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  // Real-time language detection on input
  input.addEventListener('input', detectLanguage);

  // Initial detection
  detectLanguage();

  // Translation functionality
  if ('Translator' in self) {
    translationControls.hidden = false;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const text = input.value.trim();
      if (!text) {
        output.textContent = 'Please enter some text to translate.';
        outputSection.hidden = false;
        return;
      }

      try {
        output.textContent = 'Detecting source language...';
        outputSection.hidden = false;

        const sourceLanguage = await detectLanguage();

        if (!sourceLanguage) {
          output.textContent = 'Could not detect the source language.';
          return;
        }

        // Check if translation is supported for this pair
        const targetLanguage = language.value;

        if (sourceLanguage === targetLanguage) {
          output.textContent = 'Source and target languages are the same. No translation needed!';
          return;
        }

        // Currently only English ↔ Spanish and English ↔ Japanese are supported
        const supportedPairs = [
          ['en', 'es'], ['es', 'en'],
          ['en', 'ja'], ['ja', 'en']
        ];

        const isPairSupported = supportedPairs.some(
          ([src, tgt]) => src === sourceLanguage && tgt === targetLanguage
        );

        if (!isPairSupported) {
          const sourceName = languageTagToHumanReadable(sourceLanguage);
          const targetName = languageTagToHumanReadable(targetLanguage);
          output.innerHTML = `<span class="warning">⚠️ Translation from ${sourceName} to ${targetName} is not yet supported.</span><br><br>Currently supported pairs:<br>• English ↔ Spanish<br>• English ↔ Japanese`;
          return;
        }

        // Check if the translation pair is available
        const translatorAvailability = await Translator.availability({
          sourceLanguage,
          targetLanguage,
        });

        if (translatorAvailability === 'unavailable') {
          output.textContent = 'Translation not available for this language pair.';
          return;
        }

        let translator;
        if (translatorAvailability === 'available') {
          output.textContent = 'Translating...';
          translator = await Translator.create({
            sourceLanguage,
            targetLanguage,
          });
        } else {
          // Handle downloadable/downloading states
          translator = await Translator.create({
            sourceLanguage,
            targetLanguage,
            monitor(m) {
              m.addEventListener('downloadprogress', (e) => {
                output.textContent = `Downloading translation model... ${(e.loaded * 100).toFixed(1)}%`;
              });
            },
          });
          await translator.ready;
        }

        const translation = await translator.translate(text);

        const sourceName = languageTagToHumanReadable(sourceLanguage);
        const targetName = languageTagToHumanReadable(targetLanguage);

        output.innerHTML = `<div class="translation-header">${sourceName} → ${targetName}</div><div class="translation-text">${translation}</div>`;

      } catch (err) {
        output.innerHTML = `<span class="error">❌ An error occurred: ${err.message}</span>`;
        console.error('Translation error:', err.name, err.message);
      }
    });
  }
})();

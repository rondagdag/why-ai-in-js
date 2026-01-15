/**
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineConfig } from 'vite'

export default defineConfig({
  base: '/why-ai-in-js/summarization-api-playground/dist/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})

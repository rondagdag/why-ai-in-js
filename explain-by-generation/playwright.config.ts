import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  retries: 0,
  workers: 1, // Extensions often conflict if run in parallel
  use: {
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
})

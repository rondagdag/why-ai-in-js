import "./modulepreload-polyfill.js";
import { A as APP_CONSTANTS, b as getGenerationsReversed } from "./app.js";
const levels = getGenerationsReversed();
let currentLevel = 1;
async function initializeUI() {
  const result = await chrome.storage.sync.get(APP_CONSTANTS.STORAGE_KEYS.SELECTED_LEVEL);
  if (result.selectedLevel) {
    currentLevel = result.selectedLevel.level;
  }
  const container = document.getElementById("options");
  levels.forEach((level) => {
    const button = document.createElement("button");
    button.className = `level-option ${level.level === currentLevel ? "selected" : ""}`;
    button.innerHTML = `
      <div class="level-name">${level.name}</div>
      <div class="level-description">${level.description}</div>
    `;
    button.addEventListener("click", () => {
      selectLevel(level);
    });
    container.appendChild(button);
  });
  if (result.selectedLevel) {
    await selectLevel(result.selectedLevel);
  }
}
async function selectLevel(level) {
  currentLevel = level.level;
  document.querySelectorAll(".level-option").forEach((btn) => {
    btn.classList.toggle(
      "selected",
      btn.querySelector(".level-name")?.textContent === level.name
    );
  });
  await chrome.storage.sync.set({ [APP_CONSTANTS.STORAGE_KEYS.SELECTED_LEVEL]: level });
  await chrome.runtime.sendMessage({
    type: APP_CONSTANTS.MESSAGE_TYPES.SET_LEVEL,
    level
  });
}
document.addEventListener("DOMContentLoaded", () => {
  initializeUI().catch(console.error);
});
//# sourceMappingURL=popupHtml.js.map

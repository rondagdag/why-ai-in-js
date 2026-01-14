# Rerun Button Enhancement - Current Text Selection

## Overview

Enhanced the "Rerun" button functionality in the Explain by Generation Chrome extension to read the currently selected text on the active tab instead of using only the stored text from the initial right-click selection.

## Changes Made

### 1. Content Script (`src/content-script.ts`)

- **New file** that runs on all web pages
- **`getCurrentSelection()`**: Function to get currently selected text using `window.getSelection()`
- **Message listener**: Responds to `GET_CURRENT_SELECTION` requests from the side panel
- **Selection change monitoring**: Optional feature that notifies the extension when text selection changes (debounced to 500ms)

### 2. App Component (`src/App.tsx`)

- **Enhanced `handleRerun()`**: Now attempts to get current selection before falling back to stored text
- **Error handling**: Gracefully handles cases where content script communication fails
- **Text update**: Updates stored selected text when fresh selection is available
- **Backward compatibility**: Falls back to stored text if no current selection is found

### 3. Background Script (`src/background.ts`)

- **Selection change handler**: Processes `SELECTION_CHANGED` messages from content script
- **Improved error handling**: Better error responses for rerun operations
- **Async processing**: Proper handling of the `processSummarization` function call

### 4. Configuration Updates

- **Manifest (`public/manifest.json`)**: Added content script configuration to run on all URLs
- **Vite config (`vite.config.ts`)**: Added content script to build process with proper output naming

## How It Works

### Current Workflow

1. User selects text and right-clicks → Context menu appears
2. User clicks "Explain by Generation" → Background script processes initial text
3. Side panel opens with explanation for the selected generation
4. **NEW**: User can select different text on the page
5. **NEW**: User clicks "Rerun" → Extension gets current selection from active tab
6. **NEW**: If current selection exists, use it; otherwise fall back to stored text
7. Process explanation with current generation level

### Message Flow

```
Content Script ←→ Background Script ←→ Side Panel
     ↓                    ↓               ↓
- GET_CURRENT_SELECTION  - Process new   - handleRerun()
- CURRENT_SELECTION_     text selection  - Request current
  RESPONSE              - RERUN_         selection
- SELECTION_CHANGED       SUMMARIZATION  - Display new
                                        explanation
```

## Key Features

### Graceful Fallback

- If content script communication fails → Uses stored text
- If no current selection exists → Uses stored text
- Extension maintains backward compatibility

### Performance Optimizations

- Debounced selection change monitoring (500ms)
- Lightweight content script with minimal DOM impact
- Proper error handling to prevent extension crashes

### User Experience

- Seamless transition between different text selections
- Visual feedback maintains consistency
- No additional UI changes required

## Testing

The extension successfully builds and packages with all new functionality:

- ✅ TypeScript compilation passes
- ✅ Vite build includes content script
- ✅ Manifest properly configured
- ✅ Extension package created successfully

## Browser Compatibility

- Requires Chrome with experimental AI APIs enabled
- Content script runs on all URLs (required for text selection)
- Maintains compatibility with existing functionality

## Security Considerations

- Content script has minimal permissions
- Only reads text selections, doesn't modify page content
- Follows Chrome extension security best practices
- Proper message validation between components

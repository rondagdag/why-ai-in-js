# Chrome Web Store Assets Checklist

## Required Images and Assets

### 1. Extension Icons (Already Have ✅)

Your extension already includes these required icons:

- `icon16.png` - 16x16 pixels
- `icon32.png` - 32x32 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

### 2. Chrome Web Store Listing Images (NEEDED)

#### Store Icon

- **Size**: 128x128 pixels
- **Format**: PNG or JPEG
- **Description**: Main icon displayed in the Chrome Web Store
- **Current**: You can use your existing `icon128.png`

#### Small Promotional Tile (Optional but Recommended)

- **Size**: 440x280 pixels
- **Format**: PNG or JPEG
- **Description**: Displayed in the Chrome Web Store

#### Large Promotional Tile (Optional)

- **Size**: 920x680 pixels
- **Format**: PNG or JPEG
- **Description**: Featured placement in Chrome Web Store

#### Marquee Promotional Tile (Optional)

- **Size**: 1400x560 pixels
- **Format**: PNG or JPEG
- **Description**: Featured in special promotions

#### Screenshots (Required)

- **Size**: 1280x800 pixels OR 640x400 pixels
- **Format**: PNG or JPEG
- **Quantity**: 1-5 screenshots
- **Description**: Show your extension in action
- **Requirements**:
  - Show the extension's user interface
  - Demonstrate key features
  - Include browser chrome/context

### 3. Store Listing Content

#### Title

**Current**: "Explain by Generation"
**Requirements**:

- Maximum 45 characters
- Must be descriptive and unique

#### Summary (Required)

**Requirements**:

- Maximum 132 characters
- Single line description
- **Suggestion**: "Get AI-powered explanations of highlighted text customized for different generations (Gen Z, Millennial, etc.)"

#### Description (Required)

**Requirements**:

- Maximum 16,000 characters
- Detailed explanation of features
- Include keywords for discoverability

#### Category

**Suggested**: "Productivity" or "Education"

#### Language

**Primary**: English

### 4. Privacy and Content Information

#### Privacy Policy (Required if extension handles user data)

- **Required**: Yes (your extension uses storage permission)
- **Content**: Must explain what data is collected and how it's used
- **Location**: Must be hosted on a website you control

#### Permissions Justification

Your extension requests these permissions:

- `activeTab` - To access current tab content for text highlighting
- `contextMenus` - To add right-click menu options
- `sidePanel` - To display explanation panel
- `storage` - To save user preferences and settings
- `<all_urls>` - To work on any website

## Screenshots to Create

### Screenshot 1: Extension in Action

- Show highlighted text on a webpage
- Display the explanation panel
- Include the side panel with different generation options

### Screenshot 2: Popup Interface

- Show the extension popup
- Highlight key features and controls

### Screenshot 3: Context Menu

- Show the right-click context menu option
- Demonstrate how users activate the extension

### Screenshot 4: Settings/Preferences

- If you have settings, show the configuration options

### Screenshot 5: Multiple Generation Examples

- Show different explanations for the same text across generations

## Next Steps to Create Assets

1. **Take Screenshots**:

   ```bash
   # Install the extension locally first
   # Open Chrome > Extensions > Load unpacked > Select your dist folder
   # Navigate to a webpage and take screenshots of the extension in use
   ```

2. **Create Promotional Images**:
   - Use tools like Figma, Canva, or Photoshop
   - Include your app icon and key features
   - Use consistent branding and colors

3. **Write Store Description**:
   - Highlight the unique value proposition
   - Mention AI-powered explanations
   - Include generation customization feature
   - Add keywords for SEO

4. **Create Privacy Policy**:
   - Use a privacy policy generator
   - Host on your personal website or GitHub Pages
   - Include specific details about your extension's data usage

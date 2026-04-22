# Article to Text

Firefox extension that extracts article content from web pages and converts to clean text for AI tools.

Supports the most common html tags and attributes for an article markup, like:

- `article`
- `[role="main"]`
- `.content-body`

## Installation

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Navigate to the extension folder and select `manifest.json`
5. The extension icon will appear in your Firefox toolbar

Note: This is a temporary installation.

## Keyboard Shortcuts

### Defaults

- **Copy text**: `Alt+Shift+1` (Mac: `Command+Shift+1`)
- **Save text**: `Alt+Shift+2` (Mac: `Command+Shift+2`)

To customize shortcuts:

1. Go to `about:addons`
2. Click the gear icon → "Manage Extension Shortcuts"
3. Find "Article to Text" and configure your preferred keys

## Usage

1. Visit any web page with article content
2. Click the extension icon in the toolbar
3. The extracted text will appear in the popup
4. Use "Copy text" to copy to clipboard, or "Save" to download as a .txt file

The extension extracts:

- Article title
- Main body text with paragraph breaks
- Images are replaced with `[Image: alt text]` placeholders

It automatically removes:

- Navigation, headers, footers
- Sidebars, widgets
- Comments
- Advertisements
- Social sharing elements

## Files

- `manifest.json` - Extension manifest
- `background.js` - Background script for keyboard shortcuts
- `popup.html` - Extension popup UI
- `popup.js` - Popup functionality and extraction logic
- `styles.css` - Popup styling
- `icon.png` - Extension icon

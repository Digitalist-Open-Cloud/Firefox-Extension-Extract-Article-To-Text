# Article to Text

Firefox extension that extracts article content from web pages and converts to clean text for AI tools.

## Installation

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Navigate to the extension folder and select `manifest.json`
5. The extension icon will appear in your Firefox toolbar

Note: This is a temporary installation. To keep the extension permanently, you would need to sign it through Mozilla.

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
- `popup.html` - Extension popup UI
- `popup.js` - Popup functionality and extraction logic
- `styles.css` - Popup styling
- `icon.png` - Extension icon

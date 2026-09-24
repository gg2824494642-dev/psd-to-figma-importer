# PSD to Figma Importer

A Figma plugin that imports Adobe Photoshop (.psd) files with fully editable text layers, preserving design proportions, colors, and pixel-perfect accuracy.

## Features

- ✅ **Editable Text Layers** - All PSD text layers become native Figma text layers
- 🎨 **Color Accuracy** - Preserves original colors, opacity, and blend modes
- 📐 **Pixel-Perfect** - Maintains exact dimensions, positions, and proportions
- 🖼️ **Image Layers** - Rasterized image layers imported as Figma image fills
- 📁 **Layer Structure** - Preserves group hierarchy from PSD
- 🚀 **Local Processing** - All parsing done locally, no data sent to external servers

## Installation

### Method 1: Development Import (Local)

1. Open Figma Desktop App
2. Go to **Plugins** → **Development** → **Import plugin from manifest...**
3. Select the `manifest.json` file from this folder
4. The plugin will appear in your development plugins list

### Method 2: Publish to Figma Community

1. Go to [Figma Plugin Development](https://www.figma.com/plugin-docs/publishing/)
2. Create a new plugin in the Figma Plugin Management dashboard
3. Upload all files from this project
4. Submit for review to publish to the community

## Usage

1. Open any Figma design file
2. Go to **Plugins** → **Development** → **PSD to Figma Importer**
3. Drag and drop your `.psd` or `.psb` file into the upload area
4. Click **Import to Figma**
5. Your PSD will be imported as a new frame with all layers editable

## Project Structure

```
psd-to-figma-plugin/
├── manifest.json          # Plugin manifest (required)
├── package.json           # Node.js dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── src/
│   ├── code.ts            # Main process (Figma sandbox)
│   └── ui.html            # Plugin UI (iframe)
└── dist/
    ├── code.js            # Compiled main process
    └── ui.html            # Plugin UI (built)
```

## Supported Features

| Feature | Status |
|---------|--------|
| Text layers (editable) | ✅ |
| Image layers | ✅ |
| Layer groups | ✅ |
| Opacity | ✅ |
| Layer visibility | ✅ |
| Position & size | ✅ |
| Font size | ✅ |
| Font color | ✅ |
| Layer names | ✅ |
| Blend modes | ⚠️ Partial |
| Layer effects | ⚠️ Partial |
| Gradients | ⚠️ Partial |
| Shape layers | ⚠️ Partial |

## Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Watch for changes
npm run watch
```

## Technical Details

- **PSD Parsing**: Uses [psd.js](https://github.com/meltingice/psd.js) for local PSD parsing
- **Figma API**: Uses Figma Plugin API v1.0.0
- **Font Handling**: Maps common PSD fonts to Figma-available fonts (Inter, Georgia, etc.)
- **Image Import**: Converts PSD layer images to Figma image fills

## Limitations

- Advanced PSD features (smart objects, adjustment layers, layer styles) may not be fully preserved
- Font matching depends on fonts available in Figma
- Very large PSD files may take longer to process

## License

MIT License - Feel free to use and share!

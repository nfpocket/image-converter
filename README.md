# Image Converter

A modern web application for converting, resizing, and optimizing images. Built with Nuxt 3 and Vue.js.

## Features

- **Multiple Conversion Modes**:
  - **Format Only**: Simply convert between image formats
  - **Resize**: Change image dimensions while optionally maintaining aspect ratio
  - **Compress**: Optimize images with quality and file size controls

- **Supported Formats**:
  - Convert to WebP (modern, efficient format)
  - Convert to PNG (lossless format)
  - WebP specific options like lossless compression

- **Batch Processing**:
  - Convert multiple images at once
  - Automatic ZIP creation for multiple files
  - Preserves original filenames

- **Advanced Options**:
  - Maintain aspect ratio during resizing
  - Quality control for compression
  - Maximum file size limits
  - Original size preservation option

## Prerequisites

- Node.js 16.x or later
- npm, yarn, or pnpm

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/image-converter.git
cd image-converter
```

2. Install dependencies:
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

3. Start the development server:
```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

The application will be available at `http://localhost:8088`.

## Building for Production

1. Build the application:
```bash
# Using npm
npm run build

# Using yarn
yarn build

# Using pnpm
pnpm build
```

2. Preview the production build:
```bash
# Using npm
npm run preview

# Using yarn
yarn preview

# Using pnpm
pnpm preview
```

## Technology Stack

- [Nuxt 3](https://nuxt.com/) - The Vue.js Framework
- [Vue.js 3](https://vuejs.org/) - Progressive JavaScript Framework
- [Nuxt UI](https://ui.nuxt.com/) - UI Component Library
- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression) - Client-side image compression
- [JSZip](https://stuk.github.io/jszip/) - Creating ZIP files in the browser

## Browser Support

The application works best in modern browsers that support:
- WebP format
- File System Access API
- Modern JavaScript features

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Norman Feiß ([@nfpocket](https://github.com/nfpocket))

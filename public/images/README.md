# Images Directory

This directory contains images used in the project.

## Logo Files Available

The following logo files are available for use:

1. **logo_horizontal_colored.png** - Horizontal colored logo (used in navigation)
2. **logo_horizontal_white.png** - Horizontal white logo
3. **logo_horizontal_white_1.png** - Alternative horizontal white logo
4. **logo_horizontal_white_clean.png** - Clean horizontal white logo
5. **logo_vertical_colored.png** - Vertical colored logo (used in hero section)
6. **logo_vertical_white.png** - Vertical white logo
7. **logo_vertical_white_clean.png** - Clean vertical white logo (used as background)

## Usage

### Static Images
Place static images (logos, icons, banners, etc.) directly in this folder.

### Accessing Images
Images in this directory can be accessed via:
```
/images/your-image-name.jpg
```

For example, if you have `logo.png` in this folder, you can use it in your React components like:
```jsx
<img src="/images/logo.png" alt="Logo" />
```

### Recommended Image Formats
- **PNG**: For images with transparency (logos, icons)
- **JPG**: For photographs and complex images
- **SVG**: For scalable vector graphics (icons, simple graphics)
- **WebP**: For optimized web images (modern browsers)

### Uploaded Images
For user-uploaded images, use `storage/app/public/images/` directory and access them via the storage link.

## Image Usage in Project

### Navigation (Layout.jsx)
- **File**: logo_horizontal_colored.png
- **Size**: w-20 h-12 (mobile), w-24 h-16 (desktop)
- **Location**: Top navigation bar

### Hero Section (Home.jsx)
- **Main Logo**: logo_horizontal_white.png
- **Background Logo**: logo_vertical_colored.png
- **Effect**: Floating animation with glow and shadow

### Cards (Home.jsx)
- **Hackathon Card**: logo_horizontal_white.png
- **Workshop Card**: logo_horizontal_white.png
- **Conference Card**: logo_horizontal_white_1.png
- **Effect**: Blur effect that becomes clear on hover

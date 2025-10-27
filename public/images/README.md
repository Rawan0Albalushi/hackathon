# Images Directory

This directory contains images used in the project.

## Logo Files Available

The following logo files are available for use:

1. **الشعار افقي ملون.png** - Horizontal colored logo (used in navigation)
2. **الشعار افقي ابيض.png** - Horizontal white logo
3. **الشعار افقي ابيض (1).png** - Alternative horizontal white logo
4. **الشعار ابيض صافي افقي.png** - Clean horizontal white logo
5. **الشعار طولي ملون.png** - Vertical colored logo (used in hero section)
6. **الشعار طولي ابيض.png** - Vertical white logo
7. **الشعار ابيض صافي طولي.png** - Clean vertical white logo (used as background)

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
- **File**: الشعار افقي ملون.png
- **Size**: w-20 h-12 (mobile), w-24 h-16 (desktop)
- **Location**: Top navigation bar

### Hero Section (Home.jsx)
- **Main Logo**: الشعار افقي ابيض.png
- **Background Logo**: الشعار طولي ملون.png
- **Effect**: Floating animation with glow and shadow

### Cards (Home.jsx)
- **Hackathon Card**: الشعار افقي ابيض.png
- **Workshop Card**: الشعار افقي ابيض.png
- **Conference Card**: الشعار افقي ابيض (1).png
- **Effect**: Blur effect that becomes clear on hover

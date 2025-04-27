export const formatValue = (value) => Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

export const formatThousands = (value) => Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);

export const getCssVariable = (variable) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

const adjustHexOpacity = (hexColor, opacity) => {
  // Remove the '#' if it exists
  hexColor = hexColor.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Return RGBA string
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const adjustHSLOpacity = (hslColor, opacity) => {
  // Convert HSL to HSLA
  return hslColor.replace('hsl(', 'hsla(').replace(')', `, ${opacity})`);
};

const adjustOKLCHOpacity = (oklchColor, opacity) => {
  // Add alpha value to OKLCH color
  return oklchColor.replace(/oklch\((.*?)\)/, (match, p1) => `oklch(${p1} / ${opacity})`);
};

const adjustRGBOpacity = (rgbColor, opacity) => {
  // Convert RGB to RGBA or update existing RGBA opacity
  if (rgbColor.startsWith('rgba')) {
    return rgbColor.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, 
      (match, r, g, b) => `rgba(${r}, ${g}, ${b}, ${opacity})`);
  } else {
    return rgbColor.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, 
      (match, r, g, b) => `rgba(${r}, ${g}, ${b}, ${opacity})`);
  }
};

export const adjustColorOpacity = (color, opacity) => {
  // Handle null or undefined colors
  if (!color) {
    return `rgba(0, 0, 0, ${opacity})`;
  }
  
  if (color.startsWith('#')) {
    return adjustHexOpacity(color, opacity);
  } else if (color.startsWith('hsl')) {
    return adjustHSLOpacity(color, opacity);
  } else if (color.startsWith('oklch')) {
    return adjustOKLCHOpacity(color, opacity);
  } else if (color.startsWith('rgb')) {
    return adjustRGBOpacity(color, opacity);
  } else {
    // Fallback: assume it's a named color and create a div to convert it
    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.color = color;
      document.body.appendChild(tempDiv);
      
      const computedColor = window.getComputedStyle(tempDiv).color;
      document.body.removeChild(tempDiv);
      
      // Now we have RGB, apply opacity
      return adjustRGBOpacity(computedColor, opacity);
    } catch (e) {
      console.warn(`Could not process color: ${color}`, e);
      return `rgba(0, 0, 0, ${opacity})`;
    }
  }
};

export const oklchToRGBA = (oklchColor) => {
  // Create a temporary div to use for color conversion
  const tempDiv = document.createElement('div');
  tempDiv.style.color = oklchColor;
  document.body.appendChild(tempDiv);

  // Get the computed style and convert to RGB
  const computedColor = window.getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);

  return computedColor;
};
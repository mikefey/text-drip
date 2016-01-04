const conversionHelper = {
  rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b).toString(16);
  },
};

export default conversionHelper;

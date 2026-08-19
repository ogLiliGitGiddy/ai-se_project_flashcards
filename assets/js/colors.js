// P1P2-T3.1  colors.js file and add it to assets/js (or create the file yourself and copy/paste its contents). It contains three color-related functions you’ve written in tasks.

const colorMap = {
  green: "#64d583",
  blue: "#91a8f9",
  orange: "#ee955e",
  pink: "#ee92d7",
  purple: "#aa8ef0",
  yellow: "#f5d770",
  default: "#64d583", // default color if color name is not found in colorMap
};

/**
 * Returns a hexadecimal string corresponding to the provided color name
 * string. If it isn't found in the colorMap object, colorMap.default is
 * returned.
 *
 * @param {string} colorName
 * @returns a hexadecimal string
 */

// stringToHex function that takes in a color name string and returns the corresponding hex value from the colorMap object. If the color name is not found in the colorMap, it should return the default color hex value.
function stringToHex(colorName) {
  const color = colorMap[colorName]; // we can use bracket notation to access the value in colorMap based on the colorName string. If the colorName is not a key in colorMap, this will return undefined, so we can use the logical OR operator to return colorMap.default in that case.
  return color || colorMap.default; // if color is undefined (i.e. colorName not found in colorMap), return the default color hex value.
}

/**
 * Accepts a hexadecimal string and returns the corresponding color name key,
 * if found in colorMap. If a match isn't found, null is returned.
 *
 * @param {string} hexValue
 * @returns a color name string
 */

// hexToString function that takes in a hex value string and returns the corresponding color name key from the colorMap object. If the hex value is not found in the colorMap, it should return null.
function hexToString(hexValue) {
  // we can use Object.keys to get an array of the keys in colorMap, and then use find to find the key whose value matches the hexValue. If no key is found, find will return undefined, so we can return null in that case.
  const colorString = Object.keys(colorMap).find((key) => {
    return colorMap[key] === hexValue;
  });
  // if colorString is undefined (i.e. hexValue not found in colorMap), return null. Otherwise, return the colorString.
  return colorString || null;
}

/**
 * Accepts an HTML element and removes all BEM "_color_" modifiers from its
 * class list.
 *
 * @param {HTMLElement} element //
 */
// removeColorClasses function that takes in an HTML element and removes all BEM "_color_" modifiers from its class list. We can loop through the element's classList and check if each class includes the substring "_color_". If it does, we can remove that class from the element.
function removeColorClasses(element) {
  // we can use the spread operator to convert the DOMTokenList returned by element.classList into an array, so that we can use forEach to loop through it. Then we check if each class includes "_color_", and if it does, we remove it from the element's class list.
  [...element.classList].forEach((cls) => {
    // check if the class includes the substring "_color_". If it does, remove that class from the element.
    if (cls.includes("_color_")) {
      element.classList.remove(cls); // we can use classList.remove to remove the class from the element.
    }
  });
}

// we need to export the three functions from this module so that they can be imported and used in other modules, such as carousel.js and index.js.
export { stringToHex, hexToString, removeColorClasses };

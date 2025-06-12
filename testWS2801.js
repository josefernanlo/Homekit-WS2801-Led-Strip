/**
 * Script de pruebas para WS2801
 * Ejecutar con: node testWS2801.js
 */

const { HSLToRGB, applyGammaToRGB } = require('./stripController.js');
const { WS2801_CONFIGS } = require('./ws2801Config.js');

console.log('=== Pruebas WS2801 ===\n');

// Probar conversión de colores
console.log('1. Pruebas de conversión HSL a RGB:');
const testColors = [
    { h: 0, s: 100, l: 50, name: 'Rojo' },
    { h: 120, s: 100, l: 50, name: 'Verde' },
    { h: 240, s: 100, l: 50, name: 'Azul' },
    { h: 60, s: 100, l: 50, name: 'Amarillo' },
    { h: 300, s: 100, l: 50, name: 'Magenta' },
    { h: 180, s: 100, l: 50, name: 'Cian' }
];

testColors.forEach(color => {
    const rgb = HSLToRGB(color.h, color.s, color.l);
    const gammaRgb = applyGammaToRGB(rgb);
    console.log(`${color.name}: HSL(${color.h}, ${color.s}%, ${color.l}%) -> RGB(${rgb.red}, ${rgb.green}, ${rgb.blue}) -> Gamma(${gammaRgb.red}, ${gammaRgb.green}, ${gammaRgb.blue})`);
});

console.log('\n2. Configuraciones disponibles:');
Object.keys(WS2801_CONFIGS).forEach(key => {
    const config = WS2801_CONFIGS[key];
    console.log(`${key}: Clock Speed: ${config.spiClockSpeed} Hz, Debug: ${config.debug}`);
});

console.log('\n3. Pruebas de brillo:');
const baseColor = { red: 255, green: 100, blue: 50 };
const brightnessLevels = [25, 50, 75, 100];

brightnessLevels.forEach(brightness => {
    const adjustedColor = {
        red: Math.round(baseColor.red * (brightness / 100)),
        green: Math.round(baseColor.green * (brightness / 100)),
        blue: Math.round(baseColor.blue * (brightness / 100))
    };
    const gammaColor = applyGammaToRGB(adjustedColor);
    console.log(`Brillo ${brightness}%: RGB(${adjustedColor.red}, ${adjustedColor.green}, ${adjustedColor.blue}) -> Gamma(${gammaColor.red}, ${gammaColor.green}, ${gammaColor.blue})`);
});

console.log('\n=== Pruebas completadas ===');

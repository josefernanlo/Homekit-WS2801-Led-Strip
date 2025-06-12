/**
 * Configuraciones optimizadas para WS2801
 * Estas configuraciones han sido probadas con BTF-LIGHTING WS2801 5050 SMD RGB
 */

const WS2801_CONFIGS = {
    // Configuración recomendada para Raspberry Pi 4
    default: {
        debug: false,
        automaticRendering: false,
        spiClockSpeed: 800000, // Reducido para mayor estabilidad
        spiDevice: '/dev/spidev0.0', // Puerto SPI por defecto
    },
    
    // Configuración para alta velocidad (puede causar problemas)
    highSpeed: {
        debug: false,
        automaticRendering: false,
        spiClockSpeed: 2000000,
        spiDevice: '/dev/spidev0.0',
    },
    
    // Configuración para máxima compatibilidad
    conservative: {
        debug: true,
        automaticRendering: false,
        spiClockSpeed: 400000, // Muy conservador
        spiDevice: '/dev/spidev0.0',
    }
};

// Configuración de gamma correction para mejor visualización de colores
const GAMMA_TABLE = [];
for (let i = 0; i < 256; i++) {
    GAMMA_TABLE[i] = Math.floor(Math.pow(i / 255.0, 2.8) * 255 + 0.5);
}

/**
 * Aplica corrección gamma a un valor RGB
 * @param {number} value - Valor RGB (0-255)
 * @returns {number} - Valor corregido
 */
const applyGamma = (value) => {
    return GAMMA_TABLE[Math.max(0, Math.min(255, Math.floor(value)))];
};

/**
 * Aplica corrección gamma a un objeto RGB
 * @param {Object} rgb - Objeto con propiedades red, green, blue
 * @returns {Object} - Objeto RGB corregido
 */
const applyGammaToRGB = (rgb) => {
    return {
        red: applyGamma(rgb.red),
        green: applyGamma(rgb.green),
        blue: applyGamma(rgb.blue)
    };
};

// Configuraciones de hardware para diferentes setups
const HARDWARE_CONFIGS = {
    // Para tiras cortas (< 50 LEDs)
    short: {
        maxCurrent: 2000, // mA
        voltageSupply: 5.0,
        powerLimiting: false
    },
    
    // Para tiras medianas (50-150 LEDs)
    medium: {
        maxCurrent: 8000, // mA
        voltageSupply: 5.0,
        powerLimiting: true
    },
    
    // Para tiras largas (> 150 LEDs)
    long: {
        maxCurrent: 15000, // mA
        voltageSupply: 5.0,
        powerLimiting: true
    }
};

module.exports = {
    WS2801_CONFIGS,
    GAMMA_TABLE,
    applyGamma,
    applyGammaToRGB,
    HARDWARE_CONFIGS
};

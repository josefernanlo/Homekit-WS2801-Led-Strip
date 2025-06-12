// Librerías requeridas
const LedController = require('ws2801-pi').default;
const Constant = require('./constants.js');
const ManegerPromise = require('./promiseController.js');
const { WS2801_CONFIGS, applyGammaToRGB } = require('./ws2801Config.js');

// Configuración e inicio de la librería LedController con configuración optimizada
const config = WS2801_CONFIGS.default; // Usa 'conservative' si tienes problemas
const ledController = new LedController('900', config);

// Estado de JS (Para poder invocar o no acciones)
let status = false;

// Estados generales
let stripsStatus = {
    0: {
        brightness: 0,
        power: false,
        color: 0,
        saturation: 0
    },
    1: {
        brightness: 0,
        power: false,
        color: 0,
        saturation: 0
    },
    2: {
        brightness: 0,
        power: false,
        color: 0,
        saturation: 0
    },
};

// Cola de acciones
const queue = [];

/**
 * La función devuelve true si se puede ejecutar una funcion o false si el dispositivo está ocupado.
 * @returns Boolean
 */
const isAvailable = () => status === false ? status : ManegerPromise.promise(status).isFulfiled;


const getSections = (ledStripId) => Constant.strips[ledStripId].sections

const animateSection = async (ledStripId, characteristic, value) => {
    const sections = getSections(ledStripId);
    const numberOfIterations = sections.map((section) => section.to - section.from).sort((a, b) => b - a)[0];

    for (i = 0; i < numberOfIterations; i++) {
        const ledsToUpdate = sections.reduce((acc, section) => [...acc, section.to + i], []);
        doAction(characteristic, ledsToUpdate, ledStripId ,value);
        await ledController.show();
    }

}

const updatePower = (leds, power) => {
    if (power) {
        // power = true - usar un blanco suave en lugar de máximo
        const softWhite = applyGammaToRGB({ red: 200, green: 200, blue: 200 });
        leds.map(led => ledController.setLed(led, softWhite));
    } else {
        // power = false
        leds.map(led => ledController.setLed(led, { red: 0, green: 0, blue: 0 }));
    }
}

const updatedBrightness = (leds, ledStripId, brightness) => {
    // Obtener el color actual y aplicar brillo
    const currentColor = stripsStatus[ledStripId].color;
    const currentSaturation = stripsStatus[ledStripId].saturation;
    
    // Convertir HSL a RGB con el nuevo brillo
    const colorRGB = HSLToRGB(currentColor, currentSaturation, 50);
    
    // Aplicar brillo y corrección gamma
    const adjustedColor = {
        red: Math.round(colorRGB.red * (brightness / 100)),
        green: Math.round(colorRGB.green * (brightness / 100)),
        blue: Math.round(colorRGB.blue * (brightness / 100))
    };
    
    const gammaAdjustedColor = applyGammaToRGB(adjustedColor);
    
    leds.map(led => ledController.setLed(led, gammaAdjustedColor));
}

const updateColor = (leds, ledStripId, color) => {
    const brightness = stripsStatus[ledStripId].brightness;
    const saturation = stripsStatus[ledStripId].saturation;
    
    // Mejorar la conversión HSL a RGB
    const colorRGB = HSLToRGB(color, saturation, 50); // Usar 50 como base de luminosidad
    
    // Aplicar brillo como factor multiplicativo
    const adjustedColor = {
        red: Math.round(Math.min(255, colorRGB.red * (brightness / 100))),
        green: Math.round(Math.min(255, colorRGB.green * (brightness / 100))),
        blue: Math.round(Math.min(255, colorRGB.blue * (brightness / 100)))
    };
    
    // Aplicar corrección gamma para mejor visualización
    const gammaAdjustedColor = applyGammaToRGB(adjustedColor);
    
    console.log(`Color RGB con gamma: R:${gammaAdjustedColor.red}, G:${gammaAdjustedColor.green}, B:${gammaAdjustedColor.blue}`);
    leds.map(led => ledController.setLed(led, gammaAdjustedColor));
}

const doAction = async (characteristic, leds, ledStripId, value) => {
    console.log(characteristic, leds, value)
    return new Promise((resolve, reject) => {
        switch (characteristic) {
            case 'power':
                updatePower(leds, value)
                break;            case 'brightness':
                updatedBrightness(leds, ledStripId, value)
                break;
            case 'color':
                 updateColor(leds, ledStripId, value)
                break;
        }
        resolve('Setted Led!');
    });
}

const setPower = (ledStripId, power) => {
    if (isAvailable) {
        return new Promise((resolve, reject) => {
            animateSection(ledStripId, 'power', power);
            stripsStatus[ledStripId].power = power;
            resolve('Done!');
        });
    } else {
        queue.push({})
    }
}

const getPower = (ledStripId) => {
    return stripsStatus[ledStripId].power;
}

const setBrigthness = (ledStripId, brightness) => {
    if (isAvailable) {
        return new Promise((resolve, reject) => {
            // Validar rango de brillo
            brightness = Math.max(0, Math.min(100, brightness));
            animateSection(ledStripId, 'brightness', brightness);
            stripsStatus[ledStripId].brightness = brightness;
            resolve('Brightness set!');
        });
    } else {
        queue.push({
            action: 'brightness',
            ledStripId: ledStripId,
            value: brightness
        });
    }
}

const getBrigthness = (ledStripId) => {
    return stripsStatus[ledStripId].brightness;
}

const setSaturation = (ledStripId, saturation) => {
    console.log(`saturation of ${ledStripId} setted at ${saturation}`);
    stripsStatus[ledStripId].saturation = saturation;
}

const getSaturation = (ledStripId) => {
    return stripsStatus[ledStripId].saturation;
}

const setColor = (ledStripId, color) => {
    if (isAvailable) {
        return new Promise((resolve, reject) => {
            stripsStatus[ledStripId].color = color;
            animateSection(ledStripId, 'color', color);
            resolve('Done!');
        });
    } else {
        queue.push({});
    }
}

const getColor = (ledStripId) => {
    return stripsStatus[ledStripId].color;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h is in [0, 360], s and l are in [0, 100] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue (0-360)
 * @param   {number}  s       The saturation (0-100)
 * @param   {number}  l       The lightness (0-100)
 * @return  {Object}          The RGB representation {red, green, blue}
 */
const HSLToRGB = (h, s, l) => {
    // Normalizar valores
    h = h % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    return {
        red: Math.round((r + m) * 255),
        green: Math.round((g + m) * 255),
        blue: Math.round((b + m) * 255)
    };
};

module.exports = {
    setPower,
    getPower,
    setBrigthness,
    getBrigthness,
    setColor,
    getColor,
    setSaturation,
    getSaturation
}
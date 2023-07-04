// Librerías requeridas
const LedController = require('ws2801-pi').default;
const Constant = require('./constants.js');
const ManegerPromise = require('./promiseController.js');

// Configuración e inicio de la librería LedController
const config = {
    debug: false,
    automaticRendering: false,
    spiClockSpeed: 1064959.92,
};
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
        doAction(characteristic, ledsToUpdate, value);
        await ledController.show();
    }

}

const updatePower = (leds, power) => {
    if (power) {
        // power = true
        leds.map(led => ledController.setLed(led, { red: 255, green: 255, blue: 255 }))
    } else {
        // power = false
        leds.map(led => ledController.setLed(led, { red: 0, green: 0, blue: 0 }))
    }
}

const updatedBrightness = (leds, brightness) => {

}

const updateColor = (leds, color) => {
    const colorRGB = HSLToRGB(color, stripsStatus[ledStripId].saturation, 100);
    console.log(colorRGB.red, colorRGB.green, colorRGB.blue)
    leds.map(led => ledController.setLed(led, colorRGB))
}

const doAction = async (characteristic, leds, value) => {
    console.log(characteristic, leds, value)
    return new Promise((resolve, reject) => {
        switch (characteristic) {
            case 'power':
                updatePower(leds, value)
                break;
            case 'brightness':
                updatedBrightness(leds, value)
                break;
            case 'color':
                 updateColor(leds, value)
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
    animateSection(ledStripId, 'brightness', brightness);
    stripsStatus[ledStripId].brightness = brightness;
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
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
const HSLToRGB = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {red: Math.round(255 * f(0)), green: Math.round(255 * f(8)), blue: Math.round(255 * f(4))};
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
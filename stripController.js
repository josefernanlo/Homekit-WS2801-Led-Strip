// Librerías requeridas
const LedController = require('ws2801-pi').default;
const Constant = require('./constants.js');
const { promise } = require('./promiseController.js');

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
const isAvailable = () => status === false ? status : promise(status).isFulfiled ;


const getSections = (ledStripId) => Constant.strips[ledStripId].sections

const animateSection = async (ledStripId, characteristic, value) => {
    const sections = getSections(ledStripId);
    const numberOfIterations = sections.map( (section) => section.to - section.from).sort((a, b) => b-a)[0];

    for (i = 0; i < numberOfIterations ;i++){
        const ledsToUpdate = sections.map( (section) => section.to + i);
        doAction(characteristic, ledsToUpdate, value);
        await ledController.show();
    }

}

const updatePower = (leds, power) => {
    if (power) {
        // power = true
        leds.map(led => ledController.setLed(led, {red: 255, green: 255, blue: 255}))
    } else {
        // power = false
        leds.map(led => ledController.setLed(led, {red: 0, green: 0, blue: 0}))
    }
}

const updatedBrightness = (leds, brightness) => {

}

const updateColor = (leds, color) => {
    leds.map(led => ledController.setLed(led, color))
}

const doAction = async (characteristic, leds, value) => {
    const promiseResult = new Promise();
    const callbacks = {
        'power': updatePower,
        'brightness': updatedBrightness,
        'color': updateColor,
    }

    callbacks[characteristic]?.bind(this, leds, value);
    return promiseResult.resolve('Setted Led!');
}

const setPower = (ledStripId, power) => {
    if(isAvailable) {
        status = new Promise();
        console.log(`power of ${ledStripId} setted at ${power}`);
        animateSection(ledStripId, 'power', power);
        stripsStatus[ledStripId].power = power;
        status.resolve('Done!');
    } else {
        queue.push({})
    }
}

const getPower = (ledStripId) => {
    return stripsStatus[ledStripId].power;
}

const setBrigthness = (ledStripId, brightness) => {
    console.log(`brightness of ${ledStripId} setted at ${brightness}`);
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
    if(isAvailable) {
        status = new Promise();
        console.log(`color of ${ledStripId} setted at ${color}`);
        const colorRGB = HSLToRGB(color ,stripsStatus[ledStripId].saturation);
        stripsStatus[ledStripId].color = color;
        animateSection(ledStripId, 'color', colorRGB); 
        status.resolve('Done!');
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
const HSLToRGB = (h,s,l) => {
    // Must be fractions of 1
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        red = 0,
        green = 0,
        blue = 0; if (0 <= h && h < 60) {
      red = c; green = x; blue = 0;  
    } else if (60 <= h && h < 120) {
      red = x; green = c; blue = 0;
    } else if (120 <= h && h < 180) {
      red = 0; green = c; blue = x;
    } else if (180 <= h && h < 240) {
      red = 0; green = x; blue = c;
    } else if (240 <= h && h < 300) {
      red = x; green = 0; blue = c;
    } else if (300 <= h && h < 360) {
      red = c; green = 0; blue = x;
    }
    red = Math.round((red + m) * 255);
    green = Math.round((green + m) * 255);
    blue = Math.round((blue + m) * 255);
  
    return {red, green, blue};
  }

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
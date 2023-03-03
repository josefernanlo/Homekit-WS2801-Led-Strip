const LedController = require('ws2801-pi').default;
const Constant = require('./constants.js');

const config = {
    debug : false,
    automaticRendering: false,
    spiClockSpeed : 1064959.92,
};
const ledController = new LedController('900', config);

const wait = async (ms) =>  new Promise((resolve) => {setTimeout(resolve, ms); });


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

const animateSection = async (section, characteristic, value) => {
    const {from, to, direction} = section;
    switch (characteristic) {
        case 'power':
            for (let i = from; i < to ;i+=1) {
                ledController.setLed(i, value === true ? {red: 255, green: 255, blue: 255} :  {red: 0, green: 0, blue: 0})
                ledController.show();
                await wait(16.667);
            }
            break;
        case 'brightness':
            ledController.setBrightness(value);
            ledController.show();
            break;
        case 'hue':
        case 'saturation':
        default:
            ledController.fillLeds(HSVtoRGB(value, 100, 100));
            ledController.show();
            break;
    }
}

const setPower = (ledStripId, power) => {
    console.log(`power of ${ledStripId} setted at ${power}`);
    Constant.strips[ledStripId].sections.map(section => animateSection(section, 'power', power))
    stripsStatus[ledStripId].power = power;
}

const getPower = (ledStripId) => {
    return stripsStatus[ledStripId].power;
}

const setBrigthness = (ledStripId, brightness) => {
    console.log(`brightness of ${ledStripId} setted at ${brightness}`);
    Constant.strips[ledStripId].sections.map(section => animateSection(section, 'brightness', brightness));
    stripsStatus[ledStripId].brightness = brightness;
} 

const getBrigthness = (ledStripId) => {
    return stripsStatus[ledStripId].brightness;
}

const setSaturation = (ledStripId, saturation) => {
    console.log(`saturation of ${ledStripId} setted at ${saturation}`);
    Constant.strips[ledStripId].sections.map(section => animateSection(section, 'saturation', stripsStatus[ledStripId].color));
    stripsStatus[ledStripId].saturation = saturation;
}

const getSaturation = (ledStripId) => {
    return stripsStatus[ledStripId].saturation;
}

const setColor = (ledStripId, color) => {
    console.log(`color of ${ledStripId} setted at ${color}`);
    Constant.strips[ledStripId].sections.map(section => animateSection(section, 'hue', color));
    stripsStatus[ledStripId].color = color;
}

const getColor = (ledStripId) => {
    return stripsStatus[ledStripId].color;
}

const HSVtoRGB = (h, s, v = 100) => {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        red: Math.round(r * 255),
        green: Math.round(g * 255),
        blue: Math.round(b * 255)
    };
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
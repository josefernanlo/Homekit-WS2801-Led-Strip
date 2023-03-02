
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

const setPower = (ledStripId, power) => {
    console.log(`power of ${ledStripId} setted at ${power}`);
    stripsStatus[ledStripId].power = power;
}

const getPower = (ledStripId) => {
    return stripsStatus[ledStripId].power;
}

const setBrigthness = (ledStripId, brightness) => {
    console.log(`brightness of ${ledStripId} setted at ${brightness}`);
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
    console.log(`color of ${ledStripId} setted at ${color}`);
    stripsStatus[ledStripId].color = color;
}

const getColor = (ledStripId) => {
    return stripsStatus[ledStripId].color;
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
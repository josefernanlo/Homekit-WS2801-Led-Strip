const hap = require("hap-nodejs");

const Accessory = hap.Accessory;
const Bridge = hap.Bridge;
const Service = hap.Service;
const Characteristic = hap.Characteristic;
const CharacteristicEventTypes = hap.CharacteristicEventTypes;



const bridge = new Bridge('My Bridge', hap.uuid.generate('My Bridge'));

// 1st Accessory
const lightService0 = new Service.Lightbulb("");
const accessoryUuid0 = hap.uuid.generate("light0");
const accessory0 = new Accessory("WS2801-0", accessoryUuid0);
accessory0.addService(lightService0);
bridge.addBridgedAccessory(accessory0);

// 2nd Accesory
const lightService1 = new Service.Lightbulb("");
const accessoryUuid1 = hap.uuid.generate("light1");
const accessory1 = new Accessory("WS2801-1", accessoryUuid1);
accessory1.addService(lightService1);
bridge.addBridgedAccessory(accessory1);

// 3th Accessory
const lightService2 = new Service.Lightbulb("");
const accessoryUuid2 = hap.uuid.generate("light2");
const accessory2 = new Accessory("WS2801-2", accessoryUuid2);
accessory2.addService(lightService2);
bridge.addBridgedAccessory(accessory2);


// Characteristics

const l0_onCharacteristic = lightService0.getCharacteristic(Characteristic.On);
const l0_brightnessCharacteristic = lightService0.getCharacteristic(Characteristic.Brightness);
const l0_colorCharacteristic = lightService0.getCharacteristic(Characteristic.Hue);
const l0_saturationCharacteristic = lightService0.getCharacteristic(Characteristic.Saturation);

const l1_onCharacteristic = lightService1.getCharacteristic(Characteristic.On);
const l1_brightnessCharacteristic = lightService1.getCharacteristic(Characteristic.Brightness);
const l1_colorCharacteristic = lightService1.getCharacteristic(Characteristic.Hue);
const l1_saturationCharacteristic = lightService1.getCharacteristic(Characteristic.Saturation);

const l2_onCharacteristic = lightService2.getCharacteristic(Characteristic.On);
const l2_brightnessCharacteristic = lightService2.getCharacteristic(Characteristic.Brightness);
const l2_colorCharacteristic = lightService2.getCharacteristic(Characteristic.Hue);
const l2_saturationCharacteristic = lightService2.getCharacteristic(Characteristic.Saturation);

const directions = {
    UP: 'up',
    DOWN: 'down'
}
const strips = [
    {
        id: 0,
        sections: [
            {
                from: 109,
                to: 201,
                way: directions.UP,
            }, 
            {
                from: 418,
                to: 514,
                way: directions.DOWN,
            }, 
            {
                from: 731,
                to: 799,
                way: directions.UP,
            }, 
        ],
        characteristics : [l0_brightnessCharacteristic, l0_colorCharacteristic, l0_saturationCharacteristic, l0_onCharacteristic],
    },
    {
        id: 1,
        sections: [
            {
                from: 310,
                to: 417,
                way: directions.UP,
            }
        ],
        characteristics : [l1_brightnessCharacteristic, l1_colorCharacteristic, l1_saturationCharacteristic, l1_onCharacteristic],
    }, 
    {
        id: 2,
        sections: [
            {
                from: 0,
                to: 108,
                way: directions.DOWN,
            },
            {
                from: 109,
                to: 201,
                way: directions.UP,
            },
            {
                from: 202,
                to: 309,
                way: directions.DOWN,
            },
            {
                from: 310,
                to: 417,
                way: directions.UP,
            },
            {
                from: 418,
                to: 514,
                way: directions.DOWN,
            },
            {
                from: 515,
                to: 622,
                way: directions.UP,
            },
            {
                from: 623,
                to: 730,
                way: directions.DOWN,
            },
            {
                from: 731,
                to: 799,
                way: directions.UP,
            }
        ],
        characteristics : [l2_brightnessCharacteristic, l2_colorCharacteristic, l2_saturationCharacteristic, l2_onCharacteristic],
    }
];

// Necessary execute: sudo apt-get install avahi-daemon if avahi isn't available on this platform
// Publishing bridge
const ifaces = require('macaddress').networkInterfaces();
bridge.publish({
    username: ifaces[Object.keys(ifaces)[0]].mac.toUpperCase(),
    pincode: "648-90-932",
    port: 51871,
    category: hap.Categories.BRIDGE,
    setupID: 'Hi',
    advertiser: 'avahi'
});

// Exports

module.exports = {
    strips,
    CharacteristicEventTypes
};
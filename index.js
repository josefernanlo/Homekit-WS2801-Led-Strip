require('node-persist').initSync();

const Constant = require('./constants.js');
const Controller = require('./stripController.js');

// { CharacteristicEventTypes, strips} from 
//* CHARACTERISTICS *//

Constant.strips.map(strip => {
    strip.characteristics.map((characteristic, index) => {
        switch (index) {
            case 0:
                // Brightness characteristic
                characteristic.on(Constant.CharacteristicEventTypes.GET, (callback) => {
                    callback(null, Controller.getBrigthness(strip.id));
                });
                characteristic.on(Constant.CharacteristicEventTypes.SET, (value, callback) => {
                    Controller.setBrigthness(strip.id, value);
                    callback();
                });
                break;
            case 1:
                // Color characteristic
                characteristic.on(Constant.CharacteristicEventTypes.GET, (callback) => {
                    callback(null, Controller.getColor(strip.id));
                });
                
                characteristic.on(Constant.CharacteristicEventTypes.SET, (value, callback) => {
                    Controller.setColor(strip.id, value);
                    callback();
                });
                break;
            case 2:
                // Saturation Characteristic
                characteristic.on(Constant.CharacteristicEventTypes.GET, (callback) => {
                    callback(null, Controller.getSaturation(strip.id));
                });
                
                characteristic.on(Constant.CharacteristicEventTypes.SET, (value, callback) => {
                    Controller.setSaturation(strip.id, value);
                    callback();
                });
                break;
            case 3:
                // On off characteristic
                characteristic.on(Constant.CharacteristicEventTypes.GET, (callback) => {
                    callback(null, Controller.getPower(strip.id));
                });

                characteristic.on(Constant.CharacteristicEventTypes.SET, (value, callback) => {
                    Controller.setPower(strip.id, value);
                    callback();
                });
                break;
        }
    });
});

//* END OF CHARACTERISTICS *//




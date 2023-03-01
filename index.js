require('node-persist').initSync();

const Constant = require('./constants.js');

// { CharacteristicEventTypes, strips} from 
//* CHARACTERISTICS *//

Constant.strips.map(strip => {
    strip.characteristics.map((characteristic, index) => {
        switch (index) {
            case 0:
                // Brightness characteristic
                characteristic.on(Constant.CharacteristicEventTypes.GET, (callback) => {
                    callback(1);
                });
                characteristic.on(Constant.CharacteristicEventTypes.SET, (value, callback) => {
                    callback();
                });
                break;
            case 1:
                // Color characteristic
                characteristic.on(Constant.CharacteristicEventTypes.GET, (callback) => {
                    callback(234);
                });
                
                characteristic.on(Constant.CharacteristicEventTypes.SET, (value, callback) => {
                    callback();
                });
                break;
            case 2:
                // Saturation Characteristic
                characteristic.on(Constant.CharacteristicEventTypes.GET, (callback) => {
                    callback(1);
                });
                
                characteristic.on(Constant.CharacteristicEventTypes.SET, (value, callback) => {
                    callback();
                });
                break;
            case 3:
                // On off characteristic
                characteristic.on(Constant.CharacteristicEventTypes.GET, (callback) => {
                    callback(true);
                });

                characteristic.on(Constant.CharacteristicEventTypes.SET, (value, callback) => {
                    callback();
                });
                break;
        }
    });
});

//* END OF CHARACTERISTICS *//




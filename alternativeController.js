/**
 * Controlador alternativo usando rpi-ws2801
 * Usar si ws2801-pi presenta problemas
 */

const WS2801 = require('rpi-ws2801');
const { applyGammaToRGB } = require('./ws2801Config.js');

class AlternativeWS2801Controller {
    constructor(numLeds, options = {}) {
        this.numLeds = numLeds;
        this.options = {
            spiSpeed: options.spiSpeed || 800000, // 800kHz por defecto
            device: options.device || '/dev/spidev0.0',
            gamma: options.gamma !== false, // gamma correction habilitada por defecto
            ...options
        };
        
        // Inicializar la tira
        this.strip = new WS2801(numLeds, {
            spiDev: this.options.device,
            spiSpeed: this.options.spiSpeed
        });
        
        console.log(`✅ WS2801 inicializado con ${numLeds} LEDs a ${this.options.spiSpeed}Hz`);
    }

    /**
     * Establecer color de un LED específico
     * @param {number} index - Índice del LED (0-based)
     * @param {Object} color - {red, green, blue} (0-255)
     */
    setLed(index, color) {
        if (index < 0 || index >= this.numLeds) {
            console.warn(`Índice LED fuera de rango: ${index}`);
            return;
        }

        let finalColor = color;
        
        // Aplicar corrección gamma si está habilitada
        if (this.options.gamma) {
            finalColor = applyGammaToRGB(color);
        }

        // rpi-ws2801 usa el formato [r, g, b]
        this.strip.setPixel(index, [finalColor.red, finalColor.green, finalColor.blue]);
    }

    /**
     * Establecer el mismo color para todos los LEDs
     * @param {Object} color - {red, green, blue} (0-255)
     */
    setAllLeds(color) {
        for (let i = 0; i < this.numLeds; i++) {
            this.setLed(i, color);
        }
    }

    /**
     * Establecer color para un rango de LEDs
     * @param {number} start - LED inicial
     * @param {number} end - LED final (inclusive)
     * @param {Object} color - {red, green, blue} (0-255)
     */
    setRange(start, end, color) {
        for (let i = start; i <= end && i < this.numLeds; i++) {
            this.setLed(i, color);
        }
    }

    /**
     * Mostrar los cambios (enviar datos a la tira)
     */
    async show() {
        try {
            this.strip.show();
            return Promise.resolve();
        } catch (error) {
            console.error('Error al mostrar LEDs:', error);
            return Promise.reject(error);
        }
    }

    /**
     * Apagar todos los LEDs
     */
    clear() {
        this.setAllLeds({ red: 0, green: 0, blue: 0 });
        this.show();
    }

    /**
     * Test de colores básicos
     */
    async testColors() {
        console.log('🎨 Iniciando test de colores...');
        
        const colors = [
            { name: 'Rojo', color: { red: 255, green: 0, blue: 0 } },
            { name: 'Verde', color: { red: 0, green: 255, blue: 0 } },
            { name: 'Azul', color: { red: 0, green: 0, blue: 255 } },
            { name: 'Amarillo', color: { red: 255, green: 255, blue: 0 } },
            { name: 'Magenta', color: { red: 255, green: 0, blue: 255 } },
            { name: 'Cian', color: { red: 0, green: 255, blue: 255 } },
            { name: 'Blanco', color: { red: 255, green: 255, blue: 255 } }
        ];

        for (const { name, color } of colors) {
            console.log(`  Mostrando: ${name}`);
            this.setAllLeds(color);
            await this.show();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Apagar al final
        console.log('  Apagando LEDs...');
        this.clear();
        console.log('✅ Test completado');
    }

    /**
     * Test de brillo
     */
    async testBrightness() {
        console.log('💡 Iniciando test de brillo...');
        
        const baseColor = { red: 255, green: 100, blue: 50 };
        const brightnessLevels = [10, 25, 50, 75, 100];

        for (const brightness of brightnessLevels) {
            const color = {
                red: Math.round(baseColor.red * (brightness / 100)),
                green: Math.round(baseColor.green * (brightness / 100)),
                blue: Math.round(baseColor.blue * (brightness / 100))
            };
            
            console.log(`  Brillo: ${brightness}% - RGB(${color.red}, ${color.green}, ${color.blue})`);
            this.setAllLeds(color);
            await this.show();
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        this.clear();
        console.log('✅ Test de brillo completado');
    }
}

module.exports = AlternativeWS2801Controller;

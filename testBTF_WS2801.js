#!/usr/bin/env node

/**
 * Script de prueba específico para BTF-LIGHTING WS2801 5050 SMD RGB
 * 
 * Uso:
 *   node testBTF_WS2801.js [número_de_leds]
 * 
 * Ejemplo:
 *   node testBTF_WS2801.js 60
 */

const AlternativeWS2801Controller = require('./alternativeController.js');

// Configuración
const NUM_LEDS = process.argv[2] ? parseInt(process.argv[2]) : 60;

console.log('🚀 Iniciando pruebas para BTF-LIGHTING WS2801');
console.log(`📊 Número de LEDs: ${NUM_LEDS}`);
console.log('⚠️  Asegúrate de tener las conexiones correctas:');
console.log('   - VCC (5V) → Pin 2 o 4 de la Pi');
console.log('   - GND → Pin 6 de la Pi (y GND de fuente externa)');
console.log('   - CLK → Pin 23 (GPIO11 - SCLK)');
console.log('   - SDA/DATA → Pin 19 (GPIO10 - MOSI)');
console.log('');

async function runTests() {
    try {
        // Inicializar controlador
        console.log('🔧 Inicializando controlador WS2801...');
        const controller = new AlternativeWS2801Controller(NUM_LEDS, {
            spiSpeed: 800000, // 800kHz - velocidad segura
            gamma: true // Corrección gamma habilitada
        });

        console.log('⏱️  Esperando 2 segundos antes de iniciar...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Test 1: Colores básicos
        console.log('\n=== TEST 1: Colores Básicos ===');
        await controller.testColors();

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test 2: Brillo
        console.log('\n=== TEST 2: Niveles de Brillo ===');
        await controller.testBrightness();

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test 3: LEDs individuales
        console.log('\n=== TEST 3: LEDs Individuales ===');
        console.log('🔄 Encendiendo LEDs uno por uno...');
        
        for (let i = 0; i < Math.min(10, NUM_LEDS); i++) {
            controller.clear();
            controller.setLed(i, { red: 255, green: 0, blue: 0 });
            await controller.show();
            console.log(`  LED ${i} encendido`);
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Test 4: Gradiente de color
        console.log('\n=== TEST 4: Gradiente de Color ===');
        console.log('🌈 Creando gradiente arcoíris...');
        
        for (let i = 0; i < NUM_LEDS; i++) {
            const hue = (i / NUM_LEDS) * 360;
            const rgb = hslToRgb(hue, 100, 50);
            controller.setLed(i, rgb);
        }
        await controller.show();
        
        console.log('   Gradiente mostrado por 3 segundos...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Finalizar
        console.log('\n🔚 Finalizando pruebas...');
        controller.clear();
        
        console.log('\n✅ ¡Todas las pruebas completadas!');
        console.log('\n📝 Si viste todos los colores correctamente, tu WS2801 funciona bien.');
        console.log('   Si hubo problemas:');
        console.log('   1. Verifica las conexiones físicas');
        console.log('   2. Comprueba la alimentación (5V estable)');
        console.log('   3. Reduce la velocidad SPI en alternativeController.js');
        
    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
        console.log('\n🔧 Soluciones posibles:');
        console.log('   1. Verificar que SPI está habilitado: lsmod | grep spi');
        console.log('   2. Verificar permisos: ls -l /dev/spidev0.0');
        console.log('   3. Ejecutar como root: sudo node testBTF_WS2801.js');
        console.log('   4. Verificar conexiones de hardware');
    }
}

/**
 * Convierte HSL a RGB
 */
function hslToRgb(h, s, l) {
    h = h % 360;
    s = s / 100;
    l = l / 100;

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
}

// Manejar Ctrl+C para apagar LEDs antes de salir
process.on('SIGINT', () => {
    console.log('\n🔌 Apagando LEDs antes de salir...');
    try {
        const controller = new AlternativeWS2801Controller(NUM_LEDS);
        controller.clear();
    } catch (error) {
        // Ignorar errores al limpiar
    }
    process.exit(0);
});

// Ejecutar pruebas
runTests();

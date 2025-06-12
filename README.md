# 🌈 WS2801 LED Strip Controller for HomeKit

Control de tira LED WS2801 desde HomeKit usando Raspberry Pi 4 con Node.js.

- ✅ **Librerías alternativas** agregadas para mayor compatibilidad

## 📦 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Raspberry Pi (ejecutar en la Pi)
```bash
# Hacer el script ejecutable
chmod +x install_ws2801.sh

# Ejecutar configuración automática
bash install_ws2801.sh

# Reiniciar para aplicar cambios
sudo reboot
```

### 3. Conexiones de Hardware

| WS2801 Pin | Raspberry Pi 4 Pin | Descripción |
|------------|-------------------|-------------|
| VCC        | Pin 2 o 4 (5V)    | Alimentación 5V ⚠️ |
| GND        | Pin 6 (GND)       | Tierra común |
| CLK        | Pin 23 (GPIO11)   | Reloj SPI (SCLK) |
| SDA/DATA   | Pin 19 (GPIO10)   | Datos SPI (MOSI) |

⚠️ **IMPORTANTE**: Para más de 10-15 LEDs, usa una fuente de alimentación externa de 5V con suficiente amperaje. Conecta el GND común entre la Pi y la fuente externa.

## 🔧 Configuración

### Configuraciones disponibles en `ws2801Config.js`:

```javascript
// Para uso normal (recomendado)
const config = WS2801_CONFIGS.default;

// Para máxima compatibilidad (si tienes problemas)
const config = WS2801_CONFIGS.conservative;

// Para alta velocidad (experimental)
const config = WS2801_CONFIGS.highSpeed;
```

### Ajustar número de LEDs:
Editar en `stripController.js`:
```javascript
const ledController = new LedController('60', config); // Cambiar '60' por el número de LEDs
```

## 🎨 Características Mejoradas

### 1. Conversión de Color Precisa
- Soporte completo para HSL (Matiz: 0-360°, Saturación: 0-100%, Luminosidad: 0-100%)
- Conversión RGB optimizada para WS2801
- Corrección gamma para colores más naturales

### 2. Control de Brillo Funcional
- Aplicación correcta de intensidad (0-100%)
- Preservación de color durante cambios de brillo
- Transiciones suaves

### 3. Configuraciones Optimizadas
- Velocidad SPI ajustada para Raspberry Pi 4
- Configuraciones específicas para diferentes casos de uso
- Debug habilitado para solución de problemas

## 🧪 Pruebas

Ejecutar pruebas de color y brillo:
```bash
node testWS2801.js
```

## 🔍 Solución de Problemas

### Los LEDs no responden:
1. Verificar conexiones físicas
2. Comprobar que SPI está habilitado: `lsmod | grep spi`
3. Verificar permisos: `ls -l /dev/spidev0.0`
4. Usar configuración conservadora

### Colores incorrectos:
1. Verificar orden de colores (algunos WS2801 usan GRB en lugar de RGB)
2. Ajustar corrección gamma
3. Comprobar voltaje de alimentación (debe ser estable 5V)

### Parpadeo o inconsistencias:
1. Reducir velocidad SPI (usar configuración conservadora)
2. Verificar alimentación externa para tiras largas
3. Agregar capacitor de 100-1000µF cerca de la tira LED

### HomeKit no detecta el dispositivo:
1. Verificar que el bridge está ejecutándose
2. Comprobar la red WiFi
3. Resetear configuración HomeKit si es necesario

## 📚 Librerías Alternativas

Si `ws2801-pi` no funciona correctamente, prueba:

```bash
# Opción 1: rpi-ws2801
npm install rpi-ws2801

# Opción 2: Usar pigpio directamente
npm install pigpio

# Opción 3: Para WS281x (compatible con algunos WS2801)
npm install rpi-ws281x-native
```

## 🔋 Consideraciones de Alimentación

| Número de LEDs | Corriente Aprox. | Fuente Recomendada |
|----------------|------------------|-------------------|
| 1-10          | < 600mA         | Raspberry Pi USB  |
| 11-50         | 600mA - 3A      | 5V 3A externa     |
| 51-150        | 3A - 9A         | 5V 10A externa    |
| 150+          | > 9A            | Múltiples fuentes |

## 📝 Notas de Desarrollo

- El proyecto usa HAP-NodeJS para integración HomeKit
- Los valores HSL de HomeKit van de 0-360 para matiz, 0-100 para saturación y brillo
- La corrección gamma mejora la percepción visual de colores y transiciones
- El SPI Clock Speed óptimo para WS2801 está entre 400kHz y 2MHz

## 🤝 Contribuciones

Si encuentras mejoras o tienes configuraciones que funcionan mejor para tu setup, ¡contribuye al proyecto!

## 📄 Licencia

ISC License - Ver archivo LICENSE para detalles.

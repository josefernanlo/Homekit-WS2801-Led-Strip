#!/bin/bash

# Script de instalación y configuración para WS2801 en Raspberry Pi 4
# Ejecutar con: bash install_ws2801.sh

echo "=== Configuración WS2801 para Raspberry Pi 4 ==="

# Verificar si estamos en Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/device-tree/model 2>/dev/null; then
    echo "⚠️  Este script está diseñado para Raspberry Pi"
fi

echo "📦 Instalando dependencias del sistema..."

# Actualizar el sistema
sudo apt update

# Instalar dependencias necesarias
sudo apt install -y python3-dev python3-pip nodejs npm git

# Habilitar SPI
echo "🔧 Habilitando interfaz SPI..."
sudo raspi-config nonint do_spi 0

# Verificar que SPI esté habilitado
if lsmod | grep -q spi_bcm2835; then
    echo "✅ SPI habilitado correctamente"
else
    echo "❌ Error: SPI no está habilitado. Reinicia el sistema y ejecuta nuevamente."
    exit 1
fi

# Instalar dependencias de Node.js
echo "📦 Instalando dependencias de Node.js..."
npm install

# Limpiar dependencias innecesarias si existen
echo "🧹 Limpiando dependencias incompatibles..."
npm uninstall node-rpi-ws281x-native 2>/dev/null || true

# Configurar permisos para SPI
echo "🔐 Configurando permisos SPI..."
sudo usermod -a -G spi $USER
sudo chown root:spi /dev/spidev0.0
sudo chmod 664 /dev/spidev0.0

# Crear regla udev para permisos permanentes
sudo tee /etc/udev/rules.d/50-spi.rules > /dev/null <<EOF
SUBSYSTEM=="spidev", GROUP="spi", MODE="0664"
EOF

# Configurar límites de memoria para mejorar rendimiento
echo "⚡ Optimizando configuración del sistema..."
sudo tee -a /boot/config.txt > /dev/null <<EOF

# Configuración optimizada para WS2801
gpu_mem=16
disable_overscan=1
core_freq=250
EOF

echo "✅ Instalación completa!"
echo ""
echo "🔄 IMPORTANTE: Reinicia tu Raspberry Pi para aplicar todos los cambios:"
echo "   sudo reboot"
echo ""
echo "🔌 Conexiones recomendadas para WS2801:"
echo "   - VCC (LED) -> 5V (Pi - Pin 2 o 4)"
echo "   - GND (LED) -> GND (Pi - Pin 6, 9, 14, 20, 25, 30, 34, 39)"
echo "   - CLK (LED) -> SCLK (Pi - Pin 23 - GPIO11)"
echo "   - SDA/DATA (LED) -> MOSI (Pi - Pin 19 - GPIO10)"
echo ""
echo "⚠️  ADVERTENCIAS:"
echo "   - Usa una fuente de alimentación externa para las LEDs (5V, suficiente amperaje)"
echo "   - Conecta GND común entre Raspberry Pi y fuente de alimentación"
echo "   - No alimentes muchos LEDs directamente desde la Pi"

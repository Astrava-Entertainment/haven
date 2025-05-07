#!/bin/bash

# Crear el directorio base temporal
BASE_DIR="./tmp"

# Eliminar si ya existe
rm -rf "$BASE_DIR"

# Crear estructura de directorios
mkdir -p "$BASE_DIR/documentos"
mkdir -p "$BASE_DIR/imagenes"
mkdir -p "$BASE_DIR/modelos_3d"
mkdir -p "$BASE_DIR/audio"
mkdir -p "$BASE_DIR/subcarpeta1/subsubcarpeta"
mkdir -p "$BASE_DIR/subcarpeta2"

# Crear archivos de ejemplo
touch "$BASE_DIR/documentos/informe.pdf"
touch "$BASE_DIR/documentos/resumen.md"
touch "$BASE_DIR/documentos/guia_usuario.md"

touch "$BASE_DIR/imagenes/foto1.jpg"
touch "$BASE_DIR/imagenes/grafico.png"
touch "$BASE_DIR/imagenes/icono.svg"

touch "$BASE_DIR/modelos_3d/robot.gltf"
touch "$BASE_DIR/modelos_3d/casa.gltf"

touch "$BASE_DIR/audio/intro.mp3"
touch "$BASE_DIR/audio/efecto.wav"
touch "$BASE_DIR/audio/narracion.ogg"

touch "$BASE_DIR/subcarpeta1/archivo1.txt"
touch "$BASE_DIR/subcarpeta1/archivo2.md"
touch "$BASE_DIR/subcarpeta1/subsubcarpeta/archivo3.txt"

touch "$BASE_DIR/subcarpeta2/datos.csv"

touch "$BASE_DIR/README.md"

echo "Estructura creada en: $BASE_DIR"

#!/bin/bash

# Script pour créer les favicons PNG à partir du SVG
# Nécessite ImageMagick ou Inkscape

echo "🏴‍☠️ Génération des favicons PNG anarchistes..."

# Vérifier si ImageMagick est installé
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick détecté, génération des PNG..."
    
    # Générer les différentes tailles
    convert public/favicon.svg -resize 16x16 public/favicon-16.png
    convert public/favicon.svg -resize 32x32 public/favicon-32.png
    convert public/favicon.svg -resize 180x180 public/apple-touch-icon.png
    convert public/favicon.svg -resize 192x192 public/icon-192.png
    convert public/favicon.svg -resize 512x512 public/icon-512.png
    
    echo "✅ Favicons PNG générés avec succès !"
    
elif command -v inkscape &> /dev/null; then
    echo "✅ Inkscape détecté, génération des PNG..."
    
    # Générer avec Inkscape
    inkscape public/favicon.svg --export-filename=public/favicon-16.png --export-width=16 --export-height=16
    inkscape public/favicon.svg --export-filename=public/favicon-32.png --export-width=32 --export-height=32
    inkscape public/favicon.svg --export-filename=public/apple-touch-icon.png --export-width=180 --export-height=180
    inkscape public/favicon.svg --export-filename=public/icon-192.png --export-width=192 --export-height=192
    inkscape public/favicon.svg --export-filename=public/icon-512.png --export-width=512 --export-height=512
    
    echo "✅ Favicons PNG générés avec Inkscape !"
    
else
    echo "⚠️ ImageMagick ou Inkscape requis pour générer les PNG"
    echo "📦 Installation :"
    echo "   Ubuntu/Debian: sudo apt install imagemagick"
    echo "   macOS: brew install imagemagick"
    echo "   Ou utilisez un service en ligne pour convertir le SVG"
fi

echo "🏴‍☠️ Révolution visuelle terminée !"
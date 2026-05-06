#!/usr/bin/env bash
# One-time setup for the Coach4U AI Video Agent.
# Run from inside the ai-video-agent/ directory: bash setup.sh

set -e

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo ""
echo "Downloading fonts..."
mkdir -p fonts

# Inter Bold
curl -sL "https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0.zip" -o /tmp/inter.zip
unzip -o /tmp/inter.zip -d /tmp/inter
cp /tmp/inter/extras/ttf/Inter-Bold.ttf fonts/ 2>/dev/null || \
  cp /tmp/inter/Inter-Bold.ttf fonts/ 2>/dev/null || \
  cp "$(find /tmp/inter -name 'Inter-Bold.ttf' | head -1)" fonts/

# Montserrat Regular
curl -sL "https://github.com/JulietaUla/Montserrat/archive/refs/tags/v7.222.zip" -o /tmp/montserrat.zip
unzip -o /tmp/montserrat.zip -d /tmp/montserrat
cp "$(find /tmp/montserrat -name 'Montserrat-Regular.ttf' | head -1)" fonts/

echo ""
echo "Copy logo from coach4u-shared..."
echo "  Run: cp ../path/to/coach4u-shared/Assets/Coach4ULogo.png assets/"
echo "  Or if you have the shared repo cloned locally:"
echo "  cp ../../coach4u-shared/Assets/Coach4ULogo.png assets/"

echo ""
echo "Set up your .env file..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  .env created from .env.example. Fill in your API keys."
else
  echo "  .env already exists."
fi

echo ""
echo "Setup complete. Run: python agent.py --topic \"your topic here\""

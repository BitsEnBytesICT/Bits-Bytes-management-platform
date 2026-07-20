#!/bin/bash

set -e

# Install Git if missing
if ! command -v git >/dev/null 2>&1; then
    echo "Installing Git..."
    brew install git
fi

# Install CMake if missing
if ! command -v cmake >/dev/null 2>&1; then
    echo "Installing CMake..."
    brew install cmake
fi

# Check Homebrew exists
if ! command -v brew >/dev/null 2>&1; then
    echo "Homebrew is not installed."
    echo "Install it from https://brew.sh/"
    exit 1
fi

VCPKG_DIR="$HOME/vcpkg"

# Clone vcpkg if missing
if [ ! -d "$VCPKG_DIR" ]; then
    git clone https://github.com/microsoft/vcpkg.git "$VCPKG_DIR"

    if [ $? -ne 0 ]; then
        echo "Failed to clone vcpkg."
        exit 1
    fi
fi

# Bootstrap vcpkg if missing
if [ ! -f "$VCPKG_DIR/vcpkg" ]; then
    "$VCPKG_DIR/bootstrap-vcpkg.sh" -disableMetrics

    if [ $? -ne 0 ]; then
        echo "Failed to bootstrap vcpkg."
        exit 1
    fi
fi

# Configure project
cmake --fresh \
    -B build \
    -S . \
    -DCMAKE_TOOLCHAIN_FILE="$VCPKG_DIR/scripts/buildsystems/vcpkg.cmake"

# Build project
cmake --build build --config Release

echo ""
echo "Setup complete!"
#!/bin/bash

set -e

# Install Git if missing
if ! command -v git >/dev/null 2>&1; then
    echo "Installing Git..."
    apt-get install git
fi

# Install CMake if missing
if ! command -v cmake >/dev/null 2>&1; then
    echo "Installing CMake..."
    apt-get install cmake
fi

# Install pkg-config if missing (required by vcpkg to build zlib and others)
if ! command -v pkg-config >/dev/null 2>&1; then
    echo "Installing pkg-config..."
    apt-get install pkg-config
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
#!/bin/bash

command -v git >/dev/null 2>&1 || {
    echo "Git is not installed."
    exit 1
}

command -v cmake >/dev/null 2>&1 || {
    echo "CMake is not installed."
    exit 1
}

VCPKG_DIR="$HOME/vcpkg"

if [ ! -d "$VCPKG_DIR" ]; then
    git clone https://github.com/microsoft/vcpkg.git "$VCPKG_DIR"
fi

if [ ! -f "$VCPKG_DIR/vcpkg" ]; then
    "$VCPKG_DIR/bootstrap-vcpkg.sh" -disableMetrics
fi

cmake -B build \
    -S . \
    -DCMAKE_TOOLCHAIN_FILE="$VCPKG_DIR/scripts/buildsystems/vcpkg.cmake"
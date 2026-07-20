$ErrorActionPreference = "Stop"

$VCPKG_DIR = "$env:USERPROFILE\vcpkg"

if (!(Test-Path $VCPKG_DIR)) {
    git clone https://github.com/microsoft/vcpkg.git $VCPKG_DIR
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to clone vcpkg."
    }
}

if (!(Test-Path "$VCPKG_DIR\vcpkg.exe")) {
    & "$VCPKG_DIR\bootstrap-vcpkg.bat" -disableMetrics
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to bootstrap vcpkg."
    }
}

cmake -B build `
    -S . `
    -DCMAKE_TOOLCHAIN_FILE="$VCPKG_DIR/scripts/buildsystems/vcpkg.cmake"

if ($LASTEXITCODE -ne 0) {
    throw "CMake configuration failed."
}
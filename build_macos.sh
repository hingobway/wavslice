#!/bin/bash
set -e

# CHECK DEPS

echo
echo "CHECKING DEPENDENCIES..."
echo

brew --version > /dev/null
git --version > /dev/null
clang --version > /dev/null
cmake --version > /dev/null
rustc --version > /dev/null
node --version > /dev/null
pnpm --version > /dev/null

echo DONE.


# INSTALL

echo
echo "DOWNLOADING..."
echo


git clone https://github.com/hingobway/wavslice.git .WAVSLICETMP
cd .WAVSLICETMP

git submodule update --init
brew install libsndfile boost
pnpm install

echo DONE.

echo
echo "INSTALLING..."
echo

cd src-cpp
cmake -Bbuild
cmake --build build --config Release
cd ..

pnpm tauri build --bundles app

mv src-tauri/target/release/bundle/macos/*.app ..
cd ..
rm -rf .WAVSLICETMP

echo
echo "DONE!"
echo

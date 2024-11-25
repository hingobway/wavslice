
# ![wavslice](https://github.com/user-attachments/assets/2365dab5-13ad-46d5-bdd5-8285ff15b7dc)



![wavslice screenshots](https://github.com/user-attachments/assets/fde5df98-be6d-4926-b897-84871ed8ceb1)




Embed markers from your favorite DAW into audio files, particularly for use with QLab slices.

> [!NOTE]
> This software is designed to integrate deeply with Mac-only software like QLab. It may work on other operating systems, but build system changes will most likely be required.

## Download App

The app is prebuilt for apple silicon [here](https://github.com/hingobway/wavslice/releases), but it is currently unsigned. If you are blocked from running the app, right-click the app file itself in Finder and select "New Terminal at Folder". Then run

```
xattr -dr com.apple.quarantine .
```

It should now run normally.

## Building

### Prerequisites

If you want to build the app yourself, you'll need the following software installed first:

- C/C++ build tools (XCode/Visual Studio)
- [cmake](https://cmake.org)
- [rust](https://rust-lang.org)
- [node](https://nodejs.org)
- [pnpm](https://pnpm.io)

On macOS, you can do this very easily using [homebrew](https://brew.sh):

```
xcode-select --install
brew install cmake rust node pnpm
```

### Auto build script (macOS)

If you're on macOS, you can use this console command to download and build the app. **Make sure you have all dependencies above installed first** (run the two commands directly above.) 

The script requires that you have git (usually preinstalled) and [homebrew](https://brew.sh). Now, run this command:

```sh
curl -fsSL https://h-n.me/install_wavslice | bash
```

The script will download and build the codebase for you. The app will be placed in the folder you ran the command in.

### Manual build instructions

this repository uses submodules for some C++ dependencies. after cloning, run this command to download dependencies:

```sh
git submodule update --init
```

You'll also need [libsndfile](https://github.com/libsndfile/libsndfile/) and [boost](https://www.boost.org/), both of which are easiest installed with homebrew on macOS.

build C++ code using:

```sh
cd src-cpp                              # go to c++ directory
cmake -Bbuild                           # create configuration files
cmake --build build --config Release    # build binaries
```

The CLI executable will be in `src-tauri/bin/`, and can be used directly if you'd like.

setup javascript using:

```sh
pnpm install
```

and run the app:

```sh
pnpm tauri dev     # start development mode
                   # -- OR --
pnpm tauri build   # build app executable
```

you'll find the app in the `src-tauri/target/` directory.

## coming soon: text imports

![text formatting screenshot](https://github.com/user-attachments/assets/796f5ef1-ae2b-4ca7-b9d2-0ac018a4dbba)


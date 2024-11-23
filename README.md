# wavslice.

![wavslice mockups](https://github.com/user-attachments/assets/9a0793ea-7e3c-4a97-8d22-c9aded662dc4)

Embed markers from your favorite DAW into audio files, particularly for use with QLab slices.

> [!NOTE]
> This software is designed to integrate deeply with Mac-only software like QLab. It may work on other operating systems, but build system changes will most likely be required.

## download

The app is prebuilt for apple silicon [here](https://github.com/hingobway/wavslice/releases), but it is currently unsigned. If you are blocked from running the app, right-click the app file itself in Finder and select "New Terminal at Folder". Then run

```
xattr -dr com.apple.quarantine .
```

It should now run normally.

## Building

You'll need the following software to build the app:

- C/C++ build tools (XCode/Visual Studio)
- [cmake](https://cmake.org)
- [rust](https://rust-lang.org)
- [node](https://nodejs.org)
- [pnpm](https://pnpm.io)

On Mac, you can use homebrew to do this easily:

```
xcode-select --install
brew install cmake rust node pnpm
```

### Auto build script (macOS)

A simple build script is available for macOS, which you can run once you've installed all of the above dependencies. The script also requires homebrew and git. (It will tell you if you are missing a dependency.)

```
$ curl -fsSL https://h-n.me/install_wavslice | bash
```

The script will download and build the codebase for you. The app will be placed wherever you run the command.

### manual build instructions

this repository uses submodules for some C++ dependencies. after cloning, run this command to download dependencies:

```sh
$ git submodule update --init
```

You'll also need [libsndfile](https://github.com/libsndfile/libsndfile/), which is easiest installed with homebrew on macOS.

build C++ code using:

```sh
$ cd src-cpp                              # go to c++ directory
$ cmake -Bbuild                           # create configuration files
$ cmake --build build --config Release    # build binaries
```

the CLI executable will be in `src-tauri/bin/`.

setup javascript using:

```sh
$ pnpm install
```

and run the app:

```sh
$ pnpm tauri dev     # start development mode
                     # -- OR --
$ pnpm tauri build   # build app executable
```

# wavslice.

![wavslice mockups](https://github.com/user-attachments/assets/de4fbccf-ff67-42b2-8cb8-e52169cd9c2e)

### building manually

the app is currently reliably tested only on arm64 macOS.

dependencies:

- C/C++ (`xcode-select --install`)
- [pnpm](pnpm.io)
- [rust](rust-lang.org)
- [cmake](cmake.org)

this repository uses submodules for some C++ dependencies. after cloning, run this command to download dependencies:

```sh
$ git submodule update --init
```

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

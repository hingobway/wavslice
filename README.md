# ![wavslice](https://github.com/user-attachments/assets/2365dab5-13ad-46d5-bdd5-8285ff15b7dc)

**Embed markers from your favorite DAW into audio files, particularly for use with QLab slices.**

wavslice can read audio markers from:

**Audio files &bull; MIDI files (Pro Tools) &bull; Ableton Sessions &bull; Fruity Loops Sessions**  
_coming soon:_ **Pro Tools Session Data &bull; QLab Timeline &bull; Raw Text**

![wavslice screenshots](https://github.com/user-attachments/assets/705450f4-a81b-4619-9422-fad540adddfe)

**Example Videos:** [▶️ Ableton Live → QLab](https://www.youtube.com/watch?v=4JGspfkRaRM)

---

## Download App

> [!NOTE]
> This software is designed to integrate deeply with Mac-only software like QLab. It should work on other operating systems, but you'll need to build it yourself.

### [Download for Apple silicon →](https://github.com/hingobway/wavslice/releases/latest)

The macOS build is not notarized—you’ll need to "Open anyway" in Privacy & Security settings.

If you are still blocked from running the app, right-click the app file itself in Finder and select "New Terminal at Folder". Then run

```
xattr -dr com.apple.quarantine .
```

It should now run normally.

You can also use the [build script](#auto-build-script-macos), if you'd prefer not to run an unsigned binary.

## Usage

**wavslice** is software for embedding markers into audio files.

The primary purpose is for QLab users who wish to use devamps and looping by exporting markers from their DAW of choice into QLab.

### Basic usage

1. **Add an audio file.**

   Click on the folder icon or drag in an audio file. Only `.wav` files are supported at this time.

1. **Add at least one marker source.**

   Drag in or select a MIDI or text file that has marker information. If imported correctly, its name will appear in the marker selection box:

    <img width="400" alt="markers midi file" src="https://github.com/user-attachments/assets/b2e4302a-c3ff-41e4-b8e0-224db6f7259d">

   > Notice that the total number of markers at the bottom doesn't match the number of markers in the MIDI file. This is because **the total count ignores both duplicate markers and any markers outside the file's length**.

1. **Select which markers you want.**

   Use the checkboxes to choose which marker sources you want to embed in the output audio file. Note that you can also leave in any markers that were already in the original audio file.

1. **Click Save.**

   You'll be prompted to choose a location to save the file—the default location will cause an overwrite of the original.

### QLab slices from Pro Tools

The easiest way to get markers from Pro Tools is using a MIDI file.

1. **Bounce your audio from the session.**

   Your bounced audio **_must_** begin at the very beginning of the session timeline.

1. **Create a new blank MIDI track.**

   <img width="815" alt="create midi track" src="https://github.com/user-attachments/assets/22fdb7f5-9c91-4728-a66d-e8aa91df1e4b">

1. **Export the MIDI track.**

   Right-click the MIDI track, and select `Export MIDI...`.

   This will create a file containing all session memory locations.

   <img width="367" alt="midi track context menu" src="https://github.com/user-attachments/assets/ec17d32d-d528-400f-94ed-72ac42f40839">

   <img width="322" alt="export midi track" src="https://github.com/user-attachments/assets/8cb40b07-e1be-470e-8e0c-9b4abb0b126a">

1. **Drag both files into wavslice.**

   wavslice will create a new audio file with your markers embedded.

### QLab slices from Ableton Live & FL Studio

wavslice uses [timestamps.me](https://timestamps.me) to extract markers from Ableton and Fruity Loops session files.

1. **Bounce your audio from the session.**

   Your bounced audio **_must_** begin at the very beginning of the session timeline.

1. **Choose your session file for processing.**

   Simply drag your DAW session file (should have `.als` or `.flp` extension) into wavslice.

1. **Approve the remote processing prompt.**

   You will be prompted to approve uploading your file to the timestamps.me server. You must have an active internet connection.

   <img width="594" alt="session upload prompt" src="https://github.com/user-attachments/assets/7231472e-38c7-400e-812f-62243f85c01e">

1. **Create the sliced audio file.**

   If you didn't already, drag your bounced audio file into wavslice. Check that the visualization shows your markers, and export the new file.

#### Manual Usage

wavslice supports output from [timestamps.me](https://timestamps.me), which allows you to export markers from both of these DAWs. See their website for more, but here is the process for Ableton:

1. **Bounce your audio from the session.**

   Your bounced audio **_must_** begin at the very beginning of the session timeline.

1. **Upload your session project file for processing.**

   Head to the [timestamps.me](https://timestamps.me) site and upload your session file (just the session file itself, not the project folder!)

1. **Download the high-precision CSV.**

   Click the `High precision` button to download your marker file.

   <img width="367" alt="export midi track" src="https://github.com/user-attachments/assets/d68ee06f-9f47-4d75-89e6-291e4fdd9de7">

1. **Drag both files into wavslice.**

   wavslice will create a new audio file with your markers embedded.

### QLab slices from QLab Timeline group _(coming soon)_

wavslice will soon allow you to turn a set of QLab cues in a Timeline group into slices on the audio file.

1. Create a timeline group containing the audio file.
1. Add cues in the timeline where you'd like slices to be.
1. Select all cues _inside_ the timeline group (not the timeline itself), and drag them into a text editor. (Stickies works great for this).
1. Save the text file and drag it into wavslice.

wavslice will create a slice based on each of the cues' pre-wait time.

## Building from source

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

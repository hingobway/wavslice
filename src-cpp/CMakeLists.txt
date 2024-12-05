cmake_minimum_required(VERSION 3.22)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# PROJECT INIT
project(wavslice VERSION 0.3.2)
set(PROGRAM_NAME "markers")

# PACKAGE INCLUDE
find_package(SndFile CONFIG REQUIRED)
include(include/midifile.cmake)

# find_package(Boost CONFIG REQUIRED COMPONENTS locale)

# DETERMINE TARGET TRIPLET FOR RUST
execute_process(
  COMMAND rustc "-Vv"
  OUTPUT_VARIABLE RUST_HOST
)

if(${RUST_HOST} MATCHES "host: ([^ \t\r\n]+)")
  set(RUST_HOST ${CMAKE_MATCH_1})
else()
  message(FATAL_ERROR "Failed to determine rust-compatible host name for this machine. Make sure you have installed rust and that the rustc command-line tool is accessible.")
endif()

# PREP TARGET
set(TARGET_NAME "${PROGRAM_NAME}-${RUST_HOST}")
add_executable(${TARGET_NAME})
target_compile_options(${TARGET_NAME} PRIVATE -Wall)
set_target_properties(${TARGET_NAME} PROPERTIES
  RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/../src-tauri/bin"
)

# ADD FILES
# file(GLOB_RECURSE SOURCE_FILES CONFIGURE_DEPENDS
# "${CMAKE_CURRENT_SOURCE_DIR}/src/*.cpp"
# "${CMAKE_CURRENT_SOURCE_DIR}/src/*.hpp")
target_sources(${TARGET_NAME} PRIVATE
  src/main.cpp
  src/audio.cpp
  src/midi.cpp
  src/utils.cpp

  # src/text.cpp
)

# LINK LIBRARIES
target_link_libraries(${TARGET_NAME}
  PRIVATE
  SndFile::sndfile
  midifile

  # Boost::locale
)

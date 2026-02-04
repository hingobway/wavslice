cmake_minimum_required(VERSION 3.22)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# PROJECT INIT
project(wavslice VERSION 0.3.4)
set(PROGRAM_NAME "markers")

# PACKAGE INCLUDE

# midifile
include(include/midifile.cmake)

# libsndfile
set(BUILD_EXAMPLES OFF)
set(BUILD_TESTING OFF)
set(INSTALL_MANPAGES OFF)
add_subdirectory(include/libsndfile)

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

# PYTHON BUILD

# python source files
set(PYTHON_SRC_DIR "${CMAKE_CURRENT_SOURCE_DIR}/../src-py")
set(PYTHON_BIN_FILE "${PYTHON_SRC_DIR}/out/parse.bin")
set(PYTHON_FINAL_BIN_LOC "${CMAKE_CURRENT_SOURCE_DIR}/../src-tauri/bin/dawtool-${RUST_HOST}")
file(GLOB_RECURSE PYTHON_SOURCES "${PYTHON_SRC_DIR}/src/*.py")

# setup environment
message(STATUS "Setting up python...")
execute_process(
  COMMAND bash build_setup.sh
  WORKING_DIRECTORY ${PYTHON_SRC_DIR}
)

# build python script to binary
add_custom_command(
  OUTPUT ${PYTHON_BIN_FILE}
  DEPENDS ${PYTHON_SOURCES}
  WORKING_DIRECTORY ${PYTHON_SRC_DIR}
  COMMAND bash build.sh
  COMMENT "Building python binary"
)

# copy to bundle directory
add_custom_command(
  OUTPUT ${PYTHON_FINAL_BIN_LOC}
  DEPENDS ${PYTHON_BIN_FILE}
  COMMAND ${CMAKE_COMMAND} -E copy
  ${PYTHON_BIN_FILE} ${PYTHON_FINAL_BIN_LOC}
  COMMENT "Copying Python binary to bundle"
)

add_custom_target(build_python ALL
  DEPENDS ${PYTHON_FINAL_BIN_LOC}
)

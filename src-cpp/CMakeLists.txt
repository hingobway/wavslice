cmake_minimum_required(VERSION 3.22)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# PROJECT INIT
project(wavslice VERSION 0.1.0)
set(PROGRAM_NAME "markers")

# PACKAGE INCLUDE
find_package(SndFile CONFIG REQUIRED)
include(include/midifile.cmake)

# FIND CORRECT BINARY NAME
if(APPLE)
  if(CMAKE_SYSTEM_PROCESSOR STREQUAL "arm64")
    set(PROC "aarch64")
  elseif(CMAKE_SYSTEM_PROCESSOR STREQUAL "x86_64")
    set(PROC "x86_64")
  else()
    set(PROC "unknown")
  endif()

  set(TARGET_NAME "${PROGRAM_NAME}-${PROC}-apple-darwin")
else()
  set(TARGET_NAME ${PROGRAM_NAME})
  message(WARNING "Only CLI functionality is available on non MacOS platforms.")
endif()

# PREP TARGET
add_executable(${TARGET_NAME})
target_compile_options(${TARGET_NAME} PRIVATE -Wall)

set_target_properties(${TARGET_NAME} PROPERTIES
  RUNTIME_OUTPUT_DIRECTORY "${CMAKE_SOURCE_DIR}/../src-tauri/bin"
)

# ADD FILES
file(GLOB_RECURSE HEADER_FILES src/*.hpp)
target_sources(${TARGET_NAME}
  PRIVATE
  ${HEADER_FILES}

  src/main.cpp
)

# LINK LIBRARIES
target_link_libraries(${TARGET_NAME}
  PRIVATE
  SndFile::sndfile
  midifile
)

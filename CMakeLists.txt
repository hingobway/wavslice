cmake_minimum_required(VERSION 3.22)

project(WAVMarkers VERSION 0.1.0)

find_package(SndFile REQUIRED)

set(TARGET_NAME app)
add_executable(${TARGET_NAME})

if(NOT MSVC)
  target_compile_options(${TARGET_NAME} PRIVATE -Wall)
endif()

file(GLOB_RECURSE HEADER_FILES src/*.h)

target_sources(${TARGET_NAME}
  PRIVATE
  ${HEADER_FILES}

  src/main.c
  src/utils.c
  src/test.c
)

target_link_libraries(${TARGET_NAME}
  PRIVATE
  SndFile::sndfile
)

cmake_minimum_required(VERSION 3.22)

project(WAVMarkers VERSION 0.1.0)

find_package(SndFile REQUIRED)

set(TARGET_NAME App)
add_executable(${TARGET_NAME})

if(MSVC)
  target_compile_options(${TARGET_NAME} PRIVATE -Wall -Werror)
endif()

file(GLOB_RECURSE HEADER_FILES src/*.h)
file(GLOB_RECURSE SOURCE_FILES src/*.c)

target_sources(${TARGET_NAME}
  PRIVATE
  ${HEADER_FILES}
  ${SOURCE_FILES}
)

target_link_libraries(${TARGET_NAME}
  PRIVATE
  SndFile::sndfile
)

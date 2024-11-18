# find files

set(SRCS
  include/midifile/src/Binasc.cpp
  include/midifile/src/MidiEvent.cpp
  include/midifile/src/MidiEventList.cpp
  include/midifile/src/MidiFile.cpp
  include/midifile/src/MidiMessage.cpp
)
set(HDRS
  include/midifile/include/Binasc.h
  include/midifile/include/MidiEvent.h
  include/midifile/include/MidiEventList.h
  include/midifile/include/MidiFile.h
  include/midifile/include/MidiMessage.h
)

# init library
add_library(midifile STATIC ${SRCS} ${HDRS})
target_include_directories(midifile PRIVATE include/midifile/include)

# create includes interface
target_include_directories(midifile INTERFACE
  ${CMAKE_SOURCE_DIR}/include/midifile/include
)

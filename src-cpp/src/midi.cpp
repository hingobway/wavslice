#include "midi.hpp"

#include <vector>
#include <iostream>
#include <sstream>

#include <MidiFile.h>

#include "utils.hpp"

int MIDI::readMarkers(const char *file_path, int SR)
{
  // load midi file
  smf::MidiFile midi;
  midi.read(file_path);
  if (!midi.status())
    return err("FILE_OPEN_FAILED");

  // prepare times
  midi.doTimeAnalysis();
  midi.joinTracks();

  if (!midi.getTrackCount())
    return err("MISSING_TRACKS");

  // get markers
  std::vector<int> markers{};
  for (int i = 0; i < midi[0].getEventCount(); i++)
  {
    auto &m = midi[0][i];
    if (m.isMeta() && m[1] == 0x06)
    {
      if (!SR)
        markers.push_back(0);
      else
        markers.push_back(int(SR * m.seconds));
    }
  }

  // return marker count if no sample rate provided
  if (!SR)
  {
    std::cout << "COUNT " << markers.size() << std::endl;
    return 0;
  }

  // else return markers as string
  std::stringstream mstring{};
  for (const auto &marker : markers)
  {
    if (mstring.str().length())
      mstring << ",";
    mstring << marker;
  }
  std::cout << "MARKERS " << mstring.str() << std::endl;

  return 0;
}

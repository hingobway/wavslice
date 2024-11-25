#include <string>
#include <exception>
#include <cstring>

#include "utils.hpp"
#include "audio.hpp"
#include "midi.hpp"
#include "text.hpp"

// ------------------------------------------------
// MAIN

int main(int argc, const char *argv[])
{
  // USAGE ------------
  // WRITE TO FILE:   -w ./filein.wav ./fileout.wav 1,2,3,4,5,6,7,8
  // READ FROM AUDIO: -a ./file.wav
  // READ AUDIO SR:   -s ./file.wav
  // READ FROM MIDI:  -m ./file.mid [48000] # not passing a sample rate will return a count
  // READ FROM TEXT:  -t .file.txt|csv

  auto argErr = []()
  { return err("INVALID_ARGS"); };

  if (argc < 2 || std::strlen(argv[1]) < 2 || argv[1][0] != '-')
    return err("INVALID_MODE");

  int args = argc - 2;
  switch (argv[1][1])
  {

  case 'w': // WRITE TO FILE
  {
    if (args != 3)
      return argErr();
    return AUDIO::modeWrite(argv[2], argv[3], argv[4]);
    break;
  }

  case 'a': // READ AUDIO MARKERS
  {
    if (args != 1)
      return argErr();
    return AUDIO::readMarkers(argv[2]);
    break;
  }

  case 's': // GET AUDIO SAMPLE RATE
  {
    if (args != 1)
      return argErr();
    return AUDIO::readAudioSampleRate(argv[2]);
    break;
  }

  case 'm': // READ or COUNT MIDI MARKERS
  {
    if (!(args == 1 || args == 2))
      return argErr();
    int sr{};
    try
    {
      sr = args == 2 ? std::stoi(argv[3]) : 0;
    }
    catch (const std::exception &)
    {
      return argErr();
    }

    return MIDI::readMarkers(argv[2], sr);
    break;
  }

  case 't': // READ TEXT FILE MARKERS
  {

    if (!(args == 1 || args == 2))
      return argErr();
    int sr{};
    try
    {
      sr = args == 2 ? std::stoi(argv[3]) : 0;
    }
    catch (const std::exception &)
    {
      return argErr();
    }

    return TEXT::readMarkers(argv[2], sr);

    break;
  }

  default:
  {
    return err("INVALID_MODE");
    break;
  }
  }

  return 0;
}

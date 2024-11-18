#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <regex>
#include <cstring>

#include <sndfile.h>

#include "utils.hpp"

// ------------------------------------------------
// CONSTANTS

#define MAX_MARKERS 100
#define BUFFER_SIZE 4096
#define LOG_EVERY 1200

// ------------------------------------------------
// PROTOS

int modeWrite(const char *file_in, const char *file_out, const char *m_str);
int readAudioMarkers(const char *file_path);
int writeWavWithMarkers(const char *path_in, const char *path_out, std::vector<int> &markers);

// ------------------------------------------------
// MAIN

int main(int argc, const char *argv[])
{
  // USAGE:
  // WRITE -w ./filein.wav ./fileout.wav 1,2,3,4,5,6,7,8
  // READAUD -a ./file.wav
  // READMID -m ./file.mid

  auto argErr = []()
  { return err("WRONG_NUM_ARGUMENTS"); };

  if (argc < 2 || std::strlen(argv[1]) < 2 || argv[1][0] != '-')
    return err("INVALID_MODE");

  int args = argc - 2;
  switch (argv[1][1])
  {
  case 'w': // WRITE
    if (args != 3)
      return argErr();
    return modeWrite(argv[2], argv[3], argv[4]);
    break;
  case 'a': // READ AUDIO MARKERS
    if (args != 1)
      return argErr();
    return readAudioMarkers(argv[2]);
    break;
  case 'm': // READ MIDI MARKERS
    break;
  default:
    return err("INVALID_MODE");
    break;
  }

  return 0;
}

// ------------------------------------------------
// FUNCS

int modeWrite(const char *path_in, const char *path_out, const char *m_str)
{
  // create markers list from args
  std::string markers_str = m_str;
  std::vector<int> markers;
  markers.reserve(MAX_MARKERS);
  try
  {
    std::smatch match;
    while (std::regex_search(markers_str, match, std::regex("\\d+")))
    {
      markers.push_back(std::stoi(match.str()));
      markers_str = match.suffix().str();
    }
  }
  catch (const std::exception &)
  {
    return err("INVALID_MARKERS");
  }
  if (!markers.size())
    return err("MISSING_MARKERS");

  // sort markers in time order
  std::sort(markers.begin(), markers.end());

  return writeWavWithMarkers(path_in, path_out, markers);
}

int readAudioMarkers(const char *file_path)
{
  // load file
  SF_INFO sf_info{};
  SNDFILE *file = sf_open(file_path, SFM_READ, &sf_info);

  // get cues
  SF_CUES cues{};
  int has_markers = sf_command(file, SFC_GET_CUE, &cues, sizeof(cues));
  if (!has_markers)
  {
    std::cout << "MARKERS_NONE" << std::endl;
    return 0;
  }

  std::stringstream markers{};
  for (int i = 0; i < cues.cue_count; i++)
  {
    if (i)
      markers << ",";
    markers << cues.cue_points[i].sample_offset;
  }

  std::cout << "MARKERS " << markers.str() << std::endl;

  sf_close(file);
  file = nullptr;
  return 0;
}

int writeWavWithMarkers(const char *path_in, const char *path_out, std::vector<int> &markers)
{
  // check markers length
  if (markers.size() > MAX_MARKERS)
    return err("TOO_MANY_MARKERS");

  // LOAD SOUND FILES

  // sound file info
  SF_INFO sf_info{};

  // attempt file open
  SNDFILE *file_in, *file_out;
  file_in = sf_open(path_in, SFM_READ, &sf_info);
  file_out = sf_open(path_out, SFM_WRITE, &sf_info);
  if (!file_in)
    return err("OPEN_FAILED_INPUT_FILE");
  if (!file_out)
    return err("OPEN_FAILED_OUTPUT_FILE");

  // create cue points
  SF_CUES cues{};
  cues.cue_count = markers.size();
  for (int i = 0; i < markers.size(); i++)
  {
    cues.cue_points[i].indx = i + 1;
    cues.cue_points[i].position = markers[i];
    cues.cue_points[i].fcc_chunk = 0x61746164;
    cues.cue_points[i].chunk_start = 0;
    cues.cue_points[i].block_start = 0;
    cues.cue_points[i].sample_offset = markers[i];
    cues.cue_points[i].name[0] = '\0';
  }

  // write cue points to file
  int done = sf_command(file_out, SFC_SET_CUE, &cues, sizeof(cues));
  if (!done)
    return err("CUE_WRITE_FAILED");

  // transfer audio to output
  int samps_read = 0;
  float buffer[BUFFER_SIZE];
  while ((samps_read = (int)sf_read_float(file_in, buffer, BUFFER_SIZE)))
    sf_write_float(file_out, buffer, samps_read);

  // close files
  sf_close(file_in);
  sf_close(file_out);
  file_in = nullptr;
  file_out = nullptr;
  return 0;
}

#include "audio.hpp"

#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <algorithm>
#include <regex>

#include <sndfile.h>

#include "utils.hpp"

int AUDIO::modeWrite(const char *path_in, const char *path_out, const char *m_str)
{

  // input and output paths must be different
  if (std::string(path_in) == std::string(path_out))
    return err("INPUT_OUTPUT_PATH_SAME");

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
  // if (!markers.size())
  //   return err("MISSING_MARKERS");

  // sort markers in time order
  std::sort(markers.begin(), markers.end());

  return writeWavWithMarkers(path_in, path_out, markers);
}

int AUDIO::writeWavWithMarkers(const char *path_in, const char *path_out, std::vector<int> &markers)
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
    return err("FILE_OPEN_FAILED_INPUT");
  if (!file_out)
    return err("FILE_OPEN_FAILED_OUTPUT");

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

int AUDIO::readMarkers(const char *file_path)
{
  // load file
  SF_INFO sf_info{};
  SNDFILE *file = sf_open(file_path, SFM_READ, &sf_info);
  if (!file)
    return err("FILE_OPEN_FAILED");

  // print sample rate
  std::cout << "SR " << sf_info.samplerate << std::endl;

  // get file length
  int samples = sf_seek(file, 0, SEEK_END);
  std::cout << "LENGTH " << samples << std::endl;

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

int AUDIO::readAudioSampleRate(const char *file_path)
{
  // load file
  SF_INFO sf_info{};
  SNDFILE *file = sf_open(file_path, SFM_READ, &sf_info);
  if (!file)
    return err("FILE_OPEN_FAILED");

  std::cout << "SR " << sf_info.samplerate << std::endl;

  return 0;
}

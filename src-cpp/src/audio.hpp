#pragma once

#include <vector>

namespace AUDIO
{
  int modeWrite(const char *file_in, const char *file_out, const char *m_str);
  int writeWavWithMarkers(const char *path_in, const char *path_out, std::vector<int> &markers);

  int readMarkers(const char *file_path);
  int readAudioSampleRate(const char *file_path);
}
#include <stdio.h>
#include <stdlib.h>
#include <sndfile.h>

int add_markers_to_wav(const char *wav_path, const int *markers, int num_markers)
{
  SF_INFO sf_info;
  SNDFILE *sndfile;
  SF_CUES cues;
  int i;

  // Initialize SF_INFO structure
  sf_info.format = 0;

  // Open the WAV file for reading and writing
  sndfile = sf_open(wav_path, SFM_RDWR, &sf_info);
  if (!sndfile)
  {
    printf("Error: Could not open file %s\n", wav_path);
    printf("Error: %s\n", sf_strerror(NULL));
    return -1;
  }

  // Initialize cues structure
  cues.cue_count = num_markers;

  // Set up cue points
  for (i = 0; i < num_markers; i++)
  {
    cues.cue_points[i].indx = i + 1;  // 1-based index
    cues.cue_points[i].position = 0;  // Usually 0 for WAV files
    cues.cue_points[i].fcc_chunk = 0; // Standard WAV cue point
    cues.cue_points[i].chunk_start = 0;
    cues.cue_points[i].block_start = 0;
    cues.cue_points[i].sample_offset = markers[i];

    // Create a default name for each marker
    snprintf(cues.cue_points[i].name, sizeof(cues.cue_points[i].name), "marker");
  }

  // Write cue points to the file
  if (sf_command(sndfile, SFC_SET_CUE, &cues, sizeof(cues)) != SF_TRUE)
  {
    printf("Error: Failed to set cue points\n");
    sf_close(sndfile);
    return -1;
  }

  // Close the file
  sf_close(sndfile);
  return 0;
}

// Example usage
int main(int argc, char *argv[])
{
  if (argc != 2)
  {
    printf("Usage: %s <wav_file>\n", argv[0]);
    return 1;
  }

  // Example marker positions (in samples)
  int markers[] = {
      142222,
      711111,
      1280000,
      1848889,
      2702222,
      4266667};
  int num_markers = sizeof(markers) / sizeof(markers[0]);

  return add_markers_to_wav(argv[1], markers, num_markers);
}

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <sndfile.h>

#include "test.h"

int printFileMarkers(SNDFILE *wav);
int audioProcessor(const char *wav_path, const int *markers, const int num_markers);

// MAIN

#define STR_LEN (256)

int main(int argc, char *argv[])
{

  return test_func();

  char filename[STR_LEN];
  filename[0] = 0;

  // if path is provided in args, use it
  if (argc >= 2)
  {
    if (strlen(argv[1]) >= STR_LEN)
    {
      printf("Error: path is too long.\n");
      return 1;
    }
    strcpy(filename, argv[1]);
  }

  printf("The default wav path is  %s\n\n", filename);

  // get optional cli passed path
  char input_buffer[STR_LEN];
  while (1)
  {
    printf("Enter the path to the wav file: ");
    if (fgets(input_buffer, STR_LEN, stdin) == NULL)
      return 1;

    size_t len = strlen(input_buffer);

    // if blank and arg provided, continue
    if (len == 1 && strlen(filename))
      break;

    if (len > 1)
    {
      input_buffer[len - 1] = 0;
      strcpy(filename, input_buffer);
      break;
    }

    printf("Please provide a path.\n");
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

  return audioProcessor(filename, markers, num_markers);
}

// ------------------------------------------------

int audioProcessor(const char *wav_path, const int *markers, const int num_markers)
{

  // LOAD SOUND FILE

  // init sound file
  SF_INFO sf_info;
  memset(&sf_info, 0, sizeof(sf_info));

  SNDFILE *wav;
  wav = sf_open(wav_path, SFM_RDWR, &sf_info);

  if (!wav)
  {
    printf("Error: Could not open file %s\n", wav_path);
    printf("Error: %s\n", sf_strerror(NULL));
    return 1;
  }

  // PROCESS MARKERS
  int q = printFileMarkers(wav);
  if (!q)
    return 0;

  // set new cue points...

  SF_CUES cues;

  // Initialize cues structure
  cues.cue_count = num_markers;

  // Set up cue points
  for (int i = 0; i < num_markers; i++)
  {
    cues.cue_points[i].indx = i + 1;
    cues.cue_points[i].position = markers[i];
    cues.cue_points[i].fcc_chunk = 0x61746164;
    cues.cue_points[i].chunk_start = 0;
    cues.cue_points[i].block_start = 0;
    cues.cue_points[i].sample_offset = markers[i];
    cues.cue_points[i].name[0] = '\0';
  }

  // Write cue points to the file
  int yes = sf_command(wav, SFC_SET_CUE, &cues, sizeof(cues));
  if (!yes)
    printf("ERROR \n%s\n", sf_strerror(wav));

  return printFileMarkers(wav);

  // Close the file
  sf_close(wav);
  wav = NULL;
  return 0;
}

int printFileMarkers(SNDFILE *wav)
{
  // get cues
  SF_CUES cues;
  int got_cues = sf_command(wav, SFC_GET_CUE, &cues, sizeof(cues));

  if (!got_cues)
  {
    printf("This file has no cues.\n");
    return 1;
  }

  printf("This file has %d cues.\n", cues.cue_count);

  // Get the length of the sound file in samples
  sf_count_t num_samples = sf_seek(wav, 0, SEEK_END);
  printf("The length of the sound file is %lld samples.\n", num_samples);

  for (int c = 0; c < cues.cue_count; c++)
  {
    printf("Cue Point %d:\n", c + 1);
    printf("  Index: %d\n", cues.cue_points[c].indx);
    printf("  Position: %u\n", cues.cue_points[c].position);
    printf("  FCC Chunk: %d\n", cues.cue_points[c].fcc_chunk);
    printf("  Chunk Start: %d\n", cues.cue_points[c].chunk_start);
    printf("  Block Start: %d\n", cues.cue_points[c].block_start);
    printf("  Sample Offset: %u\n", cues.cue_points[c].sample_offset);
    printf("  Name: %s\n", cues.cue_points[c].name);
  }

  return 0;
}
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <sndfile.h>

#include "utils.h"
#include "test.h"

#define BUFFER_SIZE 1024

int printFileMarkers(SNDFILE *wav);
int audioProcessor(const char *path_in, const char *path_out, const int *markers, const int num_markers);

// MAIN

int main(int argc, char *argv[])
{

  // return test_func();

  char filename[MAX_STRING_LENGTH];
  filename[0] = 0;

  // if path is provided in args, use it
  if (argc >= 2)
  {
    if (strlen(argv[1]) >= MAX_STRING_LENGTH)
    {
      printf("Error: path is too long.\n");
      return 1;
    }
    strcpy(filename, argv[1]);

    printf("The default wav path is  %s\n\n", filename);
  }

  // get optional cli passed path
  char input_buffer[MAX_STRING_LENGTH];
  getText(input_buffer, !strlen(filename), "Enter the path to the wav file: ");
  if (strlen(input_buffer))
    strcpy(filename, input_buffer);

  // get output filename
  input_buffer[0] = 0;
  getText(input_buffer, 1, "Enter output filename: ");

  // Example marker positions (in samples)
  int markers[] = {
      142222,
      711111,
      1280000,
      1848889,
      2702222,
      4266667};
  int num_markers = sizeof(markers) / sizeof(markers[0]);

  return audioProcessor(filename, input_buffer, markers, num_markers);
}

// ------------------------------------------------

int audioProcessor(const char *path_in, const char *path_out, const int *markers, const int num_markers)
{

  // LOAD SOUND FILE

  // init sound file
  SF_INFO sf_info;
  memset(&sf_info, 0, sizeof(sf_info));

  // open files
  SNDFILE *file_in, *file_out;
  file_in = sf_open(path_in, SFM_READ, &sf_info);
  file_out = sf_open(path_out, SFM_WRITE, &sf_info);
  if (!file_in || !file_out)
    return 1;

  // set new cue points...
  SF_CUES cues;
  cues.cue_count = num_markers;
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

  // write cue points to the file
  int yes = sf_command(file_out, SFC_SET_CUE, &cues, sizeof(cues));
  if (!yes)
    return 1;

  // copy audio to output file
  int samples_read = 0;
  float buffer[BUFFER_SIZE];
  while ((samples_read = (int)sf_read_float(file_in, buffer, BUFFER_SIZE)))
    sf_write_float(file_out, buffer, samples_read);

  // Close the file
  sf_close(file_in);
  sf_close(file_out);
  file_in = NULL;
  file_out = NULL;
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

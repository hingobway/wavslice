#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <sndfile.h>

#include "utils.h"

// ------------------------------------------------
// CONSTANTS

#define MAX_MARKERS 100
#define BUFFER_SIZE 4096
#define LOG_EVERY 1200

// ------------------------------------------------
// PROTOS

int err(const char *code);
int printFileMarkers(SNDFILE *wav);
int audioProcessor(const char *path_in, const char *path_out, const int *markers, const int num_markers);

int numCompare(const void *a, const void *b) { return (*(int *)a - *(int *)b); }

// ------------------------------------------------
// MAIN

int main(int argc, char *argv[])
{
  // USAGE: markers ./filein.wav ./fileout.wav 1,2,3,4,5,6,7,8

  if (argc != 1 + 3)
    return err("WRONG_NUM_ARGUMENTS");

  // file names
  const char *file_in = argv[1];
  const char *file_out = argv[2];

  // markers list
  int markers[MAX_MARKERS];
  int marker_count = 0;

  // marker string processing
  const char *mlist = argv[3];  // marker list string
  char cval[MAX_STRING_LENGTH]; // current value
  cval[0] = 0;

  for (int i = 0; i < strlen(mlist); i++)
  {
    // add new value if possible
    if (mlist[i] == ',')
    {
      if (strlen(cval))
      {
        int val = atoi(cval);
        if (val)
          markers[marker_count++] = val;
      }
      cval[0] = 0;
      continue;
    }

    // otherwise store digit and move on
    int val = mlist[i] - '0';
    if (val < 0 || val > 9)
      return err("INVALID_MARKER_STRING");

    size_t l_cval = strlen(cval);
    if (l_cval >= MAX_STRING_LENGTH - 1)
      return err("MARKER_STRING_TOO_LONG");
    cval[l_cval] = mlist[i];
    cval[l_cval + 1] = 0;
  }

  // sort
  qsort(markers, marker_count, sizeof(int), numCompare);

  return audioProcessor(file_in, file_out, markers, marker_count);
}

// ------------------------------------------------
// METHODS

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
  if (!file_in)
    return err("OPEN_FAILED_INPUT_FILE");
  if (!file_out)
    return err("OPEN_FAILED_OUTPUT_FILE");

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
    return err("CUE_WRITE_FAILED");

  // // track frames for logging
  // sf_count_t frames = sf_seek(file_in, 0, SEEK_END);
  // sf_seek(file_in, 0, SEEK_SET);
  // int btotal = frames * sf_info.channels / BUFFER_SIZE;
  // int current = 0;

  // copy audio to output file
  int samples_read = 0;
  float buffer[BUFFER_SIZE];
  while ((samples_read = (int)sf_read_float(file_in, buffer, BUFFER_SIZE)))
  {
    sf_write_float(file_out, buffer, samples_read);

    // // status
    // if (++current == btotal || current % LOG_EVERY == 0)
    //   printf("%%%d\n", 100 * current / btotal);
  }

  // close files
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

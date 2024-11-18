#include "test.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#include <sndfile.h>

#define CHANNELS 2
#define SAMPLE_RATE 48000

#define LENGTH_SEC 5
#define LENGTH_SAMP (LENGTH_SEC * SAMPLE_RATE)
#define BUFFER_LENGTH (LENGTH_SAMP * CHANNELS)

#define FREQ_HZ 400

int test_func(void)
{

  // init file
  SNDFILE *file;
  SF_INFO sfinfo;

  // define file metadata
  memset(&sfinfo, 0, sizeof(sfinfo));
  sfinfo.samplerate = SAMPLE_RATE;
  sfinfo.frames = LENGTH_SAMP;
  sfinfo.channels = CHANNELS;
  sfinfo.format = SF_FORMAT_WAV | SF_FORMAT_PCM_24;

  // init audio buffer
  float *buffer = calloc(BUFFER_LENGTH, sizeof(float));
  if (buffer == NULL)
  {
    printf("Error: memory allocation failed.\n");
    return 1;
  }

  // attempt file open
  file = sf_open("../out.wav", SFM_WRITE, &sfinfo);
  if (!file)
  {
    printf("file open failed.\n");
    free(buffer);
    buffer = NULL;
    return 1;
  }

  // ------------------------------------

  // MARKERS

  SF_CUES cues;
  int markers[] = {
      48000, 96000};
  cues.cue_count = sizeof(markers) / sizeof(markers[0]);

  for (int i = 0; i < cues.cue_count; i++)
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
  int yes = sf_command(file, SFC_SET_CUE, &cues, sizeof(cues));
  if (!yes)
    printf("ERROR \n%s\n", sf_strerror(file));

  // ------------------------------------

  // calculate audio
  for (int k = 0; k < LENGTH_SAMP; k++)
  {
    buffer[2 * k] = sinf(2.0 * M_PI * FREQ_HZ * k / SAMPLE_RATE);
    buffer[2 * k + 1] = buffer[2 * k];
  }

  int final = sf_write_float(file, buffer, BUFFER_LENGTH);
  if (final != BUFFER_LENGTH)
  {
    printf("Error writing. \n%s\n", sf_strerror(file));
  }

  sf_close(file);
  free(buffer);

  printf("\n;");
  return 0;
}

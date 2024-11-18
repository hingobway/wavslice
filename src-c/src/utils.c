#include "utils.h"

#include <stdio.h>
#include <string.h>

int err(const char *code)
{
  printf("ERROR %s\n", code);
  return 1;
}


void getText(char *output_ptr, int isRequired, const char *prompt)
{
  // get optional cli passed path
  char input_buffer[MAX_STRING_LENGTH];
  while (1)
  {
    printf("%s", prompt);
    if (fgets(input_buffer, MAX_STRING_LENGTH, stdin) == NULL)
      return;

    size_t len = strlen(input_buffer);

    if (len > 1 || !isRequired)
    {
      input_buffer[len - 1] = 0;
      break;
    }
  }

  strcpy(output_ptr, input_buffer);
}

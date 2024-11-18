#ifndef UTILS_H_
#define UTILS_H_

#include <stdio.h>
#include <string.h>

#define MAX_STRING_LENGTH (256)

/**
 * get text from stdin. ensure your output ptr has at least `MAX_STRING_LENGTH` worth of space in it.
 */
void getText(char *output_ptr, int isRequired, const char *prompt);

#endif

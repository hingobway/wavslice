#ifndef UTILS_H_
#define UTILS_H_

#define MAX_STRING_LENGTH (256)

/// @brief return an error code to STDOUT.
/// @param code ERROR_CODE string
/// @return 1
int err(const char *code);

/// @brief get text from stdin. ensure your output ptr has at least `MAX_STRING_LENGTH` worth of space in it.
/// @param output_ptr char* to return text to.
/// @param isRequired whether to continue prompting user until they provide a response.
/// @param prompt what to display to user when prompting
void getText(char *output_ptr, int isRequired, const char *prompt);

#endif

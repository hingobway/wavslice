#include <stdio.h>
#include <stdlib.h>

#define MAX_ARR 100

int numCompare(const void *a, const void *b) { return (*(int *)a - *(int *)b); }

int main(void)
{
  const char *string = "123,456,2,432";

  int markers[MAX_ARR];
  int markers_count = 0;

  int num;
  while (sscanf(string, "%d", &num) == 1)
  {
    markers[markers_count++] = num;
    while (*string != ',' && *string != '\0')
      string++;
    if (*string == ',')
      string++;
  }

  qsort(markers, markers_count, sizeof(markers[0]), numCompare);

  for (int i = 0; i < markers_count; i++)
    printf("%d\n", markers[i]);
}

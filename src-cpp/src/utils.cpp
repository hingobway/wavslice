#include "utils.hpp"

#include <iostream>
#include <string>

int err(const std::string code)
{
  std::cout << "ERROR " << code << std::endl;
  return 1;
}

#include "text.hpp"

#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <regex>

#include "utils.hpp"

int TEXT::readMarkersQLab(const std::string &textFile, const int SR)
{
  // open file
  std::ifstream file(textFile);
  if (!file.is_open())
    return err("FILE_OPEN_FAILED");

  std::string text((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
  file.close();

  /*
  let ms; const ott = [];
  const rgx = /\t(\d\d):(\d\d\.\d\d\d)\t\d\d/mg
  while (ms = rgx.exec(text)) {
    const h = parseFloat(ms[1]) * 60;
    const m = parseFloat(ms[2])
    ott.push(h + m)
  }
  */

  // attempt match
  std::string line{};
  std::vector<double> ott;
  std::regex rgx(R"(\t(\d\d):(\d\d\.\d\d\d)\t\d\d)");
  std::smatch ms;
  try
  {
    while (std::getline(file, line))
    {
      if (std::regex_search(line, ms, rgx))
      {
        // TODO trycatch
        double h = std::stod(ms[1]) * 60;
        double m = std::stod(ms[2]);
        ott.push_back((h + m) * SR);
      }
    }
  }
  catch (const std::exception &)
  {
    return err("TEXT_PARSE_FAILED_QLAB_MODE");
  }

  file.close();

  // sort ott lowest to highest
  std::sort(ott.begin(), ott.end());

  // print out a comma-separated list
  std::stringstream csv{};
  for (int i = 0; i < (int)ott.size(); ++i)
  {
    csv << ott[i];
    if (i < ott.size() - 1)
      csv << ", ";
  }

  // print
  std::cout << "MARKERS " << csv.str() << std::endl;

  return 0;
}

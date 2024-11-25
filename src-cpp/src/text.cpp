#include "text.hpp"

#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <regex>
#include <memory>

#include <boost/locale.hpp>
#include <boost/locale/encoding.hpp>

#include "utils.hpp"

namespace TEXT
{

  using Encoding = FileReader::Encoding;

  Encoding FileReader::detectEncoding(const std::string &filename)
  {
    std::ifstream file(filename, std::ios::binary);
    if (!file)
    {
      throw std::runtime_error("Cannot open file for encoding detection");
    }

    // Read BOM (Byte Order Mark)
    char bom[4];
    file.read(bom, 4);
    size_t bomLen = file.gcount();

    if (bomLen >= 2)
    {
      // UTF-16 LE BOM (FF FE)
      if (static_cast<unsigned char>(bom[0]) == 0xFF &&
          static_cast<unsigned char>(bom[1]) == 0xFE)
      {
        return Encoding::UTF16LE;
      }
      // UTF-16 BE BOM (FE FF)
      if (static_cast<unsigned char>(bom[0]) == 0xFE &&
          static_cast<unsigned char>(bom[1]) == 0xFF)
      {
        return Encoding::UTF16BE;
      }
      // UTF-8 BOM (EF BB BF)
      if (bomLen >= 3 &&
          static_cast<unsigned char>(bom[0]) == 0xEF &&
          static_cast<unsigned char>(bom[1]) == 0xBB &&
          static_cast<unsigned char>(bom[2]) == 0xBF)
      {
        return Encoding::UTF8;
      }
    }

    return Encoding::UTF8;
  }

  std::vector<double> FileReader::getQLabMarkers(const std::string &filename, int SR)
  {
    // Generate and install the locale
    boost::locale::generator gen;
    std::locale::global(gen(""));

    Encoding encoding = detectEncoding(filename);
    std::vector<double> ott;

    // Read the entire file into memory
    std::ifstream file(filename, std::ios::binary);
    if (!file)
      throw std::runtime_error("Failed to open file");

    // Get file size and read content
    file.seekg(0, std::ios::end);
    std::streamsize size = file.tellg();
    file.seekg(0, std::ios::beg);

    std::vector<char> buffer(size);
    if (!file.read(buffer.data(), size))
    {
      throw std::runtime_error("Failed to read file");
    }

    // Convert to UTF-8 string based on detected encoding
    std::string utf8_content;
    try
    {
      switch (encoding)
      {
      case Encoding::UTF16LE:
      {
        const char *start = buffer.data();

        utf8_content = boost::locale::conv::to_utf<char>(
            buffer.data(), start + 3 + size,
            "UTF-16LE");
        break;
      }
      case Encoding::UTF16BE:
        utf8_content = boost::locale::conv::to_utf<char>(
            buffer.data(), buffer.data() + size,
            "UTF-16BE");
        break;
      default:
        // For UTF-8 and ASCII, just copy the buffer
        utf8_content = std::string(buffer.data(), size);
        break;
      }
    }
    catch (const boost::locale::conv::conversion_error &e)
    {
      throw std::runtime_error("Failed to convert file encoding: " + std::string(e.what()));
    }

    // Process the content line by line
    std::istringstream stream(utf8_content);
    std::string line;
    // std::regex rgx(R"(.*?\t([0-9]{2}):([0-9]{2}\.[0-9]{3})\t[0-9]{2})");
    std::regex rgx(R"(.*?\t([0-9][0-9]):([0-9][0-9]\.[0-9][0-9][0-9])\t)");
    std::smatch ms;

    int lineNum = 0;
    while (std::getline(stream, line))
    {
      lineNum++;

      // Debug output - show exact byte values
      std::cout << "Line " << lineNum << " bytes: ";
      for (unsigned char c : line)
      {
        std::cout << std::hex << std::setw(2) << std::setfill('0')
                  << static_cast<int>(c) << " ";
      }
      std::cout << std::dec << std::endl;

      if (std::regex_search(line, ms, rgx))
      {
        try
        {
          double m = std::stod(ms[1]); // minutes
          double s = std::stod(ms[2]); // seconds
          ott.push_back((m * 60 + s) * SR);
        }
        catch (const std::exception &e)
        {
          std::cerr << "Warning: Failed to parse time value in line: " << line << std::endl;
          continue;
        }
      }
    }

    std::sort(ott.begin(), ott.end());
    return ott;
  }

  int readMarkers(const std::string &filename, int SR)
  {
    try
    {
      std::vector<double> markers = FileReader::getQLabMarkers(filename, SR);

      // Print results
      std::stringstream csv;
      for (size_t i = 0; i < markers.size(); ++i)
      {
        csv << markers[i];
        if (i < markers.size() - 1)
        {
          csv << ", ";
        }
      }
      std::cout << "MARKERS " << csv.str() << std::endl;
    }
    catch (const std::exception &e)
    {
      return err(e.what());
    }
    return 0;
  }
}

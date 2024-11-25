#include <string>
#include <vector>

namespace TEXT
{
  class FileReader
  {
  public:
    enum class Encoding
    {
      UTF8,
      UTF16LE,
      UTF16BE,
      ASCII
    };
    static Encoding detectEncoding(const std::string &filename);

    static std::vector<double> getQLabMarkers(const std::string &filename, int SR);
  };

  int readMarkers(const std::string &filename, int SR);

};

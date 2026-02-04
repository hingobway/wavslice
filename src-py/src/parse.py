import sys
from dawtool import extract_markers
from dawtool.marker import Marker

if __name__ == "__main__":
    try:
        filename = sys.argv[1]
        fs = int(sys.argv[2])

        with open(filename, "rb") as f:
            markers: list[Marker] = extract_markers(filename, f)

        markers_str = str.join(",", (str(int(m.time * fs)) for m in markers))
        print(f"MARKERS {markers_str}")
    except:
        print("ERROR PROCESSING_ERROR")

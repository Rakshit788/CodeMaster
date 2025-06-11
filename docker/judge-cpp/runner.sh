#!/bin/bash
set -e

# Read C++ code from stdin into solution.cpp
cat > solution.cpp

# Compile the code
if ! g++ -O2 -std=c++17 solution.cpp -o solution.out 2> compile_error.txt; then
  err=$(cat compile_error.txt)
  echo "{\"status\":\"compile_error\",\"message\":\"$err\"}"
  exit 0
fi

# Run the binary and measure execution time and output
START=$(date +%s.%N)
OUT=$(./solution.out 2>&1)
END=$(date +%s.%N)

RUNTIME=$(echo "$END - $START" | bc)

# Return result in JSON
echo "{\"status\":\"success\",\"time\":\"$RUNTIME\",\"output\":\"$OUT\"}"

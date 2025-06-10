#!/usr/bin/env bash
set -euo pipefail

SRC="$1"           # e.g. "solution.cpp" (relative to WORKDIR)
BIN="solution"
ERRF="compile.stderr"

# 1) Try to compile, capturing stderr
if ! g++ -std=c++17 -O2 "$SRC" -o "$BIN" 2> "$ERRF"; then
  ERR=$(<"$ERRF")
  # Escape quotes and emit JSON
  printf '{"status":"compile_error","message":"%s"}\n' \
         "${ERR//\"/\\\"}"
  exit 0
fi

# 2) Run under `time`, capture stdout/stderr
{ TIMEFORMAT="%Es"; time ./"$BIN"; } > stdout.txt 2> stderr.txt
RC=$?
RT=$TIMEFORMAT

# 3) Emit JSON for runtime_error or success
if [ $RC -ne 0 ]; then
  ERR=$(<stderr.txt)
  printf '{"status":"runtime_error","message":"%s","runtime":"%s"}\n' \
         "${ERR//\"/\\\"}" "$RT"
else
  OUT=$(<stdout.txt)
  printf '{"status":"ok","output":"%s","runtime":"%s"}\n' \
         "${OUT//\"/\\\"}" "$RT"
fi

#!/bin/sh

# Compile the code
gcc main.c -o main.out 2> compile_error.txt
if [ $? -ne 0 ]; then
  echo "COMPILATION_ERROR"
  cat compile_error.txt
  exit 1
fi

# Create outputs dir if not exists
mkdir -p outputs

# Run all input test cases
for file in inputs/*.txt; do
  name=$(basename "$file" .txt)
  out_file="outputs/${name}.txt"
  err_file="outputs/${name}.err"

  # Time + memory monitoring + timeout
  /usr/bin/time -f "\nTIME:%e\nMEM:%M" timeout "$TIME_LIMIT" ./main.out < "$file" > "$out_file" 2> "$err_file"

  if [ $? -ne 0 ]; then
    echo "RUNTIME_ERROR:$name"
    cat "$err_file"
  else
    echo "TESTCASE_PASSED:$name"
  fi
done

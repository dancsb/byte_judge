#!/bin/bash

# Create outputs dir if not exists
mkdir -p outputs

# Run all input test cases
for file in inputs/*.txt; do
  name=$(basename "$file" .txt)
  out_file="outputs/${name}.txt"
  err_file="outputs/${name}.err"

  # Time + memory monitoring + timeout
  /bin/time -f "\nTIME:%e\nMEM:%M" timeout "$TIME_LIMIT" python3 main.py < "$file" > "$out_file" 2> "$err_file"
  RESULT=$?

  # Read time and memory from error file and output it to stdout
  if grep -q "TIME:" "$err_file"; then
    TIME_INFO=$(grep "TIME:" "$err_file")
    MEM_INFO=$(grep "MEM:" "$err_file")
    echo "$TIME_INFO"
    echo "$MEM_INFO"
  fi

  if [ $RESULT -eq 124 ]; then
    echo "TIME_LIMIT_EXCEEDED:$name"
  elif [ $RESULT -eq 137 ]; then
    echo "MEMORY_LIMIT_EXCEEDED:$name"
  elif [ $RESULT -ne 0 ]; then
    echo "RUNTIME_ERROR:$name"
    cat "$err_file"
  else
    echo "TESTCASE_PASSED:$name"
  fi
done

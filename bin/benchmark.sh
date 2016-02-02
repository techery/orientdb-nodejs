#!/bin/bash

start_test="./start.sh"
test_cases=$1

while read test_case; do
  [ -z "$test_case" ] && continue
  echo "Starting test case"
  echo ""
  $start_test $test_case
  echo ""
  echo "Test case ended"
  echo "Waiting for 1 minute"
  sleep 5m
done < "$test_cases"

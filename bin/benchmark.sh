#!/bin/bash

start_test="./start.sh"
test_cases=$1

while read test_case; do
  [ -z "$test_case" ] && continue
  echo "Starting test case"
  now=$(date +"%m-%d-%Y %T")
  echo "Start date : $now"
  echo ""
  $start_test $test_case
  echo ""
  echo "Test case ended"
  now=$(date +"%m-%d-%Y %T")
  echo "End date : $now"

  echo "Waiting for 5 minutes"
  sleep 5m
done < "$test_cases"

#!/bin/bash

function usage(){
	echo "Usage: $(basename $0) REQUESTS CONCURENCY URL";
	echo "       REQUESTS - Number of requests to perform. Required.";
	echo "       CONCURENCY - Number of multiple requests to make at a time. Required.";
	echo "       URL  - Required. Example: http://localhost:8000/?chance[getUserInfo]=1&chance[getUserPosts]=3&chance[getUserFriends]=2&chance[getUserFriendPosts]=5";
}

function sendEvent() {
    curl  -X POST -H "Content-type: application/json" \
    -d '{
          "title": "Apache benchmark '$status'",
          "text": "'$url'",
          "priority": "normal",
          "tags": ["environment:test", "concurency:'$concurrency'"],
          "alert_type": "info"
      }' \
    'https://app.datadoghq.com/api/v1/events?api_key=5a745555c4564194a7bece51d619a033'
}

if [ $# -lt 3 ]
then
  echo "Error: all params are required";
  usage;
  exit 1
fi

requests=$1;
concurrency=$2;
url=$3;
status='start';
sendEvent;
ab -n $requests -c $concurrency -l "$url"
status='end';
sendEvent;

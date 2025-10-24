#!/bin/bash

if [ $# -eq 0 ]; then
  echo "Provide an alert file as parameter"
  exit 1
fi

file=$1
alert=$(cat $file | jq -c .)

webhook='https://whconn-4f67f5ba-d26e-47f9-8c26-6fe2c04b2b7c-aiops.lb-axa-aiops.dev.fyre.ibm.com/webhook-connector/1loaaz98y0u'
result=$(curl -X POST -s --insecure -H 'Content-Type: application/json' $webhook -d "$alert")
status_code=$(echo $result | jq '. | .Status')
if [ $status_code -eq 200 ]
  then
  	uid=$(echo $result | jq -r '. | .UID')
  	message=$(echo $result | jq -r '. | .Message')
  	echo $uid $message
  else
  	echo $result
fi
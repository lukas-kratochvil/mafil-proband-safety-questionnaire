#!/usr/bin/env bash

#-----------------------------------------------------------------------------------------------------------------------
# This script injects environment variables in frontend JavaScript files and then starts the Nginx server.
#-----------------------------------------------------------------------------------------------------------------------

# get names of all environment variables that should be injected into Nginx JavaScript files (prefixed with 'INJECT_') and store them in the $INJECT_VARS
INJECT_VARS=$(printenv | grep '^INJECT_' | sed 's~^INJECT_~~' | awk '{print $1}' | paste -sd,);

# split the $INJECT_VARS into an array
IFS=',' read -ra INJECT_VARS_ARRAY <<< "$INJECT_VARS"

echo 'Replacing environment variables prefixed with "INJECT_" ...'

# loop through each JavaScript file in the production folder and replace any $VARIABLE with the actual value of that environment variable
for pair in "${INJECT_VARS_ARRAY[@]}"; do
  # extract key and value
  IFS='=' read -r key value <<< "$pair"
  echo "$key=$value"

  for file in $JSFILES; do
    # replace ```key:"$key"``` with ```key:"value"```
    sed -i "s/$key:\"\$$key\"/$key:\"$value\"/g" "$file"
  done
done

echo 'Successfully completed environment variables replacement!'

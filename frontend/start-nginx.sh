#!/usr/bin/env bash

#-----------------------------------------------------------------------------------------------------------------------
# This script injects environment variables in frontend JavaScript files and then starts the Nginx server.
#-----------------------------------------------------------------------------------------------------------------------

# get names of all environment variables that should be injected into Nginx JavaScript files (prefixed with 'INJECT_') and store them in the $INJECT_VARS
export INJECT_VARS=$(printenv | grep '^INJECT_' | sed 's/^INJECT_//' | awk '{print "$" $1}' | paste -sd,);
echo "$INJECT_VARS"

# loop through each JavaScript file in the production folder and replace any $VARIABLE with the actual value of that environment variable
for file in $JSFOLDER/*; do
  # create a temporary file to store the modified lines
  temp_file=$(mktemp)

  # read each line of the file
  while IFS= read -r line; do
    # substitute environment variables in the line and append it to the temporary file
    echo "$line" | envsubst "$INJECT_VARS" >> "$temp_file"
  done < "$file"

  # replace the original file with the modified temporary file
  mv "$temp_file" "$file"
done

nginx -g 'daemon off;'

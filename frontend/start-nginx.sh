#!/usr/bin/env bash

#-----------------------------------------------------------------------------------------------------------------------
# This script injects environment variables in frontend JavaScript files and then starts the Nginx server.
#-----------------------------------------------------------------------------------------------------------------------

# get names of all existing environment variables and store them in the $EXISTING_VARS
export EXISTING_VARS=$(printenv | awk -F= '{print $1}' | sed 's/^/\$/g' | paste -sd,);

# loop through each JavaScript file in the production folder and replace any $VARIABLE with the actual value of that environment variable
for file in $JSFOLDER; do
  cat $file | envsubst $EXISTING_VARS | tee $file
done

nginx -g 'daemon off;'

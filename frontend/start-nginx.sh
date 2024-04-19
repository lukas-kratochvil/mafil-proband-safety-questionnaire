#!/usr/bin/env bash

#-----------------------------------------------------------------------------------------------------------------------
# This script injects environment variables in frontend JavaScript files and then starts the Nginx server.
#-----------------------------------------------------------------------------------------------------------------------

# get names of all environment variables that should be injected into Nginx JavaScript files (prefixed with 'INJECT_') and store them in the $INJECT_VARS
export INJECT_VARS=$(printenv | grep '^INJECT_' | sed 's/^INJECT_//' | awk '{print "$" $1}' | paste -sd,);
echo "$INJECT_VARS"

# loop through each JavaScript file in the production folder and replace any $VARIABLE with the actual value of that environment variable
for file in $JSFOLDER; do
  cat $file | envsubst $INJECT_VARS | tee $file
done

nginx -g 'daemon off;'

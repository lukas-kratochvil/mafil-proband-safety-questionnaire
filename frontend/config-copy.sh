#!/bin/sh

#-----------------------------------------------------------------------------------------------------------------------
# This script copies mounted web config.json file to the Nginx server ready-to-serve location.
# Trying to avoid applying configuration changes while the container is running.
#-----------------------------------------------------------------------------------------------------------------------
cp /mnt/config.json /usr/share/nginx/html/config.json || { echo "Error: Failed to copy configuration!"; exit 1; }
echo "Configuration loaded successfully!"

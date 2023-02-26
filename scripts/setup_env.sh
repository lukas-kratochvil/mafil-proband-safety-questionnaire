#!/bin/bash

#-----------------------------------------------------------------------------------------------------------------------
# Script will install all the required programs i.e. docker and docker-compose to run the app in the chosen environment.
# Created by the instructions from: https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository
#-----------------------------------------------------------------------------------------------------------------------

#------------------------
# Set up the repository
#------------------------
echo
echo "Updating the apt package index and installing packages to allow apt to use a repository over HTTPS"
sudo apt-get update
sudo apt-get install \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

echo
echo "Adding Docker’s official GPG key"
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null


#------------------------
# Install Docker Engine
#------------------------
echo
echo "Updating the apt package index"
if ! sudo apt-get update; then
  # Try granting read permission for the Docker public key file before updating the package index
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  sudo apt-get update
fi

echo
echo "Installing Docker Engine, containerd, and Docker Compose"
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo
echo "Verify that the Docker Engine installation is successful by running the hello-world image"
sudo docker run --name hello-world hello-world
echo "Removing the hello-world image"
sudo docker rm --volumes hello-world

echo "Environment setup done!"

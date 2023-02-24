#!/bin/bash

#------------------------------------------------------------------------------------
# Download the files necessary to install or update the app
#------------------------------------------------------------------------------------

# Change this path depending on where you want to download the files
DOWNLOAD_FOLDER="../../mafil_psq_deploy"


ENV_OPTIONS_TEXT="Options are: 'devel' or 'prod'."

while [ true ]; do
  echo "Which environment do you want to deploy on? $ENV_OPTIONS_TEXT"
  read -p "Environment: " ENVIRONMENT

  case "$ENVIRONMENT" in
  "devel")
    GIT_BRANCH="devel"
    break
    ;;
  "prod")
    GIT_BRANCH="main"
    break
    ;;
  *)
    echo "Invalid environment! $ENV_OPTIONS_TEXT Please, try again…" >&2
    ;;
  esac

  echo
done


find $DOWNLOAD_FOLDER -name "docker-compose.*" -delete
rm "$DOWNLOAD_FOLDER/.env"
rmdir $DOWNLOAD_FOLDER

echo
echo "Creating deploy folder at: $(
  cd "$(dirname "$DOWNLOAD_FOLDER")"
  pwd
)/$(basename "$DOWNLOAD_FOLDER")"
mkdir $DOWNLOAD_FOLDER
echo "> DONE"


GITHUB_FILE_URL="https://raw.githubusercontent.com/lukas-kratochvil/mafil-proband-safety-questionnaire/$GIT_BRANCH"
DOCKER_COMPOSE_FILE="docker-compose.$ENVIRONMENT.yml"
ENV_EXAMPLE_FILE=".env.example"

echo
echo "Downloading latest $DOCKER_COMPOSE_FILE from the $GIT_BRANCH branch of the GitHub repo…"
if ! curl -fkSs -o "$DOWNLOAD_FOLDER/$DOCKER_COMPOSE_FILE" "$GITHUB_FILE_URL/$DOCKER_COMPOSE_FILE"; then
  exit 1
fi
echo "> DONE"

echo
echo "Downloading latest $ENV_EXAMPLE_FILE from the $GIT_BRANCH branch of the GitHub repo…"
if ! curl -fkSs -o "$DOWNLOAD_FOLDER/.env" "$GITHUB_FILE_URL/$ENV_EXAMPLE_FILE"; then
  exit 1
fi
echo "> DONE"

echo
echo "Change .env file variables to satisfy your needs and then copy these files to your server."

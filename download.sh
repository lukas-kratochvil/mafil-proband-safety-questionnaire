#!/bin/bash

#-----------------------------------------------------------------------------------------------------------------------
# Download the files necessary to install the app in the chosen environment:
#   1. docker-compose.ENV.yml - defines app services as containers that will run in the Docker
#   2. .env - contains configuration for the app services
#-----------------------------------------------------------------------------------------------------------------------

# TODO: specify the local path where the files will be downloaded
DEST_BASE_PATH=".."

while [ true ]; do
  echo "Which environment do you want to deploy on? Options are: 'devel' or 'prod'."
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
    echo "Invalid environment! Try again!" >&2
    ;;
  esac

  echo
done

DEST_DIR_PATH="$DEST_BASE_PATH/mafil_psq_${ENVIRONMENT}"

echo
echo "Creating directory $(
  cd "$(dirname "$DEST_DIR_PATH")"
  pwd
)/$(basename "$DEST_DIR_PATH")\
 to which will be installation files downloaded."
rm -r $DEST_DIR_PATH
mkdir $DEST_DIR_PATH
echo "> DONE"

GITHUB_FILE_URL="https://raw.githubusercontent.com/lukas-kratochvil/mafil-proband-safety-questionnaire/$GIT_BRANCH"
DOCKER_COMPOSE_FILE="docker-compose.$ENVIRONMENT.yml"
ENV_EXAMPLE_FILE=".env.example"

echo "Downloading latest $DOCKER_COMPOSE_FILE from the $GIT_BRANCH branch of the GitHub repo…"
(curl -fkSs -o "$DEST_DIR_PATH/$DOCKER_COMPOSE_FILE" "$GITHUB_FILE_URL/$DOCKER_COMPOSE_FILE") && echo "> DONE" || echo "> File not found!"

echo "Downloading latest .env from the $GIT_BRANCH branch of the GitHub repo…"
(curl -fkSs -o "$DEST_DIR_PATH/.env" "$GITHUB_FILE_URL/$ENV_EXAMPLE_FILE") && echo "> DONE" || echo "> File not found!"

echo "Change .env file variables to satisfy your needs and then copy these files to your server."

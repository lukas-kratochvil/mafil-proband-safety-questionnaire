#!/bin/bash

#-----------------------------------------------------------------------------------------------------------------------
# Download the files necessary to install the app in the chosen environment:
#   1. docker-compose.ENV.yml - defines app services as containers that will run in the Docker
#   2. .env - contains configuration for the app services
#-----------------------------------------------------------------------------------------------------------------------

USAGE="
Usage: $(basename $0) [OPTIONS]

Options:
  -d,     Directory where to download files
  -e,     Environment - one of: 'prod', 'devel'
  -h,     Prints this help
"

if (($# == 0)); then
  echo "$USAGE"
  exit 0
fi

while getopts ":d:e:h" opt; do
    case $opt in
        d)
          if ! [ -d $DEST_BASE_PATH ]; then
            echo "Directory does not exist!" >&2
            exit 1
          fi
          DEST_BASE_PATH=$OPTARG
          ;;
        e)
          case $OPTARG in
            devel)
              ENVIRONMENT=$OPTARG
              GIT_BRANCH=devel
              ;;
            prod)
              ENVIRONMENT=$OPTARG
              GIT_BRANCH=main
              ;;
            *)
              echo "Environment must be one of: 'prod', 'devel'!" >&2
              exit 1
              ;;
          esac
          ;;
        h)
          echo "$USAGE"
          exit 0
          ;;
        :)
          echo "$USAGE"
          exit 1
          ;;
    esac
done

if [[ -z $DEST_BASE_PATH || -z $ENVIRONMENT ]]; then
  echo "-d and -e options are required!" >&2
  exit 1
fi

DEST_DIR_PATH="$DEST_BASE_PATH/mafil_psq_${ENVIRONMENT}_$(date +%Y%m%d_%H%M%S)"

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

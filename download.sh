#!/bin/bash

#-----------------------------------------------------------------------------------------------------------------------
# Download the files necessary to install the app in the chosen environment:
#   1. docker-compose.ENV.yml - defines app services as containers that will run in the Docker
#   2. .env - contains configuration for the app services
#-----------------------------------------------------------------------------------------------------------------------

help () {
  echo "
Usage: $(basename $0) [OPTIONS]

Required:
  -d,     Directory where to download files
  -e,     Environment - one of: 'prod', 'devel'

Optional:
  -h,     Prints this help
"
}

download () {
  if curl -fkSs -o $1 $2; then
    echo "> DONE"
  else
    echo "> File not found!"
    exit 1
  fi
}

success () {
  echo "
Successfully completed!

Next steps:
  1. Change .env file variables to satisfy your needs and then copy these files to your server.
  2. Uploud .env and docker-compose.ENV.yml on the server
  3. Install or update the app
"
}

if (($# == 0)); then
  help
  exit 0
fi

while getopts ":d:e:h" opt; do
    case $opt in
        d)
          if ! [ -d $OPTARG ]; then
            echo "Directory '$OPTARG' does not exist!" >&2
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
          help
          exit 0
          ;;
        :)
          help
          exit 1
          ;;
    esac
done

if [[ -z $DEST_BASE_PATH || -z $ENVIRONMENT ]]; then
  echo "-d and -e options are required!" >&2
  help
  exit 1
fi

DEST_DIR_PATH="$DEST_BASE_PATH/mafil_psq_${ENVIRONMENT}_$(date +%Y%m%d_%H%M%S)"

echo
echo "Creating directory $(
  cd "$(dirname "$DEST_DIR_PATH")"
  pwd
)/$(basename "$DEST_DIR_PATH")\
 to which will be installation files downloaded."
mkdir $DEST_DIR_PATH
echo "> DONE"

GITHUB_FILE_URL="https://raw.githubusercontent.com/lukas-kratochvil/mafil-proband-safety-questionnaire/$GIT_BRANCH"
DOCKER_COMPOSE_FILE="docker-compose.$ENVIRONMENT.yml"

echo "Downloading latest '$DOCKER_COMPOSE_FILE' from the '$GIT_BRANCH' branch of the GitHub repo…"
download "$DEST_DIR_PATH/$DOCKER_COMPOSE_FILE" "$GITHUB_FILE_URL/$DOCKER_COMPOSE_FILE"

echo "Downloading latest '.env' from the '$GIT_BRANCH' branch of the GitHub repo…"
download "$DEST_DIR_PATH/.env" "$GITHUB_FILE_URL/.env.example"

success

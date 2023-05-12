# MAFIL - Proband Safety Questionnaire
Web application for ensuring the registration and safety of MR measurements in the [MAFIL laboratory (CEITEC)](https://mafil.ceitec.cz/en/).

## Table of contents
- [Installation](#installation)
- [Developers installation](#developers-installation)
- [Services update](#services-update)

## Installation

Firstly, install Docker and docker-compose ([see the official Docker docs](https://docs.docker.com/engine/install/)) on the system you want to run this app on.

After that use `download.sh` script (located in the project root directory) and edit the `DEST_BASE_PATH` variable inside this file, so that a path corresponds with the actual location on your file system.

Running the script will download files essential to run the app.
* environment-specific docker-compose file
* .env containing services configuration

Edit `.env` configuration variables with your values.

Then transfer the directory to the server. You can use this command template:
```sh
scp -r -i SSH_PRIVATE_KEY_FILE_PATH LOCAL_DIR_PATH USER@SERVER:REMOTE_DIR_PATH
```

In the app directory on the remote server create the `certs` directory and store there the SSL certificate `certificate.pem` and the corresponding private key `private_key.pem`.

Start all the services using this command:
```
docker-compose -f docker-compose.ENV.yml up -d
```

The command will start the services listed below:
* Postgres - database
* Adminer - database manager
* Server - app server
* Web – app client

To populate the database with initial data (genders, native languages, handednesses and safety questions), the command below must be run inside the `server` container.
```
docker-compose -f docker-compose.ENV.yml exec server npm run seed
```

## Developers installation
Create a `.env` configuration file inspired by `.env.example`.

The docker-compose configuration file to use for the development is called `docker-compose.local.yml`.
Start all the services with the command below:
```
docker-compose -f docker-compose.local.yml up -d
```

Source code directories and `package.json` are mapped as volumes in the corresponding container file system.

To populate the local database with initial data (genders, native languages, handednesses and safety questions), the command below must be run inside the `server` container.
```
npm run seed:local
```

## Services update
To update services run these commands in the server app directory:
```
docker-compose -f docker-compose.ENV.yml pull [SERVICE]
docker-compose -f docker-compose.ENV.yml up -d --force-recreate --no-deps [SERVICE]
docker image prune -f
```
It may be necessary to update `.env` variables before running the commands above.

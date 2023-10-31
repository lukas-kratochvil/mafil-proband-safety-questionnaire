# MAFIL - Proband Safety Questionnaire
Web application for ensuring the registration and safety of MR measurements in the [MAFIL laboratory (CEITEC)](https://mafil.ceitec.cz/en/).

## Table of contents
- [Repository structure](#repository-structure)
- [Base URL paths](#base-url-paths)
- [Installation](#installation)
  - [Populating the database with initial data](#populating-the-database-with-initial-data)
- [Developers installation](#developers-installation)
  - [Populating the database with initial data](#populating-the-database-with-initial-data-1)
  - [Changing the database schema and database migrations](#changing-the-database-schema-and-database-migrations)
- [Services update](#services-update)
- [Notes for the repository owner](#notes-for-the-repository-owner)
  - [Repository secrets and variables](#repository-secrets-and-variables)

## Repository structure
This repository contains the following most important directories and files:
- *backend* - server app
  - *prisma* - Prisma schema and SQL migrations
  - *src* - source files
  - *test* - tests
  - *Dockerfile* - instructions for assembling server Docker image
- *frontend* - client app
  - *nginx* - Nginx web server configuration
  - *public* - static files
  - *src* - source files including tests
  - *Dockerfile* - instructions for assembling client Docker image
- *docs* – system documentation
- *.env.example* - example of environment-specific variables configuration
- *LICENSE* - system license
- *README.md* - this README
- *docker-compose.devel.yml* - development environment services configuration
- *docker-compose.local.yml* - local development environment services configuration
- *docker-compose.prod.yml* - production environment services configuration
- *download.sh* - script to download files for deployment (you must specify the local path where the files will be downloaded)

## Base URL paths
- `/` - root path directs to the proband safety questionnaire
- `/login` - this path directs to the login page
- `/adminer` - this path directs to the Adminer (database manager)

## Installation
Firstly, install Docker and docker-compose ([see the official Docker docs](https://docs.docker.com/engine/install/)) on the system you want to run this app on.

After that use `download.sh` script (located in the project root directory) and edit the `DEST_BASE_PATH` variable inside this file, so that a path corresponds with the actual location on your file system.

Running the script will download files essential to run the app.
- environment-specific docker-compose file
- .env containing services configuration

Edit `.env` configuration variables with your values.

Then transfer the directory to the server. You can use this command template:
```sh
scp -r -i SSH_PRIVATE_KEY_FILE_PATH LOCAL_DIR_PATH USER@SERVER:REMOTE_DIR_PATH
```

In the app root directory on the remote server create the `certs` directory and store there the SSL certificate `certificate.pem` and the corresponding private key `private_key.pem`.

Start all the services using this command:
```
docker-compose -f docker-compose.ENV.yml up -d
```

The command will start the services listed below:
- *postgres* - database
- *postgres-backup* - database backup service
- *adminer* - database manager
- *server* - app server
- *web* – web server

These volumes will be created in the app root directory:
- *database-storage* - database files
- *database-backups* - periodic backups of the database
- *logs*
  - *server* - app server logs
  - *web* - web server logs

### Populating the database with initial data
To populate the database with initial data (languages, genders, native languages, handednesses and safety questions), the command below must be run inside the `server` container.
```
docker-compose -f docker-compose.ENV.yml exec server npm run seed
```

Then users that are eligible to access the authenticated part of the app must be defined. Login to the Adminer at `/adminer` URL path and create accounts in the `Operator` table in the database.

## Developers installation
Create a `.env` configuration file inspired by `.env.example`.

The docker-compose configuration file to use for the development is called `docker-compose.local.yml`.
Start all the services with the command below:
```
docker-compose -f docker-compose.local.yml up -d
```

Source code directories and `package.json` are mapped as volumes in the corresponding container file system.

### Populating the database with initial data
To populate the local database with initial data (languages, genders, native languages, handednesses and safety questions), the command below must be run inside the `server` container.
```
npm run seed:local
```

### Changing the database schema and database migrations
Local `server` service must be up and running to apply changes in the `schema.prisma` file. Then run this command in the `mafil-proband-safety-questionnaire/backend` directory:

```
npx prisma migrate dev --name what-has-changed
```

Update the `server` service after successful migration - see: [service update](#services-update).

## Services update
To update services run these commands in the server app directory:
```
docker-compose -f docker-compose.ENV.yml pull [SERVICE]
docker-compose -f docker-compose.ENV.yml up -d --force-recreate --no-deps [SERVICE]
docker image prune -f
```
It may be necessary to update `.env` variables before running the commands above.

## Notes for the repository owner
### Repository secrets and variables
Repository secrets and variables are currently defined directly in the GitHub repository as GitHub secrets and GitHub variables. They are used in this project's GitHub Workflows to pass different values for different app environments.
  * Secrets:
    * JPM_CLIENT_ID
      * Client ID of the service registered in the [Jednotné přihlášení MUNI](https://it.muni.cz/sluzby/jednotne-prihlaseni-na-muni) OIDC provider
      * For the service admin: https://spreg.aai.muni.cz/
  * Variables:
    * DEV_APP_BAR_COLOR
      * App bar color for the development environment (passed in the source code of the `devel` branch)

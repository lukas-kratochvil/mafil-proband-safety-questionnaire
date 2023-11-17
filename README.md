# MAFIL - Proband Safety Questionnaire
Web application for ensuring the registration and safety of MR measurements in the [MAFIL laboratory (CEITEC)](https://mafil.ceitec.cz/en/).

## Table of contents
- [Repository structure](#repository-structure)
- [Base URL paths](#base-url-paths)
- [Installation](#installation)
  - [Populating the database with initial data](#populating-the-database-with-initial-data)
- [Services update](#services-update)
- [What to be aware of](#what-to-be-aware-of)
- [Local development](#local-development)
  - [Installation](#installation-1)
  - [Populating the database with initial data](#populating-the-database-with-initial-data-1)
  - [Changing the database schema and applying database migrations](#changing-the-database-schema-and-applying-database-migrations)
  - [Useful tools](#useful-tools)
- [Repository owner notes](#repository-owner-notes)
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

After that use the `download.sh` script (located in the project root directory) to download files essential to run the app.
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

## Services update
It may be necessary to update `.env` variables according to `.env.example` before running the commands below.

To update services run these commands in the root directory:
```
docker-compose -f docker-compose.ENV.yml pull [SERVICE]
docker-compose -f docker-compose.ENV.yml up -d --force-recreate --no-deps [SERVICE]
docker image prune -f
```

## What to be aware of
1. Sometimes the client app has a problem with obtaining data from the server API due to an invalid locale.
   * Fix: change the language of the application using the language menu in the app GUI.

## Local development
### Installation
Create a `.env` configuration file inspired by the `.env.local.example` in the root directory and edit `.env` configuration variables with your values.

The docker-compose configuration file to use for the development is called `docker-compose.local.yml`.
Start all the services with the command below:
```
docker-compose -f docker-compose.local.yml up -d
```

The backend and frontend `package.json` and the source code directory are mapped as volumes in the corresponding container filesystem.

Only `node_modules` aren't mapped to Docker containers due to potential platform-specific code. So they must be installed and updated separately on a local machine and in the `server` and `web` Docker containers.

To install Node packages run the command:
```
npm i
```
* on a local machine in the `/`, `/backend` and `/frontend` directories.
* in the `server` Docker container in the `/usr/src/app/backend` directory.
* in the `web` Docker container in the `/usr/src/app/frontend` directory.

### Populating the database with initial data
To populate the local database with initial data (languages, genders, native languages, handednesses and safety questions), the command below must be run inside the `server` container.
```
npm run seed:local
```

The next step is to create an operator in the database. This operator will be used in the authenticated part of the app. Login to the [Adminer](http://localhost:8080/) and create an account in the `Operator` table with exactly the same data as `DEV_OPERATOR` in the `frontend\src\hooks\auth\auth-provider-dev.ts`. There is a tricky part with the operator ID (UUID version 4) - it has to be added manually, try this [UUID v4 generator](https://www.uuidgenerator.net/version4).

### Changing the database schema and applying database migrations
`postgres` and `server` services must be up and running to apply changes from the `schema.prisma` file.

Go into the `server` container terminal and in the `/usr/src/app/backend` directory run:
```
npx prisma migrate dev --name what-has-changed
```

This command will generate a new Prisma client code that corresponds to the current state of the `schema.prisma`.

### Useful tools
* GraphQL playground to test the server GraphQL API: use `server` URL with the path `/graphql`
  * You must specify the same `API_KEY` HTTP header value when sending requests.

## Repository owner notes
### Repository secrets and variables
Repository secrets and variables are currently defined directly in the GitHub repository as GitHub secrets and GitHub variables. They are used in this project's GitHub Workflows to pass different values for different app environments.
  * Secrets:
    * JPM_CLIENT_ID
      * Client ID of the service registered in the [Jednotné přihlášení MUNI](https://it.muni.cz/sluzby/jednotne-prihlaseni-na-muni) OIDC provider
      * OIDC service admin can manage the service here: https://spreg.aai.muni.cz/
  * Variables:
    * DEV_APP_BAR_COLOR
      * App bar color for the development environment (used in the build stage of the `devel` branch Docker image)

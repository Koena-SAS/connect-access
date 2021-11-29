---
sidebar_position: 1
---

# Local environment

## Requirements

Connect Access can be installed and run locally fully with Docker, or without Docker by installing all the needed interpreters and tools:

For local development using Docker:

- Docker Engine v20+
- Docker Compose v1.29+

For local development without docker:

- Python v3.9+
- Node.js v16+
- PostgreSQL v13+

## Initial steps

### Get the repository

To begin, you have to clone the repository locally:

```bash
git clone https://gitlab.com/koena/connect-access.git
```

### Configure the git pre-commit hook

Then you can install the python `pre-commit` package and install the git pre commit hooks, to ensure the code you commit is linted:

```bash
pip install pre-commit
# in the project folder
pre-commit install
```

:::tip

For this step you need to have Python on your machine. You may skip this but you will then have to make sure that all the quality tools are run before you push or the CI will fail.

:::

### Setup the local environment variable files

Some of the configuration is done via environment variables, that are actually taken from files in the `.envs` directory.

First you need to copy `.envs/local_template` to `.envs/.local`, and fill the values in each file. Most of the values are pre-filled to help you start quickly, but you may need to modify them. For example the PostgreSQL database name and user is set to `debug`, if you choose something else you will have to change that.

When using Docker the environment variables will be set directly from the files in `.envs/.local` by docker-compose so you don't need to do anything else.

When using your own machine directly, you will have to source your terminal with the appropriate file containing the environment variables:

```bash
source .envs/.local/local_no_docker_activate
```

## Install and run without Docker

### Database

You need to create a PostgreSQL database for the backend, and another one that will be automatically flushed on each run for the end to end tests.

By default, if you don't change the values copied from `.envs/local_template`, the database name and user name are `debug`, and the end to end database name is `connect_access_end_to_end`.

Here are the commands to create the user and the two databases:

```bash
createuser ${POSTGRES_USER}
createdb ${POSTGRES_DB} -U ${POSTGRES_USER} --password ${POSTGRES_PASSWORD}
createdb ${POSTGRES_DB_END_TO_END} -U ${POSTGRES_USER} --password ${POSTGRES_PASSWORD}
```

If the user creation does not work, you can create it with the psql console (don't forget to replace the user name and apssword):

```bash
sudo -u postgres psql
```

```sql
CREATE ROLE debug WITH CREATEDB LOGIN PASSWORD 'debug';
\q
```

### Backend

#### Install

First you need to create a virtual environment for the python packages:

```bash
python3 -m venv venv
```

Then source it, and install the packages needed for local development:

```bash
source venv/bin/activate
pip install -r backend/requirements/local.txt
```

:::tip

If the installation of some python packages doesn't work because of compilation errors, on linux you may need to install the following dependencies:

```bash
sudo apt install python3.9-dev libpq-dev
```

:::

#### Apply the database migrations

When the database has not the latest database migrations applied, you need to run the following command:

```bash
cd backend
python manage.py migrate
```

#### Build lang files

The french translation has to be built with a command:

```bash
python manage.py compilemessages
```

#### Run the development server

To run the backend in dev mode, use the Django integrated development server:

```bash
python manage.py runserver
```

By default, the backend will be available on [localhost:8000](http://localhost:8000) but without the frontend running there will be nothing displayed there as the root path displays what is available on port 3000.

You can however access the other paths served by the backend, especially the browsable API provided by Django Rest Framework on [localhost:8000/api/](http://localhost:8000/api/).

:::info

In development mode, there are no real emails sent. Everytime an email has to be sent you can see the sent data in the console of the Django development server.

:::

### Frontend

#### Install

You need to have `yarn` installed to run the frontend commands:

```bash
npm install -g yarn
```

Then you can install the frontend npm packages:

```bash
cd frontend
yarn install
```

#### Build lang files

The french translation has to be built with a command:

```bash
yarn lang:compile
```

#### Run the development server

To run the frontend you need to install and run the development server of React:

```bash
yarn start
```

By default, the frontend will be available on [localhost:3000](http://localhost:3000) but you should access the application through [localhost:8000](http://localhost:8000) when both the frontend and the backend are running, because the frontend is actually served through a specific view of the Django app.

## Install and run with Docker

Everything is built and started at once with `docker-compose`, and the local code is mounted to docker, so no need to rebuild at each change.

### Build and run the development servers

You need to build the docker images first, and then run the containers:

```bash
docker-compose -f local.yml build
docker-compose -f local.yml up
```

You could also run it in daemon mode, in that case you dont keep the logs in your terminal, and you will have to stop the containers with another command:

```bash
docker-compose -f local.yml up -d
docker-compose -f local.yml down
```

As with the non-Docker mode, the frontend server is available on [localhost:8000](http://localhost:3000) and the backend server is available on [localhost:8000](http://localhost:8000).

### Execute commands on the frontend or the backend

There is no need to run `python manage.py runserver` and `yarn start` as they are already running, but you can execute any other command on the backend or the frontend:

```bash
docker-compose -f local.yml run -w /app/backend django python manage.py compilemessages
docker-compose -f local.yml run -w /app/frontend django yarn lang:compile
```

## Run Docker staging/production image locally

Running the staging/production image locally is actually the same as running it on a server as docker abstracts everything that matters. You just need to follow the [deployement instructions](../user-documentation/deployement.md) on your local machine.

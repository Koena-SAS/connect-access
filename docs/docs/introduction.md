---
sidebar_position: 1
---

# Introduction

Connect access is a platform that helps managing mediation requests.

Disabled people fill a form with the accessibility problem they have on a specific website, and get contacted by your mediation organization. You can help them with an immediate solution, and if needed contact the organisation responsible for the website to try to find a more sustainable solution of the accessibility problem.

You have also the possibility to fill reports for everytime you contact someone in the process.

## Getting started quickly

You can install quickly the application on your local machine with [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).

Here are the commands to build and start the app:

```bash
# get the repository
git clone https://gitlab.com/koena/connect-access.git
cd connect-access
# create the environment variable files
cp -r .envs/local_template .envs/.local
# activate local enviromnent variables
source .envs/.local/local_no_docker_activate
# build the Docker images
docker-compose -f local.yml build
# create the database tables
docker-compose -f local.yml run -w /app/backend django python manage.py migrate
# install the frontend dependencies
docker-compose -f local.yml run -w /app/frontend django yarn install
# run the Docker containers
docker-compose -f local.yml up
```

The application will be available on [localhost:8000](http://localhost:8000).

## Deploying to production

To deploy to production environment please read the [documentation page about deployement](./user-documentation/deployement.mdx).

## Contributing

This application is open source, under [AGPL V3 license](https://www.gnu.org/licenses/agpl-3.0.en.html).

To contribute you can start by reading the [contribution guidelines](./developer-documentation/contributing.md), and if you would like to contribute to the code, you will probably need to [install the local environment](./developer-documentation/local-environment.mdx).

# this file is less reliable than merge_production_dotenvs_in_dotenv.py because it is not unit tested
# but it works in testing environments that have no python interpreter
cat .envs/.production/.django .envs/.production/.postgres .envs/.production/.traefik .envs/.production/.docker .envs/.production/.data > .env_production
cat .envs/.staging/.django .envs/.staging/.postgres .envs/.staging/.traefik .envs/.staging/.docker .envs/.staging/.data > .env_staging

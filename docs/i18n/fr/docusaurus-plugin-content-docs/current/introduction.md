---
sidebar_position: 1
---

# Introduction

<span lang="en">Connect Access</span> est une plateforme qui permet de gérer des demandes de médiation.

Les personnes handicapées remplissent un formulaire pour expliquer leur problème d'accessibilité sur des sites spécifiques, et sont contactées par votre organisme de médiation. Vous pouvez les aider avec une solution immédiate, et si besoin contacter l'organisation responsable du site web problématique pour trouver une solution pérenne.

Vous avez aussi la possibilité de remplir des rapports de suivi à chaque fois que vous contactez quelqu'un dans le processus.

## Démarrage rapide

Vous pouvez installer rapidement l'application sur votre machine locale avec [Docker](https://docs.docker.com/get-docker/) et [Docker Compose](https://docs.docker.com/compose/install/).

Voici les commandes pour construire et démarrer l'app:

```bash
# télécharger le dépôt
git clone https://gitlab.com/koena/connect-access.git
cd connect-access
# créer les fichiers de variable d'environnement
cp -r .envs/local_template .envs/.local
# activer les variables d'environnement locales
source .envs/.local/local_no_docker_activate
# construire les images Docker
docker-compose -f local.yml build
# créer les tables de la base de données
docker-compose -f local.yml run -w /app/backend django python manage.py migrate
# installer les dépendances du frontend
docker-compose -f local.yml run -w /app/frontend django yarn install
# démarrer les containers Docker
docker-compose -f local.yml up
```

L'application sera disponible sur [localhost:8000](http://localhost:8000).

## Déployer en production

Pour déployer en environment de production, veuillez lire la [documentation à propos du déploiement](./user-documentation/deployement.mdx).

## Contribuer

Cette application est open source, sous la [licence AGPL V3](https://www.gnu.org/licenses/agpl-3.0.fr.html).

Pour contribuer vous pouvez commencer par lire le [guide de contribution](./developer-documentation/contributing.md), et si vous voulez contribuer au code, vous aurez probablement besoin d'[installer l'environnement local](./developer-documentation/local-environment.mdx).

## Version étendue

Une extension propriétaire a été faite par Koena pour intégrer des fonctionnalités liés aux organisations partenaires :

- Une interface spécifique pour chaque partenaire, avec des couleurs, un texte de description et un logo personnalisables, et un chemin dédié de manière à ce que chaque partenaire puisse créer un lien sur son site web, pour rediriger vesa version du formulaire de demande de médiation.
- Une page d'orientation pour informer les visiteurs du service de médiation, et les laisser choisir entre aller sur la plateforme ou contacter plutôt le partenaire directement dans le cas où la requête ne porte pas sur l'accessibilité.

Vous pouvez [nous contacter](https://koena.net/) si vous êtes intéressé par cette extension.

---
sidebar_position: 2
---

# Contribuer

Merci d'envisager de contribuer à ce projet. Il y a de nombreux moyens pour contribuer, parmi lesquels l'implémentation de fonctionnalités ou la correction de <span lang="en">bugs</span> au travers de <span lang="en">merge requests</span>, mais aussi l'amélioration de la documentation, ou encore la création de tickets pour de nouvelles fonctionnalités ou des rapports de <span lang="en">bugs</span>.

Si vous voulez contribuer, nous vous demandons de rester bienveillant et respectueux.

## Demandes de fonctionnaltés et rapports de <span lang="en">bugs</span>

Avante de créer un ticket, vuillez chercher dans [la liste des tickets existants](https://gitlab.com/koena/connect-access/-/issues) pour voir si quelque chose de similaire n'existe pas déjà.

Dans le cas d'un rapport de <span lang="en">bug</span>, le fait de fournir des instructions détaillées pour reproduire le problème peut vraiment aider à le résoudre rapidement. Merci d'utiliser les modèles de tickets qui sont disponibles lors de leur création.

## Documentation

La documentation que vous êtes en train de lire a été construite avec [Docusaurus](https://docusaurus.io/) et a ses fichiers source dans ce dépôt, dans le répertoire `docs/`. Ces fichiers source peuvent contenir du <span lang="en">markdown</span> mais aussi du code <abbr title="JavaScript Syntax Extension" lang="en">JSX</abbr>.

Le documentation est générée et déployée sur <span lang="en">Gitlab Pages</span> quand la branche est fusionnée sur <span lang="en">`master`</span>.

## Contrinution au code

### <span lang="en">Merge requests</span> et intégration continue

Toutes les contributions de code sont faites au travers de <span lang="en">pull/merge requests</span> attachées à des tickets (<span lang="en">issues</span>), pour permettre d'avoir des discussions et des revues de code, mais aussi pour laisser la <abbr title="Continuous Integration" lang="en">CI</abbr> valider que tout fonctionne.

Dans la mesure du possible, veuillez envisager de soumettre vos idées et de <span lang="en">commit</span> / pousser votre travail tôt pour obtenir des retours, plutôt que travailler longtemps sur quelque chose qui pourrait ne jamais être intégré. Avec Gitlab, une nouvelle branche est créée automatiquement avec la <span lang="en">merge request</span>.

Essayez de garder vos <span lang="en">merge requests</span> petites, idéalement pas plus d'1 ou 2 jours de travail. Pour que votre code soit intégré les tests doivent passer, mais la fonctionnalité peut très bien ne pas être complète. Dans ce cas vous pouvez cacher la fonctionnalité avec du CSS si besoin jusqu'à ce qu'elle soit prête à être montrée.

### <span lang="en">Commits</span> conventionnels

Nous suivons les [directives <span lang="en">Commits</span> Conventionnels](https://www.conventionalcommits.org/fr/v1.0.0/) pour nos messages de <span lang="en">commit</span>. Vous pouvez consulter ces directives et l'historique de <span lang="en">commit</span> du projet pour avoir une idée de la convention utilisée dans le projet.

Cette convention est suivie sur la branche <span lang="en">`master`</span>, mais vous pourriez ne pas la suivre sur vos branches jusqu'à ce qu'elles soient fusionnées, étant donné que les messages de <span lang="en">commit</span> seront fusionnés en un seul <span lang="en">commit</span> pour l'ensemble de votre <span lang="en">merge request</span>.

### Architecture

Pour obtenir des informations sur l'architecture générale utilisée et sur la manière de modifier des éléments spécifiques, veuillez consulter la [page de documentation concernant l'architecture](./architecture.md).

## Qualité du code

Le code doit garder un bon niveau de qualité. Il doit rester lisible, formaté correctement et testé. Le style doit rester <span lang="en">responsive</span>. Il doit aussi être accessible autant que possible pour inclure toutes les personnes.

Pour commencer votre contribution de code, veuillez suivre les [instructions pour l'installation de l'environnement local](./local-environment.mdx).

### Accessibilité

Le projet suit les [directives WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/), et plus particulièrement le [référentiel RGAA](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/).

Vous devez vous assurer dans la mesure du possible qu'au moins les règles WCAG de niveau AA sont respectées. Il s'agit de celles reprises dans le RGAA.

Pour certaines d'entre-elles, vous pouvez être alerté par le <span lang="en">linter</span> du <span lang="en">frontend</span> qui utilise [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) pour analyser le code <abbr title="JavaScript Syntax Extension" lang="en">JSX</abbr> de React et trouver des problèmes d'accessibilité, mais également l'outil [axe](https://github.com/dequelabs/axe-core) qui est utilisé sur le code HTML final généré pendant les tests de bout en bout. Mais pour la plupart des règles, vous devrez les vérifier vous-mêmes, ou avec l'aide d'un autre être humain pour vérifier votre code.

### Qualité de code du <span lang="en">backend</span>

#### Test et <span lang="en">lint</span>

Pour lancer les tests unitaires et les outils de <span lang="en">lint</span>, vous pouvez lancer le fichier de script dans le dossier <span lang="en">`backend`</span> :

```bash
chmod +x test_all.sh
./test_all.sh
```

Ce fichier contient en fait toutes les commandes individuelles qui peuvent être lancées :

```bash
flake8 ../backend --config=setup.cfg --max-complexity=10 # pour le lint du code
mypy connect_access config --config=setup.cfg # pour la vérification statique des types
black --check . # pour la vérification du style de formatage du code
pytest # pour les tests unitaires
```

### Qualité de code du <span lang="en">frontend</span>

#### Test et <span lang="en">lint</span>

Pour lancer tous les tests unitaires et outils de <span lang="en">lint</span>, vous pouvez lancer la commande suivante :

```bash
yarn test-all
```

Ce qui correspond à l'ensemble de ces commandes lancées une par une :

```bash
yarn lint # pour le lint
yarn type-check # pour la vérification statique des types
yarn test # pour les tests unitaires
```

Vous pouvez aussi lancer la vérification du style de formatage du code avec :

```bash
yarn format-check
```

### Tests de bout en bout

Les tests de bout en bout sont actuellement situés dans le répertoire du <span lang="en">frontend</span>, et utilisent [CodeceptJS](https://codecept.io/).

#### En utilisant l'environnement de développement

Pour lancer le <span lang="en">backend</span> et le <span lang="en">frontend</span> dans les tests de bout en bout avec l'environnement de développement, vous devez installer aussi `pm2` :

```bash
npm install -g pm2
```

:::info

Pour éviter le conflit avec des instances démarrées de serveurs de développement de <span lang="en">backend</span> et de <span lang="en">frontend</span>, les serveurs du <span lang="en">backend</span> et du <span lang="en">frontend</span> pour les tests de bout en bout sont démarrés par défaut sur les ports **3501** et **3502**.

:::

Les tests peuvent être lancés avec :

```bash
cd frontend/
yarn e2e
```

#### En utilisant l'environnement de production

Vous pouvez exécuter des tests de bout en bout dans l'environnement de production Docker. Cependant, vous aurez toujours besoin d'avoir Node.js installé sur votre machine.

:::info

Pour éviter tout conflit avec un autre serveur de production démarré sur votre machine, le serveur pour les tests de bout en bout sera démarré par défaut sur le port **6001**.

:::

Les tests peuvent être lancés avec :

```bash
cd frontend/
yarn e2e:prod
```

L'image Docker de production sera construite et exécutée, et toutes les informations seront affichées dans votre terminal.

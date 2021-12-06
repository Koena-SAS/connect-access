---
sidebar_position: 3
---

# Architecture

## Architecture générale

L'application est principalement composée :

- d'un <span lang="en">backend</span> utilisé comme <abbr title="Application Programming Interface" lang="en">API</abbr> REST.
- d'un <span lang="en">frontend</span> sous forme de <span lang="en">single page application</span> consommant l'<span lang="en">API</span> du <span lang="en">backend</span>.

Le <span lang="en">frontend</span> est toujours servi depuis le <span lang="en">backend</span>, comme ressource complètement statique en production, et comme redirection vers le serveur du <span lang="en">frontend</span> en développement. C'est pourquoi on accède toujours à l'application à partir du serveur du <span lang="en">backend</span>, y compris en développement.

Un des avantages est qu'il est possible de générer des données côté serveur par une vue Django, et de l'ajouter en tant que code HTML ou JavaScript directement dans le gabarit de la page d'index qui est utilisé par React. Ceci permet dans une certaine mesure de mettre en place du rendu côté serveur.

:::note

La manière de gérer le <span lang="en">frontend</span> à travers la <span lang="en">backend</span> a été inspirée d'[un article de Tristan Wagner](https://medium.com/@twagner000/django-create-react-app-without-ejecting-958251af362c), avec l'utilisation de <span lang="en">`django-webpack-loader`</span> et <span lang="en">`webpack-bundle-tracker`</span>.

Cette configuration permet le <span lang="en">hot reload</span> du <span lang="en">frontend</span> en développement, même s'il est servi à travers une vue du <span lang="en">backend</span>, et même en utilisant Docker.

:::

Il y a actuellement 2 exceptions où le <span lang="en">backend</span> sert des pages HTML au lieu d'être utilisé comme une <span lang="en">API</span> web par un autre programme :

- la <span lang="en">browsable API</span> fournie par Django REST Framework sur le chemin `/api/` lorsqu'il est visité par un navigateur, pour pouvoir exécuter des appels d'<span lang="en">API</span> au travers d'une page web sans utiliser le <span lang="en">frontend</span>.
- l'interface d'administration fournie par Django sur le chemin `/admin/` (et sur un chemin secret configuré dans `.envs/.production/.django` pour l'environnement de production) pour pouvoir facilement manipuler les objets de la base de donnéesans avoir d'interface <span lang="en">frontend</span> personnalisée pour eux.

## <span lang="en">Backend</span>

Le <span lang="en">backend</span>est écrit en Python avec le <span lang="en">framework</span> Django. Le code initial a été crée avec <span lang="en">[cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django)</span>. La documentation de <span lang="en">cookiecutter-django</span> peut grandement aider à comprendre la manière dont est structuré le code du <span lang="en">backend</span>.

Il utilise une base de données PostgreSQL dans tous les environnements, et un <span lang="en">message broker</span> RabbitMQ à travers Celery en production.

### Internationalisation

L'internationalisation est faite à l'aide du mécanisme principal d'internationalisation de Django :

```python {3}
from django.utils.translation import gettext_lazy as _

_("Contenu à traduire")
```

Une fois que du contenu à traduire est crée, vous pouvez regénérer les fichiers de traduction pour obtenir les chaînes à traduire, ajouter les traductions, et créer une version compilée de la traduction.

Les chaînes traduites sont dans `backend/locale/[LANG]/django.po`.

```bash
python manage.py makemessages -l fr # créer les traductions pour la langue française
# changer le contenu des traductions dans /backend/locale/fr/django.po
python manage.py compilemessages # compiler les fichiers de traduction
```

## <span lang="en">Frontend</span>

Le <span lang="en">frontend</span> est écrit en TypeScript avec le <span lang="en">framework</span> React. Le code initial a été généré avec <span lang="en">[create-react-app](https://create-react-app.dev/)</span>.

### Style

Les fichiers source de style sont dans `frontend/src/sass`.

Le style est crée avec le [préprocesseur SASS](https://sass-lang.com/). Les fichiers sont organisés avec l'[architecture 7-1](https://kiranworkspace.com/sass-architecture/), et le code en lui-même est organisé avec la [méthodologie <abbr lang="en" title="Block Element Modifier">BEM</abbr>](http://getbem.com/)

Ceci implique que les blocks de style sont indépendants des composants React. Ils peuvent être réutilisés ou être plus gros ou plus petits qu'un composant spécifique.

### Internationalisation

L'internationalisation est faite à l'aide de [LinguiJS](https://lingui.js.org/). Maincipalement avec l'utilisation des macros `Trans` and `t`.

```typescript {6,7}
import { t, Trans } from "@lingui/macro";

function MyComponent(): JSX.Element {
  return (
    <>
      <Trans>Contenu à traduire</Trans>
      <AnotherComponent customProp={t`Contenu à traduire`} />
    </>
  );
}
```

Une fois que du contenu à traduire est crée, vous pouvez regénérer les fichiers de traduction, ajouter les traductions correctes, et créer une version compilée de ces traductions.

Les chaînes de traduction sont dans `frontend/src/locales/[LANG]/messages.po`.

```bash
yarn lang:extract # créer des traductions pour les langues française et anglaise
# changer le contenu des traductions dans /frontend/src/locales/fr/messages.po
yarn lang:compile # compiler les fichiers de traduction
```

## Communication <span lang="en">frontend</span> - <span lang="en">backend</span>

### Appels REST

Étant donné que le <span lang="en">backend</span> expose une <span lang="en">API</span> REST, le principal canal de communication est l'envoi d'appels REST à partir du <span lang="en">frontend</span>. C'est fait paincipalement en utilisant `axios`.

### <span lang="en">Stale While Revalidate</span>

Pour toutes les ressources qui sont régulièrement mises à jour à partir du <span lang="en">frontend</span> pour rester à jour parce que le <span lang="en">backend</span> en est la source de vérité, nous utilisons [<abbr lang="en" title="Stale While Revalidate">SWR</abbr>](https://swr.vercel.app/) pour gérer les mises à jour lorsque c'est nécessaire. C'est utilisé comme <span lang="en">hook</span> dans le composant qui a directement besoin de cette ressource.

### Génération côté serveur

React est injecté dans un gabarit de Django qui est situé dans `frontend/public/index.html`. Nous sommes ainsi capables de créer une variable JavaScript appelée `window.SERVER_DATA` dans ce gabarit, et de mettre dedans tout ce qui peut être utile depuis la vue Django qui gère ce gabarit (située dans `backend/connect_access/views.py`).

Ces données sont disponibles côté React immédiatement après que le navigateur ait commencé à exécuter le code JavaScript, sans avoir besoin de faire d'appels REST via une <span lang="en">API</span>.

## Stratégie de test

### Tests unitaires

La majeure partie du code du <span lang="en">backend</span> et du <span lang="en">frontend</span> a été écrit avec le Développement Piloté par les Tests (<abbr lang="en" title="Test Driven Development">TDD</abbr>), en utilisant les étapes d'itération les plus petites possibles entre le test et l'implémentation, pour piloter l'implémentation par le test. Cependant ces tests sont plus proches de ce qu'on pourrait appeler des tests d'intégration dans la mesure où ils sont effectués à travers la base de données dans le cas du <span lang="en">backend</span>, et à travers l'interface utilisateur (même si une version plus légère est utilisée avec `jsdom`) pour le <span lang="en">frontend</span>.

Ainsi, l'exécution de ces tests unitaires est plus lente que s'ils testaient du Python ou du TypeScript pur, surtout pour les tests du <span lang="en">frontend</span> qui mettent plus de 30 secondes à s'exécuter sur un ordinateur moderne. Vous êtes par conséquent encouragés à tester unitairement le code complexe en dehors de l'utilisation de la base de données pour le <span lang="en">backend</span>, et en dehors de React pour le <span lang="en">frontend</span>.

Concernant les tests du <span lang="en">frontend</span>, tous les appels d'<span lang="en">API</span> sont simulés avec des <span lang="en">mocks</span>.

### Tests de bout en bout

Pour les tests de bout en bout tout est démarré comme en production, et les tests sont exécutés avec un vrai navigateur, en mode visible ou <span lang="en">headless</span>.

Ces tests sont beaucoup moins nombreux parce qu'ils deviennent facilement sujets aux faux positifs, et parce qu'un seul test peut prendre plusieurs secondes à s'exécuter et que la parallélisation est plus difficile dans le mode de bout en bout.

Plutôt que de tester tous les chemins de succès et d'erreur possibles comme avec les tests unitaires, nous testons seulement le chemin utilisateur principal pour chaque fonctionnalité. Ceci assure notamment que la communication entre le <span lang="en">frontend</span> et le <span lang="en">backend</span> se fait correctement.

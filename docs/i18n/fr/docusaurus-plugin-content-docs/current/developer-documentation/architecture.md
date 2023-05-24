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

De plus, il est structuré de manière à ce que toutes les fonctionnalités (applications django) de base puissent être personnalisées pour répondre aux besoins de votre projet.

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

## Personnaliser <span lang="en">Connect Access</span>

### <span lang="en">Backend</span>

#### <span lang="en">Fork</span> d'une application de base

##### Création d'un module python avec le même label

Vous devez créer un module Python avec le même label d'application que l'application <span lang="en">Connect Access</span> que vous souhaitez étendre.

Par exemple, pour créer une version locale de `connect_access.apps.mediations`, procédez comme suit :

```shell
mkdir votreprojet/mediations
mkdir votreprojet/mediations/__init__.py
```

##### Import et/ou modification d'un modèle de base

Si l'application <span lang="en">Connect Access</span> originale possède un fichier `models.py`, vous devrez créer un fichier `models.py` dans votre application locale. Il doit importer tous les modèles de l'application <span lang="en">Connect Access</span> qui sont remplacés, vous pouvez aussi y modifier le modèle :

```python
# votreprojet/mediations/models.py

from django.db import models

from connect_access.apps.mediations.abstract_models import AbstractMediationRequest

# your custom models go here
class MediationRequest(AbstractMediationRequest):
    new_field = models.CharField()

from connect_access.apps.mediations.models import * #noqa
```

Veillez à importer les autres modèles d'origine à la fin de votre fichier.

:::note

L'utilisation de `from ... import *` est étrange, n'est-ce pas ? Oui, mais cela doit être fait au bas du module en raison de la manière dont Django enregistre les modèles. Si deux modèles portant le même nom sont déclarés dans une application, Django n'utilisera que le premier. Cela signifie que si vous souhaitez personnaliser les modèles de <span lang="en">Connect Access</span>, vous devez déclarer vos modèles personnalisés avant d'importer les modèles de <span lang="en">Connect Access</span> pour cette application.

:::

##### Import et/ou modification à l'API d'un modèle de base

Si l'application <span lang="en">Connect Access</span> originale possède des fichiers `api.py` et `serializers.py`, vous devrez recréer ses fichiers dans votre application locale.

- `api.py`doit importer tous les [`ViewSet`](https://www.django-rest-framework.org/api-guide/viewsets/#viewsets) de l'application de base ;

```python
# votreprojet/mediations/api.py

from connect_access.apps.mediations.api import (
    MediationRequestViewSet as BaseMediationRequestViewSet,
)

from .serializers import MediationRequestSerializer

class MediationRequestViewSet(BaseMediationRequestViewSet):
    pass
```

- `serializers.py` doit importer tous les [`Serializers`](https://www.django-rest-framework.org/api-guide/serializers/) de l'application de base.

```python
# votreprojet/mediations/serializers.py

from connect_access.apps.mediations.serializers import (
    MediationRequestSerializer as BaseMeditionRequestSerializer,
)

class MediationRequestSerializer(BaseMeditionRequestSerializer):
	pass
```

##### Mise à jours du schéma

La dernière chose que vous devez faire maintenant est de faire en sorte que Django mette à jour le schéma de la base de données et crée une nouvelle colonne dans la table des <span lang="en">mediation requests</span>. Nous recommandons d'utiliser des migrations pour cela, il vous suffit donc de créer une nouvelle migration de schéma.

Il est possible de créer simplement une nouvelle migration de catalogue (en utilisant `./manage.py makemigrations mediations`) mais ce n'est pas recommandé car toutes les dépendances entre les migrations devront être appliquées manuellement (en ajoutant un attribut <span lang="en">`dependencies`</span> à la classe de migration).

La méthode recommandée pour gérer les migrations est de copier le répertoire des migrations depuis `connect_access/apps/mediations` dans votre nouvelle application <span lang="en">`mediations`</span>. Vous pouvez ensuite créer une nouvelle migration (supplémentaire) en utilisant la commande de gestion <span lang="en">`makemigrations`</span> :

```shell
python manage.py makemigrations mediations
```

Pour appliquer la migration que vous venez de créer, il vous suffit d'exécuter `python manage.py migrate mediations` et la nouvelle colonne est ajoutée à la table des <span lang="en">mediation requests</span> dans la base de données.

##### Ajout du modèle à l'interface d'administration Django

Lorsque vous remplacez une des applications de <span lang="en">Connect Access</span> par une application locale, l'intégration de l'administration de Django est perdue. Si vous souhaitez l'utiliser, vous devez créer un fichier `admin.py` et importer le `admin.py` de l'application principale (qui exécutera le code d'enregistrement) :

```python
# votreprojet/mediations/admin.py
from connect_access.apps.mediations.admin import (
	MediationRequestAdmin as BaseMediationRequestAdmin
)

from votreprojet.mediations.models import MediationRequest

class MediationRequestAdmin(BaseMediationRequestAdmin):
    pass

MediationRequestAdmin.unregister(MediationRequest)
MediationRequestAdmin.register(MediationRequest)
```

##### Définir la configuration de l'application

Pour que Django charge cette nouvelle application il faut définir sa configuration en définissant une sous-classe de [`AppConfig`](https://docs.djangoproject.com/fr/4.2/ref/applications/#django.apps.AppConfig) avec l'attribut `default = True`.

```python
# votreprojet/mediations/apps.py
from connect_access.apps.mediations.apps import MediationsConfig as BaseMediationsConfig

class MediationsConfig(BaseMediationsConfig):
    name = "votreprojet.mediations"
    default = True
```

##### Remplacer l'application de <span lang="en">Connect Access</span> par la vôtre dans <span lang="en">`INSTALLED_APPS`</span>

Vous devez indiquer à Django que vous avez remplacé l'une des applications principales de <span lang="en">Connect Access</span>. Vous pouvez le faire en remplaçant son entrée dans le paramètre <span lang="en">`INSTALLED_APPS`</span> par celle de votre propre application.

```python
INSTALLED_APPS = [
    # toutes vos applications non Connect Access
    ...
	# applications Connect Access
    ...
    # 'connect_access.apps.mediations', # remplaced by
    'votreprojet.mediations',
    ...
]
```

## Stratégie de test

### Tests unitaires

La majeure partie du code du <span lang="en">backend</span> et du <span lang="en">frontend</span> a été écrit avec le Développement Piloté par les Tests (<abbr lang="en" title="Test Driven Development">TDD</abbr>), en utilisant les étapes d'itération les plus petites possibles entre le test et l'implémentation, pour piloter l'implémentation par le test. Cependant ces tests sont plus proches de ce qu'on pourrait appeler des tests d'intégration dans la mesure où ils sont effectués à travers la base de données dans le cas du <span lang="en">backend</span>, et à travers l'interface utilisateur (même si une version plus légère est utilisée avec `jsdom`) pour le <span lang="en">frontend</span>.

Ainsi, l'exécution de ces tests unitaires est plus lente que s'ils testaient du Python ou du TypeScript pur, surtout pour les tests du <span lang="en">frontend</span> qui mettent plus de 30 secondes à s'exécuter sur un ordinateur moderne. Vous êtes par conséquent encouragés à tester unitairement le code complexe en dehors de l'utilisation de la base de données pour le <span lang="en">backend</span>, et en dehors de React pour le <span lang="en">frontend</span>.

Concernant les tests du <span lang="en">frontend</span>, tous les appels d'<span lang="en">API</span> sont simulés avec des <span lang="en">mocks</span>.

### Tests de bout en bout

Pour les tests de bout en bout tout est démarré comme en production, et les tests sont exécutés avec un vrai navigateur, en mode visible ou <span lang="en">headless</span>.

Ces tests sont beaucoup moins nombreux parce qu'ils deviennent facilement sujets aux faux positifs, et parce qu'un seul test peut prendre plusieurs secondes à s'exécuter et que la parallélisation est plus difficile dans le mode de bout en bout.

Plutôt que de tester tous les chemins de succès et d'erreur possibles comme avec les tests unitaires, nous testons seulement le chemin utilisateur principal pour chaque fonctionnalité. Ceci assure notamment que la communication entre le <span lang="en">frontend</span> et le <span lang="en">backend</span> se fait correctement.

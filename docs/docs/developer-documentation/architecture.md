---
sidebar_position: 3
---

# Architecture

## General architecture

The application mainly consists of:

- a backend used as a REST API
- a single page application frontend consuming the backend API

The frontend is always served from the backend, as a fully static resource in production, and as a redirection to the frontend server in development. That's why we always access the application from the backend server, including in development.

One of the advantages is that it is possible to compute data on server side by the Django view, and put it as HTML or JavaScript code directly in the index template page that is being used by React. This enables server side rendering to some extent.

:::note

The way the frontend is handled through the backend has been inspired from [an article by Tristan Wagner](https://medium.com/@twagner000/django-create-react-app-without-ejecting-958251af362c), with the usage of `django-webpack-loader` and `webpack-bundle-tracker`.

This configuration enables hot reload for the frontend in development, even if it is served through a backend view, and even when using Docker.

:::

There are currently 2 exceptions where the backend serves HTML pages instead of being used as a web API by another program:

- the browsable API provided by Django Rest Framework at `/api/` when visited by a web browser, to be able to execute API calls through a web page without the frontend.
- the admin interface provided by Django at `/admin/` (and at a secret path configured in `.envs/.production/.django` for production environment) to be able to easily manipulate database objects without having a custom frontend for it.

## Backend

The backend is written in Python with the Django framework. Its codebase has been bootstrapped with [cookiecutter-django](https://github.com/cookiecutter/cookiecutter-django). The cookiecutter-django documentation can help a lot to understand the way the backend is structured.

It uses a PostgreSQL database on all environments, and a RabbitMQ message broker through Celery on production.

### Internationalization

The interationalization is done through the Django main internationalization mechanism:

```python {3}
from django.utils.translation import gettext_lazy as _

_("Content to translate")
```

Once some translatable content is created, you can regenerate the locale files to get the strings to translate , add the correct translation, and create a compiled versions of the translation.

The translated strings are in `backend/locale/[LANG]/django.po`.

```bash
python manage.py makemessages -l fr # create translations for french language
# change the translations in /backend/locale/fr/django.po
python manage.py compilemessages # compile the translation files
```

## Frontend

The frontend is written in TypeScript with the React framework. Its codebase has been bootstrapped with [create-react-app](https://create-react-app.dev/).

### Styling

The styling source files are in `frontend/src/sass`.

The styling is done with [SASS preprocessor](https://sass-lang.com/). The files are organized with the [7-1 architecture](https://kiranworkspace.com/sass-architecture/), and the code itself is organized with the [<abbr title="Block Element Modifier">BEM</abbr> methodology](http://getbem.com/).

This implies that the styling blocks are independent from the React components. They may be reused or be bigger or smaller than a specific component.

### Internationalization

The internationalization is done with [LinguiJS](https://lingui.js.org/). Mainly with `Trans` and `t` macros.

```typescript {6,7}
import { t, Trans } from "@lingui/macro";

function MyComponent(): JSX.Element {
  return (
    <>
      <Trans>Content to translate</Trans>
      <AnotherComponent customProp={t`Content to translate`} />
    </>
  );
}
```

Once some translatable content is created, you can regenerate the locale files, add the correct translation, and create a compiled versions of the translation.

The translated strings are in `frontend/src/locales/[LANG]/messages.po`.

```bash
yarn lang:extract # create translations for french and english languages
# change the translations in /frontend/src/locales/fr/messages.po
yarn lang:compile # compile the translation files
```

## Frontend - backend communication

### REST calls

As the backend exposes a REST API, the main communication channel is the REST calls from the frontend. It is mainly done with `axios`.

### Stale While Revalidate

For all the resources that are regularly queried from the frontend to stay up to date because the backend is the source of truth, we use [SWR](https://swr.vercel.app/) to handle de refetches when necessary. It is being used as a hook in the component that directly needs the resource.

### Server side generation

React is injected in a Django template that is located in `frontend/public/index.html`. We are thus able to create a JavaScript variable called `window.SERVER_DATA` in that template, and put inside anything useful from the Django view that handles the template (located at `backend/connect_access/views.py`).

These data are available on React side immediately after the browser starts executing the JavaScript code, without the need to make a REST API call.

## Testing strategy

### Unit Tests

Most of the backend and frontend code has been written with Test Driven Development style, by using the smallest possible iteration steps between the test and the implementation to drive the implementation from the tests. However these tests are closer to what can be called integration tests because they are done through the database for the backend, and through the UI (even if it is a light version of it with `jsdom`) for the frontend.

As a consequence, the execution of unit tests is slower than if it was pure Python or TypeScript code, especially for the frontend tests that take more than 30 seconds to execute on a modern computer. You are therefore encouraged to unit test complex logic outside of the database for the backend, and outside of React for the frontend.

Regarding the frontend tests, all the API calls are mocked. They return predefined data that the frontend expects from the backend.

### End to end tests

For end to end tests everything is started as in production, and the tests are done through a real browser, in visible or headless mode.

These tests are much less numerous because they get easily flaky, and because one test can take several seconds to execute and parallelization is more difficult in end to end mode.

Instead of testing all the possible successful and error paths like with unit tests, we test the main successful path for each main feature. It especially ensures the communication between the frontend and the backend is correct.

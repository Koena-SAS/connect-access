---
sidebar_position: 2
---

# Contributing

Thank you for considering to contribute to this project. There are many ways you can contribute, including features or bug fixes through pull requests, but also documentation improvement, opening issues for bugfixes or proposing feature requests.

If you would like to contribute please be kind and respectful.

## Feature requests and bug reports

Before creating an issue, please search in the [existing issues](https://gitlab.com/koena/connect-access/-/issues) if something similar doesn't already exist.

In case of bug report, providing detailed instructions to reproduce can really help fixing the bug quickly. Please use the provided issue templates.

## Documentation

The documentation you are reading is built with [Docusaurus](https://docusaurus.io/) and has its source files in the repository, in the `docs/` folder. The source files can contain markdown code but also JSX code.

The documentation is built and deployed to Gitlab Pages when the branch is merged to master.

## Code contribution

### Merge requests and continuous integration

All the code contributions are made through pull/merge requests attached to an issue, to have discussion and code reviews, but also to let the CI validate that everything works.

As much as possible please consider submitting your ideas and commiting/pushing your work early to get feedback, instead of working very long on something that may not be integrated. With gitlab, a new branch is created automatically with the merge request.

Please try to keep your merge requests small (ideally not more than 1 or 2 days of work). To get your code integrated the tests have to pass, but the feature may not be complete. In that case you can hide the feature with CSS if needed until it is ready to be shown.

### Conventional commits

We are following the [Conventionnal Commits guidelines](https://www.conventionalcommits.org/en/v1.0.0/) for our commit messages. Please take a look at these guidelines and at the commit log history of the project to have an idea of the used convention.

The convention is followed on branch `master`, but you may not follow it on your branch until merged, as the commit messages will be squashed in one commit for your whole merge request.

### Architecture

For some insights on the general architecture that is used, and some insights on how to modify specific things, please take a look at the [architecture documentation page](./architecture.md).

## Code quality

The code has to maintain a good level of quality. It has to remain readable, correctly formatted and tested. The styling has to remain responsive. It should also be accessible as much as possible to include everyone.

To begin your code contribution, please follow the [instructions for local environment installation](./local-environment.mdx).

### Accessibility

The project follows the [WCAG guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/), and specifically the french [RGAA norm](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/).

You have to make sure as much as possible that at least the WCAG AA level rules are respected.

For some of them you may be alerted by the frontend linter that uses [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) to parse the JSX React code and find accessibility issues, and also the [axe](https://github.com/dequelabs/axe-core) tool used on the final generated HTML code during the end to end tests. But for most of them you will have to check them yourself, or with the help of a human being reviewing your code.

### Backend code quality

#### Testing and linting

To run all unit tests and linting tools, you can run the script file in the `backend` folder:

```bash
chmod +x test_all.sh
./test_all.sh
```

That file contains actually all the individual commands that can be run:

```bash
flake8 ../backend --config=setup.cfg --max-complexity=10 # for code linting
mypy connect_access config --config=setup.cfg # for static type checking
black --check . # for code style checking
pytest # for unit tests
```

### Frontend code quality

#### Testing and linting

To run all unit tests and linting tools, you can run the following command:

```bash
yarn test-all
```

Which corresponds to these commands run one by one:

```bash
yarn lint # for linting
yarn type-check # for static type checking
yarn test # for unit testing
```

You can also run the code style check with:

```bash
yarn format-check
```

### End to end tests

The end to end tests are currently located in the frontend directory, and are using [CodeceptJS](https://codecept.io/).

To run the backend and frontend in end to end tests you need also to install `pm2`:

```bash
npm install -g pm2
```

:::info

To avoid conflicting with the started development backend and frontend servers, the backend and the frontend servers for the end to end tests will be started by default on ports 3501 and 3502.

:::

The tests can be run with:

```bash
cd frontend/
yarn e2e
```

# Frontend

The frontend part has been built with [Create React App](https://github.com/facebook/create-react-app).

## Quality checks

### eslint

First install the dependencies:

```bash
cd frontend
yarn install
```

Then run eslint:

```bash
yarn lint
```

### prettier

The code uses `prettier` for its javascript code style.

## Tests

To execute the tests, you first need to install the local dependencies:

```bash
cd frontend
yarn install
```

### Unit tests

Unit tests are performed with `jest`:

```bash
yarn test
```

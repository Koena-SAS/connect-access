# Backend

The backend part has been built with [cookiecutter-django](https://github.com/pydanny/cookiecutter-django/) template.

## Quality checks

### flake8

Most of the quality cheks are performed with `flake8` and its plugins:

First install the code quality dependencies:

```bash
cd backend
pip install -r requirements/code_quality.txt
```

Then run flake8:

```bash
flake8 --config=setup.cfg --max-complexity 10
```

### black

The code uses also `black` for its python code style.

## Tests

To execute the tests, you first need to install the local dependencies:

```bash
cd backend
pip install -r requirements/local.txt
```

### Static check

Static check of the code is performed with `mypy`:

```bash
mypy koenaconnect config --config=setup.cfg
```

### Unit tests

Unit tests are performed with `pytest`:

```bash
pytest
```

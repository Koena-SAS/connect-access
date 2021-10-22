#!/bin/sh

flake8 ../backend --config=setup.cfg --max-complexity=10
mypy koenaconnect config --config=setup.cfg
black --check .
pytest

#!/bin/sh

flake8 ../backend --config=setup.cfg --max-complexity=10
mypy connect_access config --config=setup.cfg
black --check .
pytest

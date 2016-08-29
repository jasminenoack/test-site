#!/bin/bash
virtualenv -p python3 venv
. venv/bin/activate
pip install -r requirements.txt
npm install
npm run build
python manage.py makemigrations
python manage.py migrate
echo "Running the server on localhost:8000"
python manage.py runserver

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
echo "Running the server on localhost:8000"
python manage.py runserver

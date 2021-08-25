# Guide for local deployment

We are using docker-compose for running all service dependencies 
such as PostgreSQL, Redis and Elasticsearch

## Clone the app (dev branch)
`git clone git@github.com:smileservices/noodles.dev.git`
- checkout development branch: `git checkout development`

## Set up local python enviroment
- install python 3.8.5 from https://www.python.org/downloads/release/python-385/ 
- install virtualenv: `pip install virtualenv`
- create new virtualenviroment: `virtualenv -p {path to python} -m venv`
- enable the virtualenviroment (different on windows/linux):
    windows: execute `venv/Scripts/activate.bat`
    linux: execute `source venv/bin/activate`
- install `libmagic` library: `pip install python_magic_bin-0.4.14-py2.py3-none-win32.whl`
- once the virtualenv has been activated, go to project root and install all python dependencies:
`pip install -r requirements.txt`

## Set up docker services
- run `docker-compose up -d`

## Setup the database
- we go to `noodles/scripts` and run `python init_db.py postgres postgres postgres` to create the noodles db and user
- we go to `noodles/app` and apply the database migrations (set up the table structure and all):
`python manage.py migrate`
- run a python script for populating the database with dummy data:
`python manage.py populate_initial_fixtures --clear`

## Populate the elasticsearch indices
- we are using elasticsearch for speeding up search. there are hooks that index every new record into it. 
since we are starting fresh, we need to index all data in bulk manually:
`python manage.py sync_elastic --all`

## Run task queue manager
`python manage.py run_huey`

## Run the app
`python manage.py runserver runserver 127.0.0.1:8000`

The web application will be available at url http://127.0.0.1:8000/
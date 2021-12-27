#!/bin/bash
source venv/bin/activate
(cd scripts && python init_db.py postgres postgres postgres) && (cd app && python manage.py migrate && python manage.py populate_initial_fixtures --clear && python manage.py sync_elastic --all)
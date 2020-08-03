# Template for multi-user platform
multi-lingual, automated translations, social authentication, REST API ready, ReactJs frontend and dashboard, bootstrap4

## Features
- frontend and dashboard written in reactjs
- socialauthtentication
- django-rest ready
- bundled reactjs packages

## Installation
first of all make sure to create the .env file and populate it using the .env.template structure
```
virtualenv venv && source venv/bin/activate
pip install -r requirements.txt
cd app
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Settings
we are using split settings (in folder root/app/app/settings)
__init__.py hosts base settings
dev.py - for development settings
prod.py - for production 

## Social Auth Implementation
using django-allauth

## Autotranslate
this implementation is a fork of https://github.com/ankitpopli1891/django-autotranslate/

https://docs.djangoproject.com/en/3.0/topics/i18n/translation/

Make sure you have "locale" folder inside every app that is using translations
Can handle js translations: 
lang code examples: de, vn, fr ...
```
python manage.py makemessages -l={lang code} -d djangojs
python manage.py translate_messages -u
python manage.py compilemessages
```

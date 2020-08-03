# Template for multi-user platform
multi-lingual, automated translations, social authentication, REST API ready, minimal vanilla js code, reactJs mini-apps ready

## Features
- frontend and dashboard apps
- django-rest ready
- social auth implemented
- bundled reactjs packages to use mini react apps
- minimized responsive navbar/sidebar with html/css and minimal js
- no js libraries
- modular scss imports from bootstrap

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
- using split settings (in folder root/app/app/settings)
- __init__.py hosts base settings
- dev.py - for development settings
- prod.py - for production 

## Social Auth Implementation
- using django-allauth
- allauth app is just for overloading elements from original like forms/templates

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

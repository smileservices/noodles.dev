# Template for multi-user platform
multi-lingual, automated translations, social authentication, REST API ready, ReactJs frontend and dashboard, bootstrap4

## Social Auth Implementation
using django-allauth

## Autotranslate
this implementation is a fork of https://github.com/ankitpopli1891/django-autotranslate/

https://docs.djangoproject.com/en/3.0/topics/i18n/translation/

Make sure you have "locale" folder inside every app that is using translations
Can handle js translations: 
```
python manage.py makemessages -l={lang code}
python manage.py makemessages -l={lang code} -d djangojs
python manage.py autotranslate -u
python manage.py compilemessages
```

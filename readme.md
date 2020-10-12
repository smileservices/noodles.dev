# Noodles.dev
platform for learning software development with community-curated content

## Vision
There are too many subjective approaches to learning software development. Most of them focus on learning specific technologies. 
Our approach focuses instead on exploring the problems that software tries to solve. Different problems give rise to different
solutions that are implemented with the use of specific technologies. But solutions also have limitations and may bring new problems, therefore
we can also add problems to solutions. Many times there are multiple solutions for solving the same problem.
The platform allows for the community of developers to raise problems and add the solutions and the involved technologies. The community also
can add external learning resources (tutorials, articles, courses) for learning these technologies. 
The main part is having the "problems". Community can add "solutions" to these "problems". Solutions have one or more "technologies". The "technologies"
can have associated training resources to them. The training resources are reviewed and rated by the community.

## Community curated content
By community we mean any registered user that uses the platform. Based on their actions, like adding or editing content, rating reviews, reviewing resources,
users get scored. Admins and moderators maintain the quality of the content.

## Admins and moderators
Are privileged users that make sure the community is following the rules of creating/editing/reviewing content. They get notified of newly added or modified content.


--- Built on (Template for multi-user platform)[https://github.com/smileservices/djangotemplate_multiuser_multilanguage_react]

multi-lingual, automated translations, social authentication, REST API ready, minimal vanilla js code, reactJs mini-apps ready

## Problems trying to solve
This is a more complete implementation of Django framework, opinionated:
Many apps have become bloated and difficult to manage without having the need for it
I believe web apps should focus on speed, efficiency and scalability. 
A fast loading frontend can be obtained both by SPAs and cached server rendered pages. 
While the SPA approach eases load on server, it requires a many hours invested in frontend development and maintenance.
Few types of applications even need SPAs and a poorly built one means bad experience for the end user.
Relying on too many js libraries bring vulnerability issues in security and stability, overhead in maintenance.

## Use this implementation of Django if:
1. there is no need for SPAs
2. size of css/js bundles matters
3. it's enough to rely on server rendered html with django templates and possible inject mini ReactJS apps
4. REST protocol is enough
5. want a multi-user app structure with multi-language and autotranslate support
6. stable and easily implementable is preferred rather than having the latest tech hype

## Features
- social auth implemented
- django-rest ready
- frontend and dashboard apps
- minimized responsive navbar/sidebar with html/css and minimal js
- bundled react js packages to use mini react apps
- pure vanilla js
- easy to use modular scss imports from bootstrap

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

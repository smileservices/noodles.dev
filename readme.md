# Noodles.dev

A project for organising the knowledge on software development. 
An wikipedia of software development with community created content

## Objectives
- make software development easy to understand by giving a logical and deterministic view of technologies and problems they want to solve
- centralize and rate tutorials and articles on Problems/Solutions/Technologies

## Definitions

Technologies (t):
--------------
a specific implementation of a solution. has version number because some features may only be available for certain version
ex: Nginx
have root technology + version

Categories (cats)
-----------
A technology can belong to one or more categories. A study resource can only be in 1 category.

Concepts (concept)
----------------
A concept is a like a tag but with description Technologies, Categories have o2m concepts.
Concepts have `learn_level` same to learning resource `difficulty_level` but different.
Learn Levels: `junior`, `middle`, `senior`

## Category concepts
- theoretical
- can have parent from ancestor category

## Technology concepts
- practical on current implementation
- can have parent from ancestor category

Learning Resources (lr):
-------------------
an article/tutorial for a specific technology


## User actions
- user can register with facebook/google or make account with username/password
- registered user can view/add/give edit suggestions to resources
- other registered  users can rate the content created by other users
- registered users can add/rate tutorials/articles

Rewards:
-------
- user vote up, publish edit suggestion  - user positive action ++
- user vote down, reject edit suggestion - user positive action --
- someone votes +/- a resource, edit suggestion, the resource author gets positive/negative rating
- an edit suggestion gets published/rejected, the author gets positive/negative rating


# Implementation

Content Delivery Strategy
-------------------------

SEO first strategy:
    - home/browse/detail pages should be served with content optimized for search engines.
        - render serverside html with all data
        - use serverside caching for speed
        - js used for actions and forms processing
    - pages destined only for users use reactJs mini apps
Caching:
    - we'are using [django-cachalot](https://django-cachalot.readthedocs.io/en/latest/limits.html)
    
==========================

Edit Suggestions
------------------
We are using the [django-edit-suggestions](https://django-edit-suggestion.readthedocs.io/en/latest/)
library to handle edit suggestions. 

Resources History
-----------------
The app history handles keeping the changes on resources. The core.abstract_viewsets.ResourceWithEditSuggestionVieset has history endpoint:
```python
    @action(methods=['GET'], detail=True)
    def history(self, request, *args, **kwargs):
        ...
```
It retrieves the history list of the resource in a paginated way. The resource model must inherit from core.abstract_models.ResourceMixin

## Management Scripts:
python manage.py clean_migrations - deletes all migrations files; 
python manage.py clean_db - recreates the DB
python manage.py populate_initial_fixtures - populates the DB with test data

## Deployment Steps
- add ssh creds to user (cat /home/noodles/add_ssh)
- git pull origin {branch}
- migrate
- manage.py collectstatic
- restart systemd task

## Done:
- users (register, rating, dashboard)
- problems
- solutions
- technologies
- learning resources

edit suggestions
----------------
- users add edit suggestions for problems/solutions/technologies/learning resources
- users rate edit suggestions
- users with high rating/staff publish/reject edit suggestions

integrations testing
--------------------
should test how everything works together and if the business logic is followed

limitations on user actions
--------------------------
- direct edit   :  only staff and resource owner can directly edit  
- delete        :  only staff and resource owner can delete
- users can rate p/s/t/lr

frontend
--------
- technology detail page


track history
-------------
- p/s/t/lr have history tracking; use django-easy-audit

## In progress:

frontend
--------
User Info and Notifications
- if sessionStorage doesn't have "user_data" key then it hits the server api/account.
If the user is logged in, return the data and populate user_data (user_id, name). Else, mark user_data as "unauthenticated"
- users can have notifications
- navbar app manages user login/logout and notifications
- how it works:
    - new app notifications with db model that saves the messages to db
    - has task `create_notification(user, message)` that sends emails also
    - when user logins, we get the notifications and save all highlitghted ones into redis
    - when user removes notification, it's not highlighted anymore, but still persists in db
    
    |field  |type           |
    |---    |----           |
    |user_pk|int            |
    |message|small text     |
    |created|datetime       |
    |read   |bool           |

- add login popup triggered on actions (vote/post review/create edit suggestion, etc)
- history page


## To Do:

resources
---------
show "contributors" counter that measures how many people are contributing/following


collections can be editable
---------------------------
- a public collection's items list is open to edits
- users can edit items/order
- users can follow 

rating & discussions
--------------------
- users can create an associated discussion thread for p/s/t/lr

report bug
----------
- any user can report a bug on page; must have rate limiter


# NICE TO HAVE

- link technologies together. make a sort of wiki tree for each of them
- bring into moderation c/ct/t/lr with many thumbs down
- resource views stats - use redis then have a task to update views table

## Browser Extension
- scan current url to see if tutorial or course exists on noodles
- exists: retrieve rating/reviews for the user to know if it worth the time to go through
- doesn't exist: allow the user to add it
- can add to user collections
- can rate resource and add review

User badges
-----------
- user badges for contribution
- badge for resources added
   - junior curator / senior curator
- badge for reviews
   - junior reviewer
   - stars for thumbs up
   
   
   
# API Endpoints

** Homepage Frontend **

featured categories                 GET /categories/api/featured/
category concepts                   GET /concepts/api/category/featured/
featured technologies               GET /learn/api/featured/1
technologies with no concepts       GET /learn/api/no_technology_concept/
resources with no reviews           GET /tutorials/api/resources/no_reviews/
featured collections                GET /collections/api/featured/


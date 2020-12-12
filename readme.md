# Noodles.dev

A project for organising the knowledge on software development. 
An wikipedia of software development with community created content

## Objectives
- make software development easy to understand by giving a logical and deterministic view of technologies and problems they want to solve
- centralize and rate tutorials and articles on Problems/Solutions/Technologies

## Definitions

Problems (p):
---------
a problem that can be solved using software technology
ex: Serving an app to a large number of requests

Solutions (s):
----------
a software solution brought by a technology
ex: A load balancer that can redirect traffic to multiple servers running the app

Technologies (t):
--------------
a specific implementation of a solution. has version number because some features may only be available for certain version
ex: Nginx
have root technology + version

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
        !!! robots can't see data from fetch requests
    - logged in users can access pages where content is loaded using multiple fetch requests to reduce first time rendering to a minimum
    - pages destined only for users use reactJs mini apps

========================== 

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
- add login popup triggered on actions (vote/post review/create edit suggestion, etc)

- homepage
- browse page
- search page

users
-----
- user profile
- user activity                             use easyaudit on backend

admin/staff dashboard
-----------
- latest p/s/t/lr additions                 use easyaudit on backend
- latest edit suggestions for moderation    use easyaudit on backend


## To Do:

rating & discussions
--------------------
- users can create an associated discussion thread for p/s/t/lr

report bug
----------
- any user can report a bug on page; must have rate limiter


# NICE TO HAVE

- link technologies together. make a sort of wiki tree for each of them
- bring into moderation p/s/t/lr with many thumbs down
- resource views stats - use redis then have a task to update views table

User badges
-----------
- user badges for contribution
- badge for resources added
   - junior curator / senior curator
- badge for reviews
   - junior reviewer
   - stars for thumbs up
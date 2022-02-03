Resource Discussions
==

Every resource can have associated discussions. The `core.abstract_models.ResourceMixin`
contains `discussions.mixins.HasDiscussionsMixin` that adds `discussions` property to 
the resource model.

## Viewsets

All resources viewsets inherit from `core.abstract_viewsets.ResourceWithEditSuggestionVieset`
which in turn contains `discussions.views.HasDiscussionViewsetMixin` that gives access to
`discussion_posts` endpoint. 

`GET` returns a paginated list of latest root posts
`POST` creates a new post 

That can be accesed through the resource viewset: 
 `reverse('technology-viewset-discussion-posts', kwargs={"pk": tech.pk})`
 
Each discussion post is handled by a separate viewset `discussions.views.DiscussionViewset` that
gives access to `replies`, `DELETE` and `UPDATE` endpoints.

`replies` endpoint returns a paginated list of post`s replies 

That can be accesed through the discussions viewset:
`reverse('discussion-viewset-replies', kwargs={"pk": tech.pk})`
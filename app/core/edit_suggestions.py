from django.conf import settings
from users.models import CustomUser
from app.settings import rewards

AUTHOR_FIELDS = ['author', 'edit_suggestion_author']


def edit_suggestion_change_status_condition(instance, user: CustomUser):
    if user.is_staff or user.community_score() >= settings.MODERATOR_USER_SCORE:
        return True
    return False


def post_publish_edit(instance, user):
    for f in AUTHOR_FIELDS:
        if hasattr(instance, f):
            resource_author = getattr(instance, f)
            resource_author.positive_score += rewards.EDIT_SUGGESTION_PUBLISH
            resource_author.save()


def post_reject_edit(instance, user, reason):
    for f in AUTHOR_FIELDS:
        if hasattr(instance, f):
            resource_author = getattr(instance, f)
            resource_author.negative_score += rewards.EDIT_SUGGESTION_REJECT
            resource_author.save()

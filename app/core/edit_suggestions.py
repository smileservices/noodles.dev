from django.conf import settings
from users.models import CustomUser
from app.settings import rewards

# this should hold the name of attributes having the author
EDIT_SUGGESTION_AUTHOR_FIELD = 'edit_suggestion_author'


def edit_suggestion_change_status_condition(instance, user: CustomUser):
    if instance.edit_suggestion_parent.author == user or user.is_staff or user.community_score() >= settings.MODERATOR_USER_SCORE:
        return True
    return False


def post_publish_edit(instance, user):
    resource_author = getattr(instance, EDIT_SUGGESTION_AUTHOR_FIELD)
    resource_author.positive_score += rewards.EDIT_SUGGESTION_PUBLISH
    resource_author.save()


def post_reject_edit(instance, user, reason):
    resource_author = getattr(instance, EDIT_SUGGESTION_AUTHOR_FIELD)
    resource_author.negative_score -= rewards.EDIT_SUGGESTION_REJECT
    resource_author.save()

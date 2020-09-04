from django.db import models
from .manager import CustomUserManager
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """
    Creates a CustomUser object by keeping the properties of the AbstractUser.
    - Removes username field.
    - Field email become required & unique.
    - Sets USERNAME_FIELD to unique identifier for the User model
    """

    id = models
    username = None
    email = models.EmailField('email address', unique=True)
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    objects = CustomUserManager()

    # keeps track of other users feedback on user
    positive_score = models.IntegerField(default=0)
    negative_score = models.IntegerField(default=0)

    # keeps track of user actions
    positive_thumbs = models.IntegerField(default=0)
    negative_thumbs = models.IntegerField(default=0)

    def __str__(self):
        """A string representation of the model."""
        return self.email

    def community_score(self):
        return self.positive_score - self.negative_score

    def total_cast_votes(self):
        return self.positive_thumbs + self.negative_thumbs

    def cast_votes_sentiment(self):
        return self.positive_thumbs - self.negative_thumbs

    def positive_feedback(self):
        self.positive_score += 1
        self.save()

    def negative_feedback(self):
        self.negative_score += 1
        self.save()

    def thumb_up(self):
        self.positive_thumbs += 1
        self.save()

    def thumb_down(self):
        self.negative_thumbs += 1
        self.save()

    def cancel_thumb_up(self):
        self.positive_thumbs -= 1
        self.save()

    def cancel_thumb_down(self):
        self.negative_thumbs -= 1
        self.save()

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
    positive_score = models.IntegerField(default=0)
    negative_score = models.IntegerField(default=0)
    positive_thumbs = models.IntegerField(default=0)
    negative_thumbs = models.IntegerField(default=0)
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self):
        """A string representation of the model."""
        return self.get_full_name()

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
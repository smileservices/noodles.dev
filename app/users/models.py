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

    username = None
    email = models.EmailField('email address', unique=True)
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self):
        """A string representation of the model."""
        return self.email

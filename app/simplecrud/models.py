from django.db import models


# Create your models here.
class People(models.Model):
    class Nationality(models.TextChoices):
        ROMANIAN = 'ro', 'Romanian'
        ENGLISH = 'en', 'English'
        AUSTRALIAN = 'au', 'Australian'

    name = models.CharField(max_length=32)
    age = models.IntegerField()
    nationality = models.CharField(
        max_length=3,
        choices=Nationality.choices,
        default=Nationality.ROMANIAN
    )

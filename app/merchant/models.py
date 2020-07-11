from django.db import models
from django.conf import settings


class MerchantModel(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.CASCADE
    )
    name = models.CharField(max_length=128)
    date_created = models.DateTimeField(db_index=True, auto_now_add=True)
    active = models.BooleanField(default=True)


class MerchantNoteModel(models.Model):
    merchant = models.ForeignKey(
        MerchantModel, blank=True, null=True, on_delete=models.SET_NULL, related_name='notes'
    )
    date = models.DateTimeField(db_index=True, auto_now_add=True)
    content = models.TextField()
    is_public = models.BooleanField(default=True)

    class Meta:
        ordering = ("date",)

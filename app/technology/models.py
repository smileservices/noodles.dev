from django.db import models
import tsvector_field


class Technology(models.Model):
    class LicenseType(models.IntegerChoices):
        PUBLIC_DOMAIN = (0, 'public domain')
        PERMISSIVE_LICENSE = (1, 'permissive license')
        COPYLEFT = (2, 'copyleft')
        NONCOMMERCIAL = (3, 'noncommercial')
        PROPRIETARY = (4, 'proprietary')
        TRADE_SECRET = (5, 'trade secret')

    name = models.CharField(max_length=128, db_index=True)
    description = models.TextField(max_length=1024)
    version = models.CharField(max_length=128, null=True, blank=True)
    license = models.IntegerField(default=0, choices=LicenseType.choices, db_index=True)
    url = models.TextField(max_length=1024)
    owner = models.CharField(max_length=128, db_index=True)
    pros = models.TextField(max_length=1024)
    cons = models.TextField(max_length=1024)
    limitations = models.TextField(max_length=1024)
    ecosystem = models.ManyToManyField('Technology', related_name='related_technologies')

    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
        tsvector_field.WeightedColumn('description', 'B'),
    ], 'english')

    def __str__(self):
        return f'{self.name} {self.version}' if self.version else self.name

    def license_label(self):
        return self.LicenseType(self.license).label

    class Meta:
        unique_together = ['name', 'version']

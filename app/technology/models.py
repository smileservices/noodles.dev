from django.db import models
import tsvector_field


class Technology(models.Model):
    name = models.CharField(max_length=128, db_index=True)
    description = models.TextField(max_length=1024)
    version = models.CharField(max_length=128, null=True, blank=True)
    url = models.TextField(max_length=1024)
    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
        tsvector_field.WeightedColumn('description', 'B'),
    ], 'english')

    def __str__(self):
        return f'{self.name} {self.version}'

    class Meta:
        unique_together = ['name', 'version']

from django.db import models
from django.db.models.fields import SlugField
from django.template.defaultfilters import slugify
from tag.models import Tag
from technology.models import Technology
from simple_history.models import HistoricalRecords
import tsvector_field


class ProblemClass(models.Model):
    name = models.CharField(max_length=128)
    summary = models.TextField(max_length=3048)
    created_at = models.DateTimeField(auto_now_add=True)
    history = HistoricalRecords(excluded_fields='search_vector_index')
    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
        tsvector_field.WeightedColumn('summary', 'B'),
    ], 'english')


class Problem(models.Model):
    history = HistoricalRecords(excluded_fields='search_vector_index')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=128)
    summary = models.TextField(max_length=3048)
    problem_class = models.ForeignKey(ProblemClass, null=True, blank=True, on_delete=models.DO_NOTHING)
    parent = models.ForeignKey('Solution', null=True, blank=True, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, related_name='problems')

    slug = SlugField(max_length=255)
    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
        tsvector_field.WeightedColumn('summary', 'B'),
    ], 'english')


class Solution(models.Model):

    history = HistoricalRecords(excluded_fields='search_vector_index')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    name = models.CharField(max_length=128)
    summary = models.TextField(max_length=3048)
    parent = models.ForeignKey(Problem, null=True, blank=True, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, related_name='solutions')
    technologies = models.ManyToManyField(Technology, related_name='solutions')

    slug = SlugField(max_length=255)
    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
        tsvector_field.WeightedColumn('summary', 'B'),
    ], 'english')
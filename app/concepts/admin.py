from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from . import models


@admin.register(models.CategoryConcept)
class CategoryConceptAdmin(MPTTModelAdmin):
    date_hierarchy = 'created_at'
    list_display = ('name', 'author', 'description', 'created_at')


@admin.register(models.TechnologyConcept)
class TechnologyConceptAdmin(admin.ModelAdmin):
    date_hierarchy = 'created_at'
    list_display = ('name', 'author', 'description', 'created_at')
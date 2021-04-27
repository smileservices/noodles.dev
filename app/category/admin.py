from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from category.models import Category

@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    list_display = ('name',)
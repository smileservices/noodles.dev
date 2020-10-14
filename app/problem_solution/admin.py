from django.contrib import admin
import problem_solution.models as models
from django.urls import reverse
from simple_history.admin import SimpleHistoryAdmin


@admin.register(models.Problem)
class StudyResourceAdmin(SimpleHistoryAdmin):
    date_hierarchy = 'created_at'
    list_display = ('name', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at', 'tags')

    def view_on_site(self, obj):
        return reverse('detail', kwargs={'id': obj.id, 'slug': obj.slug})


@admin.register(models.Solution)
class StudyResourceAdmin(SimpleHistoryAdmin):
    date_hierarchy = 'created_at'
    list_display = ('name', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at', 'tags', 'technologies')

    def view_on_site(self, obj):
        return reverse('detail', kwargs={'id': obj.id, 'slug': obj.slug})
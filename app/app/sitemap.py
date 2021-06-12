from django.contrib.sitemaps import Sitemap
from technology.models import Technology
from concepts.models import CategoryConcept, TechnologyConcept
from study_resource.models import StudyResource
from study_collection.models import Collection


class TechnologiesSiteMap(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
        return Technology.objects.filter().order_by('pk')

    def location(self, obj):
        return obj.absolute_url


class CategoryConceptsSiteMap(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
        return CategoryConcept.objects.filter().order_by('pk')

    def location(self, obj):
        return obj.absolute_url


class TechnologyConceptsSiteMap(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
        return TechnologyConcept.objects.filter().order_by('pk')

    def location(self, obj):
        return obj.absolute_url


class ResourcesSiteMap(Sitemap):
    changefreq = "daily"
    priority = 0.5

    def items(self):
        return StudyResource.objects.filter().order_by('pk')

    def location(self, obj):
        return obj.absolute_url


class CollectionsSiteMap(Sitemap):
    changefreq = "weekly"
    priority = 0.5

    def items(self):
        return Collection.objects.filter().order_by('pk')

    def location(self, obj):
        return obj.absolute_url

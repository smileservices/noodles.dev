from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, TrigramSimilarity


class DateTimeModelMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class RequireAdminAprovalModelMixin(models.Model):
    approved = models.BooleanField(default=False)

    class Meta:
        abstract = True


class SluggableModelMixin(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):  # new
        if not self.slug:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)


class SearchAbleQuerysetMixin(models.QuerySet):

    def search_match(self, text, min_rank=0.1):
        # searching through tags and techs is too expensive
        search_vector = SearchVector('search_vector_index')
        rank = SearchRank(search_vector, SearchQuery(text))
        return self.annotate(
            rank=rank,
        ) \
            .filter(models.Q(rank__gte=min_rank)) \
            .order_by('-rank')

    def search_similar(self, fields, text, min_sim=0.1):
        similarity = sum([TrigramSimilarity(field, text) for field in fields])
        return self.annotate(
            similarity=similarity
        ) \
            .filter(models.Q(similarity__gte=min_sim)) \
            .order_by('-similarity')

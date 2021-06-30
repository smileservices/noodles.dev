from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, TrigramSimilarity
from core.tasks import sync_to_elastic, sync_delete_to_elastic


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
    slug = models.SlugField(max_length=255, unique=True, db_index=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):  # new
        if not self.pk and not self.slug:
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


class ElasticSearchIndexableMixin(models.Model):
    class Meta:
        abstract = True

    @staticmethod
    def get_elastic_mapping() -> {}:
        raise NotImplemented

    def get_elastic_data(self) -> (str, list):
        raise NotImplemented

    @classmethod
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        models.signals.post_save.connect(sync_to_elastic, sender=cls, weak=False)
        models.signals.post_delete.connect(sync_delete_to_elastic, sender=cls, weak=False)

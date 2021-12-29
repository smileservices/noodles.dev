from django.db import models
from core.abstract_models import ResourceMixin
from mptt.models import MPTTModel, TreeForeignKey
from django.shortcuts import reverse
from core.abstract_models import ElasticSearchIndexableMixin
from core.tasks import sync_to_elastic


class CategoryModelManager(models.Manager):

    def validate_category(self, category):
        if type(category) == int:
            return category
        else:
            try:
                # have to do this weird check if the category is actual int because everything is string in multiform data
                return int(category)
            except ValueError:
                pass
            normalized = category.lower()
            try:
                return self.get(name=normalized).pk
            except self.model.DoesNotExist:
                created = self.create(name=normalized)
                return created.pk

    def validate_categories(self, categories_to_validate):
        # check if text categories already exist. if not, create them
        create_categories = set()
        validated_categories = set()
        for category in categories_to_validate:
            if type(category) == int:
                validated_categories.add(category)
            else:
                create_categories.add(category.lower())
        if len(create_categories) > 0:
            existing_categories = self.filter(name__in=create_categories)
            for ex_category in existing_categories:
                validated_categories.add(ex_category.id)
                create_categories.remove(ex_category.name)
        for new_category in create_categories:
            created_category = self.create(name=new_category)
            validated_categories.add(created_category.id)
        return validated_categories


class Category(MPTTModel, ResourceMixin):
    elastic_index = 'categories'
    name = models.CharField(max_length=128, db_index=True)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    description = models.TextField(max_length=256, blank=True, null=True)
    description_long = models.TextField(blank=True, null=True)

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return f'{self.name}'

    @property
    def name_tree(self):
        tree_list = [c.name for c in self.get_ancestors()]
        tree_list.append(self.name)
        return ' > '.join(tree_list)

    @property
    def as_tags(self):
        tags = ''
        for c in self.get_ancestors():
            tags += c.get_ahref
        tags += self.get_ahref
        return tags

    @property
    def category_tree_urls(self):
        # for displaying the tree in the detail page
        # show parent category, siblings, children
        tree_list = [c.get_ahref for c in self.get_ancestors()]
        tree_list.append(self.get_ahref)
        return ' > '.join(tree_list)

    @property
    def category_tree_list_urls(self):
        # for displaying the tree in the detail page
        # show parent category, siblings, children
        tree_str = ''
        ancestors_list = self.get_ancestors()
        for c in ancestors_list:
            tree_str += f'<li>{c.get_ahref}<ul>'
        tree_str += f'<li class="active">{self.get_ahref}</li>'
        if len(ancestors_list) > 0:
            tree_str += '</ul></li>' * len(ancestors_list)
        return tree_str

    @property
    def absolute_url(self):
        return reverse('category-detail', kwargs={'slug': self.slug})

    @property
    def get_ahref(self):
        return f"<a href='{self.absolute_url}'>{self.name}</a>"

    @staticmethod
    def get_elastic_mapping() -> {}:
        return {
            "properties": {
                "pk": {"type": "integer"},
                "resource_type": {"type": "keyword"},
                "status": {"type": "keyword"},

                # model fields
                "name": {
                    "type": "text",
                    "copy_to": "suggest",
                    "analyzer": "ngram",
                    "search_analyzer": "standard"
                },
                "description": {
                    "type": "text",
                    "copy_to": "suggest",
                    "analyzer": "ngram",
                    "search_analyzer": "standard"
                },
                "description_long": {
                    "type": "text",
                    "copy_to": "suggest",
                    "analyzer": "ngram",
                    "search_analyzer": "standard"
                },
                "parent": {"type": "keyword"},
                "url": {"type": "text"},
                "suggest": {
                    "type": "search_as_you_type",
                }
            }
        }

    def get_elastic_data(self) -> (str, list):
        data = {
            "pk": self.pk,
            "type": "category",
            "status": self.status_label,
            "name": self.name,
            "description": self.description,
            "description_long": self.description_long,
            "url": self.absolute_url,
            "parent": self.name_tree,
        }
        return self.elastic_index, data


models.signals.post_save.connect(sync_to_elastic, sender=Category, weak=False)

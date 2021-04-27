from django.db import models
from mptt.models import MPTTModel, TreeForeignKey

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


class Category(MPTTModel):
    name = models.CharField(max_length=128, db_index=True)
    parent = TreeForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    description = models.TextField(max_length=1024, blank=True, null=True)

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name

    @property
    def name_tree(self):
        tree_list = [c.name for c in self.get_ancestors()]
        tree_list.append(self.name)
        return ' > '.join(tree_list)

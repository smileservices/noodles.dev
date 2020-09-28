from django.db import models
import tsvector_field


class TagModelManager(models.Manager):

    def validate_tags(self, tags_to_validate):
        # check if text tags already exist. if not, create them
        create_tags = set()
        validated_tags = set()
        for tag in tags_to_validate:
            if type(tag) == int:
                validated_tags.add(tag)
            else:
                create_tags.add(tag.lower())
        if len(create_tags) > 0:
            existing_tags = self.filter(name__in=create_tags)
            for ex_tag in existing_tags:
                validated_tags.add(ex_tag.id)
                create_tags.remove(ex_tag.name)
        for new_tag in create_tags:
            created_tag = self.create(name=new_tag)
            validated_tags.add(created_tag.id)
        return validated_tags


class Tag(models.Model):
    name = models.CharField(max_length=128, db_index=True)
    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
    ], 'english')
    objects = TagModelManager()

    def __str__(self):
        return self.name

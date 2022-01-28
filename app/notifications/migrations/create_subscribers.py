from django.db import migrations, models
from django.contrib.contenttypes.models import ContentType

RESOURCES_LIST = [
    ('study_resource', 'StudyResource'),
    ('concepts', 'CategoryConcept'),
    ('concepts', 'TechnologyConcept'),
    ('technology', 'Technology'),
]


# def create_subscriptors(apps, schema_editor):
#     # cycle through created resources and add them to subscriptions table
#     subscribers_model = apps.get_model('notifications', 'Subscribers')
#     subscriptions = []
#     for resource in RESOURCES_LIST:
#         model = apps.get_model(resource[0], resource[1])
#         # get content type
#         content_type = ContentType.objects.get(app_label=resource[0], model=resource[1].lower())
#         for resource_author in model.objects.values('pk', 'author_id'):
#             subscriptions.append(subscribers_model(
#                 content_type_id=content_type.pk,
#                 object_id=resource_author['pk'],
#                 users=[resource_author['author_id'], ]
#             ))
#     subscribers_model.objects.bulk_create(subscriptions, 1000)


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('notifications', '0001_initial'),
    ]

    # operations = [
    #     migrations.RunPython(create_subscriptors)
    # ]

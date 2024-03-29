# Generated by Django 3.0.7 on 2021-03-27 05:15

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tag', '0001_initial'),
        ('study_collection', '0002_collectionresources_study_resource'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('study_resource', '0002_auto_20210327_0515'),
        ('technology', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='collection',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='collection',
            name='resources',
            field=models.ManyToManyField(related_name='collections', through='study_collection.CollectionResources', to='study_resource.StudyResource'),
        ),
        migrations.AddField(
            model_name='collection',
            name='tags',
            field=models.ManyToManyField(related_name='collections', to='tag.Tag'),
        ),
        migrations.AddField(
            model_name='collection',
            name='technologies',
            field=models.ManyToManyField(related_name='collections', to='technology.Technology'),
        ),
    ]

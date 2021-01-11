# Generated by Django 3.0.7 on 2021-01-02 14:20

from django.conf import settings
import django.contrib.postgres.indexes
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('technology', '0001_initial'),
        ('tag', '0001_initial'),
        ('study_resource', '0002_auto_20210102_1420'),
    ]

    operations = [
        migrations.AddField(
            model_name='studyresource',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='studyresource',
            name='tags',
            field=models.ManyToManyField(related_name='resources', to='tag.Tag'),
        ),
        migrations.AddField(
            model_name='studyresource',
            name='technologies',
            field=models.ManyToManyField(related_name='resources', through='study_resource.StudyResourceTechnology', to='technology.Technology'),
        ),
        migrations.AddField(
            model_name='review',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='review',
            name='study_resource',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='study_resource.StudyResource'),
        ),
        migrations.AddField(
            model_name='editsuggestionstudyresourcetechnology',
            name='study_resource',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='study_resource.EditSuggestionStudyResource'),
        ),
        migrations.AddField(
            model_name='editsuggestionstudyresourcetechnology',
            name='technology',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='technology.Technology'),
        ),
        migrations.AddField(
            model_name='editsuggestionstudyresource',
            name='edit_suggestion_author',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='edit_suggestions_EditSuggestionStudyResourceTechnology', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='editsuggestionstudyresource',
            name='edit_suggestion_parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='study_resource.StudyResource'),
        ),
        migrations.AddField(
            model_name='editsuggestionstudyresource',
            name='tags',
            field=models.ManyToManyField(related_name='tags_StudyResource', to='tag.Tag'),
        ),
        migrations.AddField(
            model_name='editsuggestionstudyresource',
            name='technologies',
            field=models.ManyToManyField(related_name='technologies_EditSuggestionStudyResourceTechnology', through='study_resource.EditSuggestionStudyResourceTechnology', to='technology.Technology'),
        ),
        migrations.AddField(
            model_name='collectionresources',
            name='collection',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='study_resource.Collection'),
        ),
        migrations.AddField(
            model_name='collectionresources',
            name='study_resource',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='study_resource.StudyResource'),
        ),
        migrations.AddField(
            model_name='collection',
            name='author',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='collection',
            name='resources',
            field=models.ManyToManyField(related_name='collections', through='study_resource.CollectionResources', to='study_resource.StudyResource'),
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
        migrations.AlterUniqueTogether(
            name='studyresourcetechnology',
            unique_together={('technology', 'study_resource')},
        ),
        migrations.AddIndex(
            model_name='studyresource',
            index=django.contrib.postgres.indexes.GinIndex(fields=['name', 'summary'], name='gintrgm_index', opclasses=['gin_trgm_ops', 'gin_trgm_ops']),
        ),
        migrations.AlterUniqueTogether(
            name='review',
            unique_together={('author', 'study_resource')},
        ),
    ]
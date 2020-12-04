# Generated by Django 3.0.7 on 2020-12-04 05:25

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django_edit_suggestion.models
import tsvector_field
import versatileimagefield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('thumbs_up_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('thumbs_down_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=128)),
                ('description', models.TextField(blank=True, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CollectionResources',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='EditSuggestionStudyResource',
            fields=[
                ('thumbs_up_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('thumbs_down_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
                ('publication_date', models.DateField()),
                ('published_by', models.CharField(max_length=256)),
                ('url', models.TextField(db_index=True, max_length=1024)),
                ('summary', models.TextField(max_length=2048)),
                ('price', models.IntegerField(choices=[(0, 'free'), (1, 'paid')], db_index=True, default=0)),
                ('media', models.IntegerField(choices=[(0, 'article'), (1, 'video'), (3, 'series'), (4, 'course'), (5, 'book')], db_index=True, default=0)),
                ('experience_level', models.IntegerField(choices=[(0, 'absolute beginner'), (1, 'junior'), (2, 'middle'), (3, 'experienced')], db_index=True, default=0)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('edit_suggestion_date_created', models.DateTimeField(auto_now_add=True)),
                ('edit_suggestion_date_updated', models.DateTimeField(auto_now=True)),
                ('edit_suggestion_reason', models.TextField()),
                ('edit_suggestion_status', models.IntegerField(choices=[(0, 'under review'), (1, 'published'), (2, 'rejected')], db_index=True, default=0)),
                ('edit_suggestion_reject_reason', models.TextField()),
            ],
            options={
                'verbose_name': 'edit suggestion study resource',
                'ordering': ('-edit_suggestion_date_created',),
                'get_latest_by': 'edit_suggestion_date_created',
            },
            bases=(django_edit_suggestion.models.EditSuggestionChanges, models.Model),
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('thumbs_up_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('thumbs_down_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('rating', models.IntegerField()),
                ('text', models.TextField(max_length=2048)),
                ('visible', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='StudyResource',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('thumbs_up_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('thumbs_down_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
                ('publication_date', models.DateField()),
                ('published_by', models.CharField(max_length=256)),
                ('url', models.TextField(max_length=1024, unique=True)),
                ('summary', models.TextField(max_length=2048)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('price', models.IntegerField(choices=[(0, 'free'), (1, 'paid')], db_index=True, default=0)),
                ('media', models.IntegerField(choices=[(0, 'article'), (1, 'video'), (3, 'series'), (4, 'course'), (5, 'book')], db_index=True, default=0)),
                ('experience_level', models.IntegerField(choices=[(0, 'absolute beginner'), (1, 'junior'), (2, 'middle'), (3, 'experienced')], db_index=True, default=0)),
                ('search_vector_index', tsvector_field.SearchVectorField(columns=[tsvector_field.WeightedColumn('name', 'A'), tsvector_field.WeightedColumn('summary', 'B')], language='english')),
            ],
        ),
        migrations.CreateModel(
            name='StudyResourceImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_file', versatileimagefield.fields.VersatileImageField(blank=True, null=True, upload_to='tutorials')),
                ('image_url', models.URLField(blank=True, default='', null=True)),
                ('study_resource', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='study_resource.StudyResource')),
            ],
        ),
    ]

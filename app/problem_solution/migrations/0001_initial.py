# Generated by Django 3.0.7 on 2020-11-27 13:35

import django.contrib.postgres.fields
from django.db import migrations, models
import django_edit_suggestion.models
import tsvector_field


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EditSuggestionProblem',
            fields=[
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
                ('thumbs_up_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('thumbs_down_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('description', models.TextField(max_length=3048)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('edit_suggestion_date_created', models.DateTimeField(auto_now_add=True)),
                ('edit_suggestion_date_updated', models.DateTimeField(auto_now=True)),
                ('edit_suggestion_reason', models.TextField()),
                ('edit_suggestion_status', models.IntegerField(choices=[(0, 'under review'), (1, 'published'), (2, 'rejected')], db_index=True, default=0)),
                ('edit_suggestion_reject_reason', models.TextField()),
            ],
            options={
                'verbose_name': 'edit suggestion problem',
                'ordering': ('-edit_suggestion_date_created',),
                'get_latest_by': 'edit_suggestion_date_created',
            },
            bases=(django_edit_suggestion.models.EditSuggestionChanges, models.Model),
        ),
        migrations.CreateModel(
            name='EditSuggestionSolution',
            fields=[
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
                ('thumbs_up_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('thumbs_down_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('description', models.TextField(max_length=3048)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('edit_suggestion_date_created', models.DateTimeField(auto_now_add=True)),
                ('edit_suggestion_date_updated', models.DateTimeField(auto_now=True)),
                ('edit_suggestion_reason', models.TextField()),
                ('edit_suggestion_status', models.IntegerField(choices=[(0, 'under review'), (1, 'published'), (2, 'rejected')], db_index=True, default=0)),
                ('edit_suggestion_reject_reason', models.TextField()),
            ],
            options={
                'verbose_name': 'edit suggestion solution',
                'ordering': ('-edit_suggestion_date_created',),
                'get_latest_by': 'edit_suggestion_date_created',
            },
            bases=(django_edit_suggestion.models.EditSuggestionChanges, models.Model),
        ),
        migrations.CreateModel(
            name='Problem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
                ('thumbs_up_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('thumbs_down_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('description', models.TextField(max_length=3048)),
                ('search_vector_index', tsvector_field.SearchVectorField(columns=[tsvector_field.WeightedColumn('name', 'A'), tsvector_field.WeightedColumn('description', 'B')], language='english')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Solution',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
                ('thumbs_up_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('thumbs_down_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('description', models.TextField(max_length=3048)),
                ('search_vector_index', tsvector_field.SearchVectorField(columns=[tsvector_field.WeightedColumn('name', 'A'), tsvector_field.WeightedColumn('description', 'B')], language='english')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]

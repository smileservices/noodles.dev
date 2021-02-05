# Generated by Django 3.0.7 on 2021-02-04 11:09

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
            name='EditSuggestionTechnology',
            fields=[
                ('thumbs_up_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('thumbs_down_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('slug', models.SlugField(max_length=255)),
                ('name', models.CharField(db_index=True, max_length=128)),
                ('description', models.TextField(max_length=1024)),
                ('license', models.IntegerField(choices=[(0, 'public domain'), (1, 'permissive license'), (2, 'copyleft'), (3, 'noncommercial'), (4, 'proprietary'), (5, 'trade secret')], db_index=True, default=0)),
                ('url', models.TextField(max_length=1024)),
                ('owner', models.CharField(db_index=True, max_length=128)),
                ('pros', models.TextField(max_length=1024)),
                ('cons', models.TextField(max_length=1024)),
                ('limitations', models.TextField(max_length=1024)),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('edit_suggestion_date_created', models.DateTimeField(auto_now_add=True)),
                ('edit_suggestion_date_updated', models.DateTimeField(auto_now=True)),
                ('edit_suggestion_reason', models.TextField()),
                ('edit_suggestion_status', models.IntegerField(choices=[(0, 'under review'), (1, 'published'), (2, 'rejected')], db_index=True, default=0)),
                ('edit_suggestion_reject_reason', models.TextField()),
            ],
            options={
                'verbose_name': 'edit suggestion technology',
                'ordering': ('-edit_suggestion_date_created',),
                'get_latest_by': 'edit_suggestion_date_created',
            },
            bases=(django_edit_suggestion.models.EditSuggestionChanges, models.Model),
        ),
        migrations.CreateModel(
            name='Technology',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('thumbs_up_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('thumbs_down_array', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('slug', models.SlugField(max_length=255)),
                ('name', models.CharField(db_index=True, max_length=128)),
                ('description', models.TextField(max_length=1024)),
                ('license', models.IntegerField(choices=[(0, 'public domain'), (1, 'permissive license'), (2, 'copyleft'), (3, 'noncommercial'), (4, 'proprietary'), (5, 'trade secret')], db_index=True, default=0)),
                ('url', models.TextField(max_length=1024)),
                ('owner', models.CharField(db_index=True, max_length=128)),
                ('pros', models.TextField(max_length=1024)),
                ('cons', models.TextField(max_length=1024)),
                ('limitations', models.TextField(max_length=1024)),
                ('search_vector_index', tsvector_field.SearchVectorField(columns=[tsvector_field.WeightedColumn('name', 'A'), tsvector_field.WeightedColumn('description', 'B')], language='english')),
            ],
        ),
    ]

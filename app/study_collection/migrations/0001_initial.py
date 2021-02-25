# Generated by Django 3.0.7 on 2021-02-25 04:26

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import tsvector_field


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
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255)),
                ('is_public', models.BooleanField(default=False)),
                ('description', models.TextField(blank=True, null=True)),
                ('search_vector_index', tsvector_field.SearchVectorField(columns=[tsvector_field.WeightedColumn('name', 'A'), tsvector_field.WeightedColumn('description', 'B')], language='english')),
            ],
        ),
        migrations.CreateModel(
            name='CollectionResources',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField(blank=True, null=True)),
                ('collection', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='study_collection.Collection')),
            ],
        ),
    ]

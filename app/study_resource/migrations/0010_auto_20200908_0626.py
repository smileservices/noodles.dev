# Generated by Django 3.0.7 on 2020-09-08 06:26

from django.db import migrations
import tsvector_field


class Migration(migrations.Migration):

    dependencies = [
        ('study_resource', '0009_auto_20200903_0742'),
    ]

    operations = [
        migrations.AddField(
            model_name='studyresource',
            name='search_vector_index',
            field=tsvector_field.SearchVectorField(columns=[tsvector_field.WeightedColumn('name', 'A'), tsvector_field.WeightedColumn('summary', 'B')], language='english'),
        ),
        migrations.AddField(
            model_name='tag',
            name='search_vector_index',
            field=tsvector_field.SearchVectorField(columns=[tsvector_field.WeightedColumn('name', 'A')], language='english'),
        ),
        migrations.AddField(
            model_name='technology',
            name='search_vector_index',
            field=tsvector_field.SearchVectorField(columns=[tsvector_field.WeightedColumn('name', 'A'), tsvector_field.WeightedColumn('description', 'B')], language='english'),
        ),
        tsvector_field.IndexSearchVector('studyresource', 'search_vector_index'),
        tsvector_field.IndexSearchVector('tag', 'search_vector_index'),
        tsvector_field.IndexSearchVector('technology', 'search_vector_index'),
    ]

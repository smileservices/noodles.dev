# Generated by Django 3.0.7 on 2021-01-24 07:46

from django.db import migrations, models
import tsvector_field


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=128)),
                ('description', models.TextField(blank=True, max_length=1024, null=True)),
                ('search_vector_index', tsvector_field.SearchVectorField(columns=[tsvector_field.WeightedColumn('name', 'A'), tsvector_field.WeightedColumn('description', 'B')], language='english')),
            ],
        ),
    ]

# Generated by Django 3.0.7 on 2021-06-12 18:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('study_resource', '0004_auto_20210607_1452'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studyresource',
            name='slug',
            field=models.SlugField(max_length=255, unique=True),
        ),
    ]
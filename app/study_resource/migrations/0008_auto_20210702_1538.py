# Generated by Django 3.0.7 on 2021-07-02 15:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('study_resource', '0007_auto_20210702_1056'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='review',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
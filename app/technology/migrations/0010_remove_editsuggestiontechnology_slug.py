# Generated by Django 3.0.7 on 2021-07-03 19:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('technology', '0009_auto_20210702_1538'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='editsuggestiontechnology',
            name='slug',
        ),
    ]
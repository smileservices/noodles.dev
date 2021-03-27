# Generated by Django 3.0.7 on 2021-03-27 03:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('technology', '0002_auto_20210306_0537'),
    ]

    operations = [
        migrations.AlterField(
            model_name='editsuggestiontechnology',
            name='license',
            field=models.IntegerField(choices=[(0, 'Public Domain'), (1, 'Permissive License'), (2, 'Copyleft'), (3, 'Non-Commercial'), (4, 'Proprietary'), (5, 'Trade Secret')], db_index=True, default=0),
        ),
        migrations.AlterField(
            model_name='technology',
            name='license',
            field=models.IntegerField(choices=[(0, 'Public Domain'), (1, 'Permissive License'), (2, 'Copyleft'), (3, 'Non-Commercial'), (4, 'Proprietary'), (5, 'Trade Secret')], db_index=True, default=0),
        ),
    ]

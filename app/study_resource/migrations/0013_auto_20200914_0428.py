# Generated by Django 3.0.7 on 2020-09-14 04:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('study_resource', '0012_auto_20200914_0247'),
    ]

    operations = [
        migrations.AlterField(
            model_name='technology',
            name='version',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
    ]
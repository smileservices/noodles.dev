# Generated by Django 3.0.7 on 2021-03-06 05:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('technology', '0001_initial'),
        ('study_resource', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='studyresourcetechnology',
            name='technology',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='technology.Technology'),
        ),
        migrations.AddField(
            model_name='studyresourceimage',
            name='study_resource',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='study_resource.StudyResource'),
        ),
    ]
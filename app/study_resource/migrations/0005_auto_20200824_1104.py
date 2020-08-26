# Generated by Django 3.0.7 on 2020-08-24 11:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('study_resource', '0004_auto_20200816_0520'),
    ]

    operations = [
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('description', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='technology',
            unique_together={('name', 'version')},
        ),
        migrations.CreateModel(
            name='CollectionResources',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.IntegerField()),
                ('collection', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='study_resource.Collection')),
                ('study_resource', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='study_resource.StudyResource')),
            ],
        ),
        migrations.AddField(
            model_name='collection',
            name='resources',
            field=models.ManyToManyField(related_name='resources', through='study_resource.CollectionResources', to='study_resource.StudyResource'),
        ),
    ]

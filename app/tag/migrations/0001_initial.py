# Generated by Django 3.0.7 on 2021-03-27 05:15

from django.db import migrations, models


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
            ],
        ),
    ]

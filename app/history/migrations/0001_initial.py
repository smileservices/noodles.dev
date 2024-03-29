# Generated by Django 3.0.7 on 2021-07-05 15:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ResourceHistoryModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField(db_index=True)),
                ('changes', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('operation_source', models.IntegerField(choices=[(0, 'Direct'), (1, 'Edit Suggestion'), (2, 'Automatic')], db_index=True, default=0)),
                ('operation_type', models.IntegerField(choices=[(0, 'Create'), (1, 'Update'), (2, 'Delete')], db_index=True, default=0)),
                ('author', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.ContentType')),
            ],
        ),
    ]

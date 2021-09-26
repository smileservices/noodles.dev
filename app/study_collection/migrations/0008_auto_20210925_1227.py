# Generated by Django 3.0.7 on 2021-09-25 12:27

from django.db import migrations, models

def set_status(apps, schema_editor):
    model = apps.get_model('category.category')
    model.objects.update(status=1)


class Migration(migrations.Migration):

    dependencies = [
        ('study_collection', '0007_auto_20210702_1538'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='status',
            field=models.IntegerField(choices=[(0, 'Unreviewed'), (1, 'Approved'), (2, 'Rejected'), (4, 'Inactive')], db_index=True, default=1),
        ),
        migrations.RunPython(set_status, migrations.RunPython.noop)
    ]

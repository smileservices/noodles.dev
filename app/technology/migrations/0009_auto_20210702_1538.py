# Generated by Django 3.0.7 on 2021-07-02 15:38

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('technology', '0008_auto_20210612_1822'),
    ]

    operations = [
        migrations.AddField(
            model_name='editsuggestiontechnology',
            name='status',
            field=models.IntegerField(choices=[(0, 'Unreviewed'), (1, 'Approved'), (2, 'Rejected'), (4, 'Inactive')], db_index=True, default=0),
        ),
        migrations.AddField(
            model_name='technology',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='technology',
            name='status',
            field=models.IntegerField(choices=[(0, 'Unreviewed'), (1, 'Approved'), (2, 'Rejected'), (4, 'Inactive')], db_index=True, default=0),
        ),
        migrations.AddField(
            model_name='technology',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
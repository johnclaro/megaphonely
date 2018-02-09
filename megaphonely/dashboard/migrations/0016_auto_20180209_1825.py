# Generated by Django 2.0.1 on 2018-02-09 18:25

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0015_auto_20180209_1332'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='content',
            name='schedule_at',
        ),
        migrations.AddField(
            model_name='content',
            name='schedule_date_at',
            field=models.DateField(blank=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='content',
            name='schedule_time_at',
            field=models.TimeField(blank=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
# Generated by Django 2.0.1 on 2018-02-09 21:12

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0017_auto_20180209_1842'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='is_schedule_at',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='content',
            name='is_schedule_now',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='content',
            name='schedule_at',
            field=models.DateTimeField(blank=True, default=django.utils.timezone.now),
        ),
        migrations.AlterUniqueTogether(
            name='content',
            unique_together={('id', 'is_schedule_now', 'is_schedule_at')},
        ),
    ]
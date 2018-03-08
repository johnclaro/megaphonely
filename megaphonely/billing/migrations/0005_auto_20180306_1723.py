# Generated by Django 2.0.1 on 2018-03-06 17:23

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0004_auto_20180306_1640'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='customer',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='customer',
            name='plan',
            field=models.CharField(choices=[('expired', 'Expired'), ('free', 'Free'), ('standard', 'Standard'), ('advanced', 'Advanced')], max_length=20),
        ),
    ]
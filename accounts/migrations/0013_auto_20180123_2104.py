# Generated by Django 2.0.1 on 2018-01-23 21:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_auto_20180123_2059'),
    ]

    operations = [
        migrations.AlterField(
            model_name='social',
            name='provider',
            field=models.CharField(choices=[(1, 'Twitter')], max_length=30),
        ),
    ]
